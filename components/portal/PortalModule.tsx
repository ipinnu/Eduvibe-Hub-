import { PortalShell } from "@/components/portal/PortalShell";
import { PortalWorkspace } from "@/components/portal/PortalWorkspace";
import { HomeworkReviewQueue } from "@/components/portal/HomeworkReviewQueue";
import type { PortalUser } from "@/lib/auth";
import { getCurricula, getHomework, getNotifications, getProgress, getReports, getSessions, getStudents } from "@/lib/portal-data";

export async function PortalModule({ module, user }: { module: "students" | "sessions" | "homework" | "curriculum" | "reports" | "notifications"; user: PortalUser }) {
  const [students, sessions, homework, curricula, progress, reports, notifications] = await Promise.all([
    getStudents(), getSessions(), getHomework(), getCurricula(), getProgress(), getReports(), getNotifications(),
  ]);
  return <PortalShell role={user.role} userName={user.fullName} userEmail={user.email}><PortalWorkspace module={module} role={user.role} students={students} sessions={sessions} homework={homework} curricula={curricula} progress={progress} reports={reports} notifications={notifications} />{module === "homework" ? <HomeworkReviewQueue role={user.role} homework={homework} /> : null}</PortalShell>;
}
