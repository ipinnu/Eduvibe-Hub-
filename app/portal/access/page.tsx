import { InviteManager } from "@/components/portal/InviteManager";
import { AccessRelations } from "@/components/portal/AccessRelations";
import { PortalShell } from "@/components/portal/PortalShell";
import { requirePortalRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AccessPage() {
  const user = await requirePortalRole(["tutor_admin"]);
  const supabase = await createClient();
  const [{ data: profiles }, { data: students }] = await Promise.all([
    supabase.from("profiles").select("id,full_name,email,role").in("role", ["partner_tutor", "parent", "child"]).order("full_name"),
    supabase.from("students").select("id,full_name").order("full_name"),
  ]);
  return <PortalShell role={user.role} userName={user.fullName} userEmail={user.email}><InviteManager /><AccessRelations profiles={(profiles || []) as never[]} students={students || []} /></PortalShell>;
}
