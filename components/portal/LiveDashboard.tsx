import Link from "next/link";
import type { PortalRole } from "@/lib/portal";
import type { getPortalOverview } from "@/lib/portal-data";

type Overview = Awaited<ReturnType<typeof getPortalOverview>>;

function Stat({ label, value, note, tone = "bg-white" }: { label: string; value: number; note: string; tone?: string }) {
  return (
    <article className={`rounded-2xl border border-ev-line p-5 ${tone}`}>
      <p className="text-[10px] font-bold text-ev-muted">{label}</p>
      <p className="mt-3 font-display text-[34px] leading-none text-ev-green">{value}</p>
      <p className="mt-3 text-[9px] font-semibold text-ev-muted">{note}</p>
    </article>
  );
}

export function LiveDashboard({ role, name, overview }: { role: PortalRole; name: string; overview: Overview }) {
  const staff = role === "tutor_admin" || role === "partner_tutor";
  const nextSessions = overview.sessions.filter((item) => new Date(item.starts_at).getTime() >= overview.generatedAt).slice(0, 5);
  const greeting =
    role === "child" ? "Your next step is ready when you are."
    : role === "parent" ? "Here is the latest view of your child’s learning."
    : "Here is what needs your attention today.";

  const quickLinks: [string, string][] =
    role === "tutor_admin" ?
      [
        ["Homework", "/portal/homework"],
        ["Progress", "/portal/reports"],
        ["Notifications", "/portal/notifications"],
        ["Resources", "/portal/store"],
      ]
    : staff ?
      [
        ["Homework", "/portal/homework"],
        ["Progress", "/portal/reports"],
        ["Notifications", "/portal/notifications"],
        ["Learning paths", "/portal/curriculum"],
      ]
    : [
        ["Homework", "/portal/homework"],
        ["Progress", "/portal/reports"],
        ["Notifications", "/portal/notifications"],
        ["Resources", "/portal/resources"],
      ];

  return (
    <>
      <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-label-sm uppercase text-ev-green-mid">Welcome back</p>
          <h1 className="mt-2 font-display text-[42px] leading-tight">Hello, {name}.</h1>
          <p className="mt-2 text-body-md text-ev-muted">{greeting}</p>
        </div>
        {staff ? (
          <Link href="/portal/sessions" className="rounded-xl bg-ev-green px-5 py-3 text-[11px] font-extrabold text-white shadow-[4px_4px_0_#FFD21F]">
            + Schedule session
          </Link>
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label={staff ? "Students" : "Learners"} value={overview.stats.students} note="Visible to this account" tone="bg-ev-yellow" />
        <Stat label="Sessions this week" value={overview.stats.upcomingSessions} note="Upcoming lessons" tone="bg-ev-teal-lt" />
        <Stat label="Homework due" value={overview.stats.homeworkDue} note="Tasks awaiting completion" tone="bg-ev-blue-lt" />
        <Stat
          label={role === "parent" ? "Published reports" : "Reports due"}
          value={overview.stats.reportsDue}
          note={`${overview.stats.unreadNotifications} unread notification${overview.stats.unreadNotifications === 1 ? "" : "s"}`}
        />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[22px] border border-ev-line bg-white p-5 md:p-6">
          <div className="flex justify-between">
            <h2 className="text-[15px] font-extrabold">Next lessons</h2>
            <Link href="/portal/sessions" className="text-[10px] font-bold text-ev-green-mid">
              Full schedule →
            </Link>
          </div>
          <div className="mt-5 grid gap-3">
            {nextSessions.length ?
              nextSessions.map((session) => (
                <div key={session.id} className="flex flex-col justify-between gap-3 rounded-xl border border-ev-line p-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-[11px] font-extrabold">{session.title}</p>
                    <p className="mt-1 text-[9px] text-ev-muted">
                      {session.student?.full_name} · {new Date(session.starts_at).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {session.meet_url ?
                      <a href={session.meet_url} target="_blank" rel="noreferrer" className="rounded-lg bg-ev-teal px-3 py-2 text-[9px] font-bold">
                        Join Meet
                      </a>
                    : null}
                    <Link href={`/portal/lesson-board/${session.id}`} className="rounded-lg bg-ev-yellow px-3 py-2 text-[9px] font-bold">
                      Board
                    </Link>
                  </div>
                </div>
              ))
            : <p className="rounded-xl bg-ev-board p-6 text-center text-[11px] text-ev-muted">No upcoming lessons yet.</p>}
          </div>
        </section>
        <section className="rounded-[22px] border border-ev-line bg-white p-5 md:p-6">
          <h2 className="text-[15px] font-extrabold">Quick access</h2>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {quickLinks.map(([label, href]) => (
              <Link key={label} href={href} className="rounded-xl bg-ev-board p-4 text-[10px] font-extrabold transition hover:bg-ev-yellow-lt">
                <span className="mb-6 block text-xl text-ev-green">↗</span>
                {label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
