import { PortalShell } from "@/components/portal/PortalShell";
import type { PortalUser } from "@/lib/auth";

const moduleCopy = {
  students: { eyebrow: "Student management", title: "Every learner, clearly understood.", body: "Student profiles, linked parents, assigned tutors, subjects, and progress snapshots will live here.", cards: ["Amina Yusuf · Year 6", "David Okafor · Primary 4", "Zara Bello · Year 5", "Kene Eze · Primary 5"] },
  sessions: { eyebrow: "Lesson schedule", title: "Plan the week without the back-and-forth.", body: "Create sessions, see attendance, open lesson boards, and add Google Meet links from one calm schedule.", cards: ["Today · 3:30 PM · Mathematics", "Today · 5:00 PM · Literacy", "Today · 6:30 PM · Science", "Thursday · 4:00 PM · Mathematics"] },
  reports: { eyebrow: "Reviews and reports", title: "Turn each lesson into visible progress.", body: "Lesson reviews feed parent updates and, later, weekly and monthly progress reports.", cards: ["Amina · July monthly report", "David · Lesson review due", "Zara · Weekly summary ready", "Kene · Parent update sent"] },
  settings: { eyebrow: "Portal settings", title: "Keep EduVibe connected.", body: "Manage tutor details, role access, Supabase, Google Calendar, notifications, and store preferences.", cards: ["Tutor profiles", "Roles and permissions", "Google Calendar", "Notifications"] },
} as const;

export function PortalModulePage({ module, user }: { module: keyof typeof moduleCopy; user: PortalUser }) {
  const roleSpecificReports = user.role === "child"
    ? { eyebrow: "My progress", title: "See how much you’re learning.", body: "Your subject progress, completed activities, and next learning goals live here.", cards: ["Mathematics · Building confidence", "Literacy · On track", "Science · Keep practising", "Latest learning win"] as readonly string[] }
    : user.role === "parent"
      ? { eyebrow: "Progress and reports", title: "Clear updates without having to ask.", body: "See parent-visible lesson updates, subject progress, and reviewed weekly or monthly reports.", cards: ["July monthly report", "Latest lesson update", "Subject progress", "Homework summary"] as readonly string[] }
      : null;
  const content = module === "reports" && roleSpecificReports ? roleSpecificReports : moduleCopy[module];
  const canManage = user.role === "tutor_admin" || user.role === "partner_tutor";
  return (
    <PortalShell role={user.role} userName={user.fullName} userEmail={user.email}>
      <p className="font-mono text-label-sm uppercase text-ev-green-mid">{content.eyebrow}</p>
      <h1 className="mt-3 max-w-3xl font-display text-[42px] leading-tight">{content.title}</h1>
      <p className="mt-3 max-w-2xl text-body-md text-ev-muted">{content.body}</p>
      <div className="mt-8 flex justify-between gap-4"><div className="relative max-w-md flex-1"><input placeholder={`Search ${module}…`} className="w-full rounded-xl border border-ev-line bg-white px-4 py-3 text-[11px] outline-none focus:border-ev-green" /></div>{canManage ? <button className="rounded-xl bg-ev-green px-5 text-[11px] font-extrabold text-white">+ Add new</button> : null}</div>
      <div className="mt-5 overflow-hidden rounded-[22px] border border-ev-line bg-white">
        {content.cards.map((card, index) => <div key={card} className="flex items-center justify-between border-b border-ev-line p-5 last:border-b-0"><div className="flex items-center gap-4"><span className={`flex h-11 w-11 items-center justify-center rounded-xl text-[11px] font-black ${index % 2 ? "bg-ev-teal-lt" : "bg-ev-yellow-lt"}`}>{String(index + 1).padStart(2,"0")}</span><span className="text-[12px] font-bold">{card}</span></div><button aria-label={`Open ${card}`} className="rounded-lg bg-ev-board px-3 py-2 text-[11px] font-bold">Open →</button></div>)}
      </div>
    </PortalShell>
  );
}
