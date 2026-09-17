import { PortalModule } from "@/components/portal/PortalModule";
import { requirePortalRole } from "@/lib/auth";
export default async function CurriculumPage() { const user = await requirePortalRole(["tutor_admin", "partner_tutor"]); return <PortalModule module="curriculum" user={user} />; }
