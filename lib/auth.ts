import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { ROLE_ROUTES, type PortalRole } from "@/lib/portal";
import { createClient } from "@/lib/supabase/server";

export type PortalUser = {
  id: string;
  email: string;
  fullName: string;
  role: PortalRole;
};

export const getPortalUser = cache(async (): Promise<PortalUser> => {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const user = userData.user;

  if (userError || !user) {
    redirect("/portal/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name,role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    redirect("/portal/login?error=profile");
  }

  return {
    id: user.id,
    email: user.email ?? "",
    fullName: profile.full_name || String(user.email ?? "EduVibe member").split("@")[0],
    role: profile.role as PortalRole,
  };
});

export async function requirePortalRole(allowedRoles: PortalRole[]) {
  const user = await getPortalUser();

  if (!allowedRoles.includes(user.role)) {
    redirect(ROLE_ROUTES[user.role]);
  }

  return user;
}
