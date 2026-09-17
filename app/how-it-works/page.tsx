import type { Metadata } from "next";
import Image from "next/image";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { LearningDoodles } from "@/components/ui/LearningDoodles";

export const metadata: Metadata = {
  title: "How Online Tutoring Works for Your Child",
  description:
    "See how EduVibe Hub online tutoring in Nigeria works, from the first parent conversation to assessment, one-to-one lessons, progress updates, and homework support.",
  alternates: {
    canonical: "/how-it-works",
  },
  openGraph: {
    title: "How EduVibe Hub Online Tutoring Works",
    description:
      "A clear parent-friendly process for online tutoring, assessment, lessons, and progress updates.",
    url: "/how-it-works",
  },
};

const journey = [
  {
    number: "01",
    label: "A short parent conversation",
    title: "Tell us what you have noticed.",
    body: "We start with you. Share the subject, the school level, what feels difficult, and what you would love to see change. This is a calm conversation, not a sales call.",
    parent: "You share context and preferred times.",
    tutor: "We listen, ask useful questions, and recommend a starting point.",
  },
  {
    number: "02",
    label: "The discovery session",
    title: "We learn how your child learns.",
    body: "Your child meets the tutor in a friendly online session with simple activities and conversation. We look beyond right or wrong answers to notice confidence, pace, habits, and gaps.",
    parent: "You help your child settle in, then give them room to connect.",
    tutor: "We observe, encourage, and record a clear learning baseline.",
  },
  {
    number: "03",
    label: "A personal learning rhythm",
    title: "Every lesson has a reason.",
    body: "Sessions focus on the skills that matter most, using age-appropriate examples and Nigerian context. The plan adapts as your child improves—without rushing past shaky foundations.",
    parent: "You support consistency and a distraction-free lesson space.",
    tutor: "We teach, revisit, celebrate progress, and adjust the next lesson.",
  },
  {
    number: "04",
    label: "Progress you can see",
    title: "You are never left guessing.",
    body: "You receive useful updates about what was covered, what is improving, and what still needs attention. Monthly progress notes turn every session into a clear, shared picture.",
    parent: "You see the wins and know how to reinforce learning at home.",
    tutor: "We document progress and agree on the next priority with you.",
  },
] as const;

const expectations = [
  ["Session length", "One focused hour, adjusted for younger learners when needed."],
  ["Where lessons happen", "Online, from a quiet space with a stable connection."],
  ["What to bring", "A notebook, pencil, and any schoolwork you want us to review."],
  ["Parent updates", "Brief check-ins plus a fuller end-of-month progress summary."],
] as const;

export default function HowItWorksPage() {
  return (
    <main className="pt-20">
      <section className="relative overflow-hidden bg-ev-yellow">
        <LearningDoodles />
        <div className="relative mx-auto grid max-w-[1200px] gap-10 px-6 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-10 lg:py-28">
          <div>
            <p className="font-mono text-label font-bold uppercase text-ev-green-mid">Your family&apos;s learning journey</p>
            <h1 className="mt-5 max-w-[720px] font-body text-[clamp(44px,6vw,76px)] font-black leading-[0.98] tracking-[-0.055em] text-ev-ink">
              Clear from the first hello to every <span className="scribble text-ev-green-mid">breakthrough.</span>
            </h1>
            <p className="mt-7 max-w-[620px] text-[17px] font-medium leading-8 text-ev-ink/75">
              Great tutoring should never feel mysterious. Here is exactly how we get to know your child, plan each lesson, and keep you involved.
            </p>
          </div>

          <div className="relative pb-8">
            <div className="overflow-hidden rounded-[28px] border-[4px] border-white bg-white shadow-[8px_9px_0_#111A4A]">
              <Image
                src="/online-literacy-learning.png"
                alt="A child enjoying a one-to-one online literacy lesson"
                width={1536}
                height={1024}
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <aside className="relative z-10 mx-4 -mt-9 rotate-1 rounded-2xl border-2 border-ev-green bg-white p-5 shadow-card sm:ml-auto sm:mr-[-12px] sm:max-w-[390px]">
            <p className="font-mono text-label font-bold uppercase text-ev-green-mid">Before lesson one</p>
            <h2 className="mt-3 text-2xl font-black text-ev-ink">You will know three things.</h2>
            <ul className="mt-6 grid gap-4 text-body-sm font-semibold text-ev-muted">
              <li className="flex gap-3"><span className="text-ev-teal">●</span> What your child needs first</li>
              <li className="flex gap-3"><span className="text-ev-yellow">●</span> What a realistic rhythm looks like</li>
              <li className="flex gap-3"><span className="text-ev-green-mid">●</span> How progress will be shared with you</li>
            </ul>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-ev-cream py-24">
        <div className="mx-auto max-w-[1000px] px-6 lg:px-10">
          <div className="mb-14 max-w-[680px]">
            <p className="font-mono text-label font-bold uppercase text-ev-teal">Step by step</p>
            <h2 className="mt-3 font-body text-display-lg font-black tracking-[-0.04em] text-ev-ink">What the journey actually feels like.</h2>
          </div>

          <div className="grid gap-8">
            {journey.map((step, index) => (
              <article key={step.number} className="grid overflow-hidden rounded-[24px] border-2 border-ev-green bg-white shadow-card md:grid-cols-[150px_1fr]">
                <div className={`${index % 2 === 0 ? "bg-ev-green text-white" : "bg-ev-yellow text-ev-green"} flex flex-col justify-between p-6`}>
                  <span className="font-mono text-label font-bold uppercase opacity-70">{step.label}</span>
                  <span className="mt-10 text-6xl font-black">{step.number}</span>
                </div>
                <div className="p-7 md:p-9">
                  <h3 className="text-2xl font-black tracking-[-0.03em] text-ev-ink">{step.title}</h3>
                  <p className="mt-4 max-w-[690px] text-body-md text-ev-muted">{step.body}</p>
                  <div className="mt-7 grid gap-3 border-t border-ev-line pt-6 sm:grid-cols-2">
                    <p className="text-body-sm text-ev-muted"><strong className="block text-ev-green">Your part</strong>{step.parent}</p>
                    <p className="text-body-sm text-ev-muted"><strong className="block text-ev-green-mid">Tutor&apos;s part</strong>{step.tutor}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="learning-pattern bg-[#111A4A] py-24 text-white" style={{ backgroundColor: "#111A4A" }}>
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <p className="font-mono text-label font-bold uppercase text-ev-yellow">The practical details</p>
          <h2 className="mt-3 max-w-[620px] font-body text-display-lg font-black tracking-[-0.04em]">Simple routines help children settle and learn.</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {expectations.map(([title, body]) => (
              <div key={title} className="rounded-2xl border border-white/15 bg-white/[0.08] p-6">
                <h3 className="font-bold text-white">{title}</h3>
                <p className="mt-2 text-body-sm text-[#C7CCE4]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
    </main>
  );
}
