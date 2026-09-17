import Link from "next/link";
import { ROLE_PEOPLE, type PortalRole } from "@/lib/portal";

function StatCard({ label, value, note, tone = "yellow" }: { label: string; value: string; note: string; tone?: "yellow" | "teal" | "blue" | "white" }) {
  const tones = {
    yellow: "bg-ev-yellow",
    teal: "bg-ev-teal-lt",
    blue: "bg-ev-blue-lt",
    white: "bg-white",
  };
  return (
    <article className={`rounded-2xl border border-ev-line p-5 ${tones[tone]}`}>
      <p className="text-[11px] font-bold text-ev-muted">{label}</p>
      <p className="mt-3 font-display text-[34px] leading-none text-ev-green">{value}</p>
      <p className="mt-3 text-[10px] font-semibold text-ev-muted">{note}</p>
    </article>
  );
}

function SectionCard({ title, action, children, className = "" }: { title: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-[22px] border border-ev-line bg-white p-5 md:p-6 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[15px] font-extrabold text-ev-ink">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Welcome({ role, name }: { role: PortalRole; name?: string }) {
  const person = ROLE_PEOPLE[role];
  return (
    <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <p className="font-mono text-label-sm uppercase text-ev-green-mid">Welcome back</p>
        <h1 className="mt-2 font-display text-[38px] leading-tight text-ev-ink md:text-[46px]">Hello, {name || person.name}.</h1>
        <p className="mt-2 text-body-md text-ev-muted">{person.greeting}</p>
      </div>
      {(role === "tutor_admin" || role === "partner_tutor") ? (
        <Link href="/portal/sessions" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-ev-green px-5 text-[12px] font-extrabold text-white shadow-[4px_4px_0_#FFD21F]">+ Schedule session</Link>
      ) : null}
    </div>
  );
}

function AdminDashboard() {
  const sessions = [
    { time: "3:30 PM", name: "Amina Yusuf", subject: "Mathematics", tone: "bg-ev-yellow" },
    { time: "5:00 PM", name: "David Okafor", subject: "Literacy", tone: "bg-ev-teal-lt" },
    { time: "6:30 PM", name: "Zara Bello", subject: "Science", tone: "bg-ev-blue-lt" },
  ];
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active students" value="18" note="+3 this month" />
        <StatCard label="Sessions this week" value="24" note="7 still to come" tone="teal" />
        <StatCard label="Reports due" value="4" note="2 need attention today" tone="blue" />
        <StatCard label="Store products" value="1" note="Published on the website" tone="white" />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <SectionCard title="Today’s teaching" action={<Link href="/portal/sessions" className="text-[11px] font-bold text-ev-green-mid">See schedule →</Link>}>
          <div className="mt-5 grid gap-3">
            {sessions.map((session) => (
              <div key={session.time} className="grid grid-cols-[70px_1fr_auto] items-center gap-3 rounded-xl border border-ev-line p-3 sm:grid-cols-[84px_1fr_auto]">
                <span className="text-[11px] font-extrabold text-ev-green">{session.time}</span>
                <span>
                  <span className="block text-[12px] font-bold text-ev-ink">{session.name}</span>
                  <span className="mt-0.5 block text-[10px] text-ev-muted">{session.subject} · 60 minutes</span>
                </span>
                <span className={`hidden rounded-full px-3 py-1.5 text-[9px] font-bold text-ev-green sm:inline-flex ${session.tone}`}>Ready</span>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Quick actions">
          <div className="mt-5 grid grid-cols-2 gap-3">
            {[
              ["Add student", "/portal/students", "◎"],
              ["Write report", "/portal/reports", "▤"],
              ["Update store", "/portal/store", "◇"],
              ["Open board", "/portal/sessions", "✎"],
            ].map(([label, href, icon]) => (
              <Link key={label} href={href} className="group rounded-xl bg-ev-board p-4 transition hover:-translate-y-0.5 hover:bg-ev-yellow-lt">
                <span className="text-xl text-ev-green">{icon}</span>
                <span className="mt-5 block text-[11px] font-extrabold text-ev-ink">{label}</span>
              </Link>
            ))}
          </div>
        </SectionCard>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <SectionCard title="Learners to check in on">
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[{ name: "Kene", skill: "Equivalent fractions", score: "Needs practice", colour: "bg-[#FFE8E5]" }, { name: "Lara", skill: "Reading fluency", score: "Building confidence", colour: "bg-ev-yellow-lt" }].map((student) => (
              <div key={student.name} className={`rounded-xl p-4 ${student.colour}`}>
                <p className="text-[12px] font-extrabold">{student.name}</p>
                <p className="mt-2 text-[10px] text-ev-muted">{student.skill}</p>
                <p className="mt-4 text-[9px] font-bold uppercase tracking-wide text-ev-green">{student.score}</p>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Partner tutor activity">
          <div className="mt-5 space-y-4">
            <div className="flex gap-3"><span className="h-9 w-9 rounded-xl bg-ev-teal-lt text-center text-[11px] font-black leading-9">TO</span><p className="text-[11px] leading-5 text-ev-muted"><strong className="text-ev-ink">Tomi</strong> completed David’s literacy review.<br/><span className="text-[9px]">18 minutes ago</span></p></div>
            <div className="flex gap-3"><span className="h-9 w-9 rounded-xl bg-ev-blue-lt text-center text-[11px] font-black leading-9">TO</span><p className="text-[11px] leading-5 text-ev-muted"><strong className="text-ev-ink">Tomi</strong> moved Zara’s session to Thursday.<br/><span className="text-[9px]">2 hours ago</span></p></div>
          </div>
        </SectionCard>
      </div>
    </>
  );
}

function TutorDashboard() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Assigned learners" value="6" note="Across 3 subjects" />
          <StatCard label="Today’s lessons" value="3" note="Next at 3:30 PM" tone="teal" />
          <StatCard label="Reviews to finish" value="2" note="Due by tomorrow" tone="blue" />
        </div>
        <SectionCard title="My teaching day">
          <div className="mt-5 space-y-3">
            {["3:30 PM · Amina · Mathematics", "5:00 PM · David · Literacy", "6:30 PM · Zara · Science"].map((item, index) => (
              <div key={item} className="flex items-center justify-between rounded-xl bg-ev-board p-4"><span className="text-[11px] font-bold">{item}</span><span className={`h-2.5 w-2.5 rounded-full ${index === 0 ? "bg-ev-teal" : "bg-ev-yellow"}`} /></div>
            ))}
          </div>
        </SectionCard>
      </div>
      <SectionCard title="Assigned learners">
        <div className="mt-5 grid gap-3">
          {["Amina Yusuf · Year 6", "David Okafor · Primary 4", "Zara Bello · Year 5", "Kene Eze · Primary 5"].map((student, index) => (
            <div key={student} className="flex items-center gap-3 rounded-xl border border-ev-line p-3"><span className={`flex h-10 w-10 items-center justify-center rounded-xl text-[11px] font-black ${index % 2 ? "bg-ev-teal-lt" : "bg-ev-yellow-lt"}`}>{student.split(" ").map((word) => word[0]).slice(0,2).join("")}</span><span className="text-[11px] font-bold">{student}</span></div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function ParentDashboard() {
  return (
    <>
      <section className="relative overflow-hidden rounded-[26px] bg-ev-green p-7 text-white md:p-9">
        <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full border-[34px] border-ev-yellow/20" />
        <p className="font-mono text-label-sm uppercase text-ev-yellow">Amina’s learning snapshot</p>
        <h2 className="mt-3 max-w-xl font-display text-[34px] leading-tight">A steady week with a lovely breakthrough in place value.</h2>
        <p className="mt-4 max-w-2xl text-body-sm text-white/70">Amina explained the value of digits in numbers up to ten million independently. We’ll keep strengthening rounding next.</p>
        <div className="mt-7 flex flex-wrap gap-3"><span className="rounded-full bg-white/10 px-4 py-2 text-[10px] font-bold">4 sessions this month</span><span className="rounded-full bg-ev-teal px-4 py-2 text-[10px] font-bold text-ev-green">On track</span></div>
      </section>
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <SectionCard title="Next session" className="lg:col-span-2">
          <div className="mt-5 flex flex-col justify-between gap-5 rounded-xl bg-ev-yellow-lt p-5 sm:flex-row sm:items-center">
            <div><p className="font-display text-[26px]">Mathematics with Peace</p><p className="mt-2 text-[11px] text-ev-muted">Tuesday · 4 August · 3:30 PM</p></div>
            <button className="rounded-xl bg-ev-green px-5 py-3 text-[11px] font-extrabold text-white">Join lesson</button>
          </div>
        </SectionCard>
        <SectionCard title="Homework"><p className="mt-5 font-display text-[28px] text-ev-green">2 tasks</p><p className="mt-2 text-[10px] text-ev-muted">One is due before Tuesday’s lesson.</p></SectionCard>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <SectionCard title="Subject progress">
          <div className="mt-6 space-y-5">
            {[["Mathematics", 74, "bg-ev-yellow"], ["Literacy", 82, "bg-ev-teal"], ["Science", 67, "bg-ev-green-mid"]].map(([subject, progress, color]) => (
              <div key={String(subject)}><div className="mb-2 flex justify-between text-[11px] font-bold"><span>{subject}</span><span>{progress}%</span></div><div className="h-2 overflow-hidden rounded-full bg-ev-board"><div className={`h-full rounded-full ${color}`} style={{ width: `${progress}%` }} /></div></div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Latest from Peace"><blockquote className="mt-5 font-display text-[23px] leading-relaxed text-ev-ink">“Amina stayed with a difficult rounding question today and found the pattern herself. That patience is becoming a real strength.”</blockquote><p className="mt-5 text-[10px] font-bold text-ev-muted">Lesson update · 30 July</p></SectionCard>
      </div>
    </>
  );
}

function ChildDashboard() {
  return (
    <>
      <section className="relative overflow-hidden rounded-[30px] border-2 border-ev-green bg-ev-yellow p-7 shadow-[8px_8px_0_#111A4A] md:p-10">
        <div className="absolute right-7 top-5 rotate-6 text-5xl" aria-hidden="true">✦</div>
        <p className="font-mono text-label-sm uppercase text-ev-green">Your next adventure</p>
        <h2 className="mt-3 max-w-xl font-display text-[40px] leading-tight text-ev-green md:text-[52px]">Numbers can tell stories. Let’s discover one.</h2>
        <p className="mt-4 text-[12px] font-semibold text-ev-green/70">Mathematics with Peace · Tuesday at 3:30 PM</p>
        <button className="mt-7 rounded-xl border-2 border-ev-green bg-white px-6 py-3 text-[12px] font-extrabold shadow-[4px_4px_0_#111A4A]">Open my lesson board</button>
      </section>
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <SectionCard title="Today’s mission" className="lg:col-span-2"><div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-ev-teal-lt p-5"><p className="text-2xl">✓</p><p className="mt-5 text-[12px] font-extrabold">Read for 15 minutes</p><p className="mt-2 text-[10px] text-ev-muted">Completed — brilliant!</p></div><div className="rounded-xl bg-ev-blue-lt p-5"><p className="text-2xl">123</p><p className="mt-5 text-[12px] font-extrabold">Rounding challenge</p><p className="mt-2 text-[10px] text-ev-muted">8 questions left</p></div></div></SectionCard>
        <SectionCard title="My learning streak"><div className="mt-5 flex items-end gap-2">{[3,5,4,7,6,9,8].map((height,index)=><span key={index} className={`w-full rounded-t-md ${index === 6 ? "bg-ev-yellow" : "bg-ev-teal-lt"}`} style={{height:`${height*8}px`}} />)}</div><p className="mt-4 text-center text-[11px] font-extrabold text-ev-green">7 days of showing up!</p></SectionCard>
      </div>
      <div className="mt-5"><SectionCard title="Look how much you’ve grown"><div className="mt-5 grid gap-4 sm:grid-cols-3">{[["Mathematics","74%","bg-ev-yellow"],["Literacy","82%","bg-ev-teal-lt"],["Science","67%","bg-ev-blue-lt"]].map(([subject,score,tone])=><div key={subject} className={`rounded-2xl p-5 ${tone}`}><p className="text-[11px] font-bold">{subject}</p><p className="mt-3 font-display text-[34px]">{score}</p><p className="mt-2 text-[9px] font-bold uppercase text-ev-muted">Keep going ↑</p></div>)}</div></SectionCard></div>
    </>
  );
}

export function Dashboard({ role, name }: { role: PortalRole; name?: string }) {
  return (
    <>
      <Welcome role={role} name={name} />
      {role === "tutor_admin" ? <AdminDashboard /> : null}
      {role === "partner_tutor" ? <TutorDashboard /> : null}
      {role === "parent" ? <ParentDashboard /> : null}
      {role === "child" ? <ChildDashboard /> : null}
    </>
  );
}
