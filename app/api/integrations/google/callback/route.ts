import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { requirePortalRole } from "@/lib/auth";
import { encryptToken, exchangeGoogleCode } from "@/lib/google-calendar";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const user = await requirePortalRole(["tutor_admin", "partner_tutor"]);
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const expectedState = cookieStore.get("google_oauth_state")?.value;
  cookieStore.delete("google_oauth_state");
  if (!code || !state || !expectedState || state !== expectedState) return NextResponse.redirect(new URL("/portal/settings?google=error&message=Invalid+OAuth+state", request.url));
  try {
    const tokens = await exchangeGoogleCode(code);
    const supabase = await createClient();
    const payload = {
      user_id: user.id,
      encrypted_access_token: encryptToken(tokens.access_token!),
      encrypted_refresh_token: tokens.refresh_token ? encryptToken(tokens.refresh_token) : undefined,
      access_token_expires_at: new Date(Date.now() + (tokens.expires_in || 3600) * 1000).toISOString(),
      scope: tokens.scope || "",
    };
    const { error } = await supabase.from("google_connections").upsert(payload, { onConflict: "user_id" });
    if (error) throw error;
    return NextResponse.redirect(new URL("/portal/settings?google=connected", request.url));
  } catch (error) {
    const message = encodeURIComponent(error instanceof Error ? error.message : "Google connection failed.");
    return NextResponse.redirect(new URL(`/portal/settings?google=error&message=${message}`, request.url));
  }
}

