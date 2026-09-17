import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { PortalRole } from "@/lib/portal";
import { getAuthRedirectUrl, getSiteUrl } from "@/lib/site-url";

const inviteRoles: PortalRole[] = ["partner_tutor", "parent", "child"];

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (!userId) {
    return NextResponse.json({ error: "Sign in is required." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (profile?.role !== "tutor_admin") {
    return NextResponse.json({ error: "Only the tutor admin can invite accounts." }, { status: 403 });
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return NextResponse.json(
      { error: "Account invitations need SUPABASE_SERVICE_ROLE_KEY in the server environment." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as {
    email?: string;
    fullName?: string;
    role?: PortalRole;
    action?: "invite" | "reset";
  };
  const email = body.email?.trim().toLowerCase();
  const fullName = body.fullName?.trim();
  const role = body.role;
  const action = body.action === "reset" ? "reset" : "invite";

  if (!email) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  if (action === "invite" && (!fullName || !role || !inviteRoles.includes(role))) {
    return NextResponse.json({ error: "A name, valid email, and permitted role are required." }, { status: 400 });
  }

  let redirectTo: string;
  let siteUrl: string;
  try {
    siteUrl = getSiteUrl(request);
    redirectTo = getAuthRedirectUrl("/portal/reset-password", request);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Public site URL is not configured." },
      { status: 503 },
    );
  }

  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  if (action === "reset") {
    const { error: resetError } = await admin.auth.resetPasswordForEmail(email, { redirectTo });
    if (resetError) {
      return NextResponse.json(
        {
          error: `${resetError.message}. Confirm ${redirectTo} is listed under Supabase Auth → Redirect URLs.`,
        },
        { status: 400 },
      );
    }
    return NextResponse.json({
      message: `Password reset email sent to ${email}. The link signs them in, then opens the set-password screen.`,
    });
  }

  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { full_name: fullName },
    redirectTo,
  });

  const alreadyRegistered =
    Boolean(error?.message) &&
    /already|registered|exists/i.test(error?.message ?? "");

  if (alreadyRegistered) {
    const { error: resetError } = await admin.auth.resetPasswordForEmail(email, { redirectTo });
    if (resetError) {
      return NextResponse.json(
        {
          error: `That account already exists, and the reset email failed: ${resetError.message}`,
        },
        { status: 400 },
      );
    }

    if (fullName && role) {
      await admin.from("profiles").update({ full_name: fullName, role, email }).eq("email", email);
    }

    return NextResponse.json({
      message: `${email} already has an account, so a password reset link was sent instead. It opens the set-password screen with a signed-in session.`,
    });
  }

  if (error || !data.user) {
    const hint =
      error?.message?.toLowerCase().includes("redirect") ?
        ` Also add ${siteUrl}/auth/callback to Supabase Auth → URL Configuration → Redirect URLs, and set Site URL to ${siteUrl}.`
      : "";
    return NextResponse.json(
      { error: `${error?.message ?? "The invitation could not be created."}${hint}` },
      { status: 400 },
    );
  }

  const { error: profileError } = await admin
    .from("profiles")
    .update({ full_name: fullName, role, email })
    .eq("id", data.user.id);

  if (profileError) {
    return NextResponse.json({ error: `User invited, but role assignment failed: ${profileError.message}` }, { status: 500 });
  }

  return NextResponse.json({
    message: `Invitation sent to ${email}. Their email link signs them in, then opens the set-password screen.`,
  });
}
