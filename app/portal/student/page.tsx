import { LiveDashboard } from "@/components/portal/LiveDashboard";
import { PortalShell } from "@/components/portal/PortalShell";
import { requirePortalRole } from "@/lib/auth";
import { getPortalOverview } from "@/lib/portal-data";

export default async function StudentPortalPage() {
  const user = await requirePortalRole(["child"]);
  const overview = await getPortalOverview(user);
  return <PortalShell role={user.role} userName={user.fullName} userEmail={user.email}><LiveDashboard role={user.role} name={user.fullName} overview={overview} /></PortalShell>;
}
