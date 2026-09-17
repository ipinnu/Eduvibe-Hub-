import { PortalShell } from "@/components/portal/PortalShell";
import { StoreManager } from "@/components/portal/StoreManager";
import { requirePortalRole } from "@/lib/auth";

export default async function PortalStorePage() {
  const user = await requirePortalRole(["tutor_admin"]);
  return <PortalShell role={user.role} userName={user.fullName} userEmail={user.email}><StoreManager /></PortalShell>;
}
