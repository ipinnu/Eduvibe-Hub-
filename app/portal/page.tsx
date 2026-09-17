import { redirect } from "next/navigation";
import { getPortalUser } from "@/lib/auth";
import { ROLE_ROUTES } from "@/lib/portal";

export default async function PortalPage() {
  const user = await getPortalUser();
  redirect(ROLE_ROUTES[user.role]);
}
