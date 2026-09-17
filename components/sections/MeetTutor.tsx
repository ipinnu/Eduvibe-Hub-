import Image from "next/image";
import Link from "next/link";
import { COPY } from "@/lib/constants";
import { LearningDoodles } from "@/components/ui/LearningDoodles";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function MeetTutor() {
  return (
    <section className="relative overflow-hidden bg-ev-board py-20 sm:py-24">
      <LearningDoodles />
      <div className="relative mx-auto grid max-w-[1200px] gap-10 px-6 md:grid-cols-[1.05fr_0.95fr] md:items-center lg:gap-16 lg:px-10">
        <RevealOnScroll direction="right">
          <div className="relative mx-auto max-w-[620px]">
            <div
              aria-hidden="true"
              className="absolute inset-0 translate-x-3 translate-y-3 rotate-2 rounded-[30px] bg-ev-yellow"
            />
            <div className="relative -rotate-1 overflow-hidden rounded-[30px] border-[4px] border-white bg-white shadow-soft">
              <Image
                src="/peace-online-tutor-chic.webp"
                alt="Peace teaching an online lesson from her home workspace"
                width={1240}
                height={930}
                sizes="(min-width: 768px) 52vw, 100vw"
                unoptimized
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <span className="absolute -bottom-3 left-5 rotate-1 rounded-full border-2 border-ev-green bg-white px-4 py-2 font-mono text-label-sm font-bold uppercase text-ev-green shadow-card">
              {COPY.tutorIntro.imageLabel}
            </span>
          </div>
        </RevealOnScroll>

        <RevealOnScroll direction="left" delay={0.1}>
          <SectionLabel>{COPY.tutorIntro.eyebrow}</SectionLabel>
          <h2 className="max-w-[540px] font-body text-display-lg font-black tracking-[-0.04em] text-ev-ink">
            {COPY.tutorIntro.title}
          </h2>
          <p className="mt-5 max-w-[540px] text-body-lg text-ev-muted">
            {COPY.tutorIntro.body}
          </p>

          <ul className="mt-7 grid gap-3">
            {COPY.tutorIntro.points.map((point) => (
              <li key={point} className="flex items-center gap-3 text-sm font-bold text-ev-green">
                <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-ev-yellow" />
                {point}
              </li>
            ))}
          </ul>

          <Link
            href="/about"
            className="mt-7 inline-flex min-h-12 items-center rounded-xl border-2 border-ev-green bg-white px-5 text-[13px] font-extrabold text-ev-green shadow-[4px_4px_0_#FFD21F] transition hover:-translate-y-1"
          >
            {COPY.tutorIntro.cta} <span aria-hidden="true" className="ml-3">-&gt;</span>
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
}
