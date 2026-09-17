"use server";

import { ROLE_ROUTES, type PortalRole } from "@/lib/portal";
import { createClient } from "@/lib/supabase/server";

type LoginResult =
  | { ok: true; redirectTo: string }
  | { ok: false; error: string };

export async function signInToPortal(formData: FormData): Promise<LoginResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { ok: false, error: "Enter your email address and password." };
  }

  const supabase = await createClient();
  const { data, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !data.user) {
    return { ok: false, error: authError?.message ?? "Unable to sign in." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError || !profile?.role) {
    await supabase.auth.signOut();
    return {
      ok: false,
      error:
        "Your login worked, but your portal profile or role is not set up yet. Ask the tutor admin to confirm your account access.",
    };
  }

  const role = profile.role as PortalRole;
  return { ok: true, redirectTo: ROLE_ROUTES[role] ?? "/portal" };
}
