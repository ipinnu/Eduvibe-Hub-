import { PortalModule } from "@/components/portal/PortalModule";
import { requirePortalRole } from "@/lib/auth";
export default async function HomeworkPage() { const user = await requirePortalRole(["tutor_admin", "partner_tutor", "parent", "child"]); return <PortalModule module="homework" user={user} />; }
