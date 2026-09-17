import type { Metadata } from "next";
import Image from "next/image";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Testimonials } from "@/components/sections/Testimonials";
import { LearningDoodles } from "@/components/ui/LearningDoodles";

export const metadata: Metadata = {
  title: "About Peace and EduVibe Hub Online Tutoring",
  description:
    "Meet Peace, the educator behind EduVibe Hub, and learn how personalised online tutoring helps children in Nigeria build confidence and stronger learning habits.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Peace and EduVibe Hub",
    description:
      "The educator and teaching approach behind EduVibe Hub online tutoring in Nigeria.",
    url: "/about",
  },
};

const principles = [
  {
    number: "01",
    title: "Connection before correction",
    body: "Children take healthy risks when they feel safe. A warm relationship makes it easier to ask questions, make mistakes, and try again.",
  },
  {
    number: "02",
    title: "Understand before memorising",
    body: "A correct answer is useful; knowing why it is correct lasts longer. Lessons slow down where needed and build strong foundations.",
  },
  {
    number: "03",
    title: "Progress belongs to the team",
    body: "Tutor, child, and parent each see a different part of the picture. Honest updates keep everyone working toward the same goal.",
  },
] as const;

export default function AboutPage() {
  return (
    <main className="pt-20">
      <section className="overflow-hidden bg-ev-board">
        <div className="mx-auto grid min-h-[680px] max-w-[1200px] gap-14 px-6 py-16 md:grid-cols-[0.9fr_1.1fr] md:items-center lg:px-10 lg:py-24">
          <div className="relative mx-auto min-h-[590px] w-full max-w-[450px] sm:min-h-[650px]">
            <div className="absolute inset-x-5 bottom-3 top-20 translate-x-3 translate-y-3 rotate-3 rounded-[36px] bg-ev-yellow" />
            <div className="learning-pattern absolute inset-x-5 bottom-3 top-20 -rotate-2 overflow-hidden rounded-[36px] border-[5px] border-white bg-ev-green shadow-soft">
              <div className="absolute -left-5 top-14 h-28 w-28 rounded-full border-[18px] border-ev-teal/70" aria-hidden="true" />
              <div className="absolute -right-7 bottom-24 h-36 w-36 rotate-12 rounded-[28px] border-[18px] border-ev-yellow/80" aria-hidden="true" />
              <span className="absolute right-8 top-8 text-4xl text-ev-yellow" aria-hidden="true">✦</span>
              <span className="absolute left-8 top-48 rotate-[-12deg] text-3xl font-black text-white/15" aria-hidden="true">ABC</span>
            </div>

            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 top-0 z-10 flex items-end justify-center"
            >
              <Image
                src="/Ada-cutout.png"
                alt="Peace, the educator behind EduVibe Hub"
                width={359}
                height={1102}
                priority
                className="h-[570px] w-auto max-w-none object-contain sm:h-[640px]"
                style={{
                  filter:
                    "drop-shadow(-3px 0 0 white) drop-shadow(3px 0 0 white) drop-shadow(0 -3px 0 white) drop-shadow(0 3px 0 white) drop-shadow(9px 10px 0 #0868BF)",
                }}
              />
            </div>

            <div className="absolute -bottom-3 right-0 z-20 rotate-2 rounded-2xl border-2 border-ev-green bg-white px-5 py-4 shadow-card sm:-right-5">
              <p className="font-mono text-label font-bold uppercase text-ev-green-mid">Meet Peace</p>
              <p className="mt-1 text-sm font-black text-ev-ink">EduVibe Hub Educator</p>
              <div className="mt-2 flex gap-1.5" aria-hidden="true">
                <span className="h-2 w-2 rounded-full bg-ev-yellow" />
                <span className="h-2 w-2 rounded-full bg-ev-teal" />
                <span className="h-2 w-2 rounded-full bg-ev-green-mid" />
              </div>
            </div>
          </div>

          <div>
            <p className="font-mono text-label font-bold uppercase text-ev-green-mid">Meet Peace, your educator</p>
            <h1 className="mt-5 max-w-[650px] font-body text-[clamp(44px,6vw,72px)] font-black leading-[0.98] tracking-[-0.055em] text-ev-ink">
              The person who notices the moment a child <span className="scribble text-ev-green-mid">lights up.</span>
            </h1>
            <p className="mt-7 max-w-[600px] text-[17px] font-medium leading-8 text-ev-muted">
              EduVibe Hub is built around attentive, one-to-one teaching. Every session begins with the child in front of the screen—their pace, their questions, their confidence, and the small signals that show what they need next.
            </p>
            <blockquote className="mt-8 border-l-4 border-ev-yellow pl-5 text-xl font-black leading-relaxed text-ev-green">
              “I do not want a child to simply finish the worksheet. I want them to leave knowing they can figure things out.”
            </blockquote>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ev-yellow py-20 sm:py-24">
        <LearningDoodles />
        <div className="relative mx-auto max-w-[1200px] px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="font-mono text-label font-bold uppercase text-ev-green-mid">The teaching approach</p>
              <h2 className="mt-3 font-body text-display-lg font-black tracking-[-0.04em] text-ev-ink">Warm enough to feel safe. Clear enough to grow.</h2>
              <p className="mt-5 text-body-md text-ev-ink/70">These principles shape how lessons are planned, how feedback is given, and how progress is shared.</p>
            </div>
            <div className="grid gap-5">
              {principles.map((principle) => (
                <article key={principle.number} className="grid rounded-2xl border-2 border-ev-green bg-white p-6 shadow-card sm:grid-cols-[64px_1fr] sm:gap-5">
                  <span className="font-mono text-2xl font-black text-ev-green-mid">{principle.number}</span>
                  <div>
                    <h3 className="text-xl font-black text-ev-ink">{principle.title}</h3>
                    <p className="mt-2 text-body-sm text-ev-muted">{principle.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ev-cream py-24">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-6 md:grid-cols-2 md:items-center lg:px-10">
          <div>
            <p className="font-mono text-label font-bold uppercase text-ev-teal">Why EduVibe Hub exists</p>
            <h2 className="mt-3 font-body text-display-lg font-black tracking-[-0.04em] text-ev-ink">Extra attention can change how a child learns.</h2>
          </div>
          <div className="rounded-[28px] bg-ev-board p-8">
            <p className="text-[17px] leading-8 text-ev-muted">
              In a busy classroom, a quiet misunderstanding can travel with a child for months. EduVibe Hub creates the time and attention to catch it early, unpack it carefully, and replace frustration with genuine understanding.
            </p>
            <p className="mt-5 text-[17px] leading-8 text-ev-muted">
              That is why parents receive clear updates too: confidence grows faster when the adults around a child understand the plan and celebrate the same progress.
            </p>
          </div>
        </div>
      </section>

      <Testimonials />
      <FinalCTA />
    </main>
  );
}
