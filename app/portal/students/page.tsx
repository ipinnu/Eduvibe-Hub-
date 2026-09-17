import { PortalModule } from "@/components/portal/PortalModule";
import { requirePortalRole } from "@/lib/auth";
export default async function StudentsPage() { const user = await requirePortalRole(["tutor_admin", "partner_tutor"]); return <PortalModule module="students" user={user} />; }
