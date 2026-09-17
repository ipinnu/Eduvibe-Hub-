import { PortalModule } from "@/components/portal/PortalModule";
import { requirePortalRole } from "@/lib/auth";
export default async function SessionsPage() { const user = await requirePortalRole(["tutor_admin", "partner_tutor", "parent", "child"]); return <PortalModule module="sessions" user={user} />; }
