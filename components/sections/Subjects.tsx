import Image from "next/image";
import Link from "next/link";
import { COPY } from "@/lib/constants";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SubjectIllustration } from "@/components/ui/SubjectIllustration";
import { BookCallButton } from "@/components/ui/Button";
import { LearningDoodles } from "@/components/ui/LearningDoodles";

const toneClasses = {
  yellow: "bg-ev-yellow-lt",
  teal: "bg-ev-teal-lt",
  blue: "bg-ev-blue-lt",
} as const;

const cardTilts = ["-rotate-[1deg]", "rotate-[0.7deg]", "-rotate-[0.6deg]"] as const;

type SubjectsProps = {
  compact?: boolean;
};

export function Subjects({ compact = false }: SubjectsProps) {
  return (
    <>
      <section id="subjects" className="overflow-hidden bg-ev-yellow py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <RevealOnScroll>
            <SectionLabel>{COPY.subjects.eyebrow}</SectionLabel>
            <h2 className="max-w-[620px] font-body text-display-lg font-black tracking-[-0.04em] text-ev-ink">
              {COPY.subjects.sectionTitle}
            </h2>
          </RevealOnScroll>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
            {COPY.subjects.cards.map((subject, index) => (
              <RevealOnScroll key={subject.title} delay={index * 0.1}>
                <article
                  className={`group relative h-full min-h-[430px] overflow-hidden rounded-[22px] border-[3px] border-ev-green px-6 pb-7 pt-12 shadow-card transition duration-300 hover:-translate-y-2 hover:rotate-0 sm:px-7 ${cardTilts[index]} ${index === 1 ? "bg-ev-green text-white" : "bg-[#fffdf7]"}`}
                >
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-0 opacity-40 ${index === 1 ? "opacity-10" : ""}`}
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(to bottom, transparent 0, transparent 38px, rgba(8,104,191,0.14) 39px, transparent 40px)",
                      backgroundPosition: "0 44px",
                    }}
                  />
                  <div aria-hidden="true" className="absolute left-0 right-0 top-4 flex justify-around px-5">
                    {Array.from({ length: 5 }).map((_, holeIndex) => (
                      <span
                        key={holeIndex}
                        className="h-3.5 w-3.5 rounded-full border-2 border-ev-green bg-ev-yellow shadow-[inset_1px_1px_2px_rgba(16,20,58,0.25)]"
                      />
                    ))}
                  </div>

                  <div className="relative z-10">
                    <div
                      className={`mx-auto mb-5 h-[160px] w-full max-w-[240px] rounded-2xl p-2 ${toneClasses[subject.tone]} transition-transform duration-300 group-hover:scale-[1.04]`}
                    >
                      <SubjectIllustration name={subject.icon} inverted={index === 1} />
                    </div>
                    <h3 className={`text-center text-[24px] font-black tracking-[-0.02em] ${index === 1 ? "text-white" : "text-ev-ink"}`}>
                      {subject.title}
                    </h3>
                    <p className={`mx-auto mt-3 max-w-[310px] text-center text-body-sm ${index === 1 ? "text-white/75" : "text-ev-muted"}`}>
                      {subject.body}
                    </p>
                    <div className="mt-6 flex justify-center">
                      <span
                        className={`inline-flex rounded-full border-2 border-ev-green px-4 py-1.5 font-mono text-label-sm font-bold text-ev-green ${toneClasses[subject.tone]}`}
                      >
                        {subject.age}
                      </span>
                    </div>
                  </div>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {compact ? <LearningSupportSummary /> : <LearningSupport />}
    </>
  );
}

function LearningSupportSummary() {
  return (
    <section id="learning-support" className="relative overflow-hidden bg-ev-cream py-16 sm:py-20">
      <LearningDoodles className="opacity-70" />
      <div
        aria-hidden="true"
        className="absolute -right-20 top-12 h-52 w-52 rotate-12 rounded-[44px] border-[22px] border-ev-yellow/55"
      />
      <div className="relative mx-auto grid max-w-[1200px] gap-10 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <RevealOnScroll>
          <SectionLabel>{COPY.subjects.support.eyebrow}</SectionLabel>
          <h2 className="max-w-[470px] font-body text-display-lg font-black tracking-[-0.04em] text-ev-ink">
            Support that fits the moment.
          </h2>
          <p className="mt-5 max-w-[470px] text-body-lg text-ev-muted">
            Start with what your child needs now. Open a pathway for a quick overview, or visit the Subjects page for the full offer.
          </p>
          <Link
            href="/subjects#learning-support"
            className="mt-7 inline-flex min-h-12 items-center rounded-xl border-2 border-ev-green bg-white px-5 text-[13px] font-extrabold text-ev-green shadow-[4px_4px_0_#FFD21F] transition hover:-translate-y-1"
          >
            Explore all subjects and support <span aria-hidden="true" className="ml-3">-&gt;</span>
          </Link>
        </RevealOnScroll>

        <div className="grid gap-3">
          {COPY.subjects.support.groups.map((group, index) => (
            <RevealOnScroll key={group.number} delay={index * 0.07}>
              <details
                open={index === 0}
                className="group overflow-hidden rounded-2xl border-2 border-ev-green bg-white shadow-card"
              >
                <summary className="flex min-h-16 cursor-pointer list-none items-center gap-4 px-5 py-4 marker:hidden">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ev-green font-mono text-label-sm font-black ${supportToneClasses[group.tone]}`}>
                    {group.number}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-label-sm font-bold uppercase text-ev-green-mid">
                      {group.label}
                    </span>
                    <span className="mt-1 block text-[17px] font-black leading-tight text-ev-ink">
                      {group.title}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ev-yellow font-mono text-lg font-black text-ev-green transition group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <div className="border-t border-ev-line px-5 pb-5 pt-4 sm:pl-[76px]">
                  <p className="max-w-[610px] text-body-sm text-ev-muted">{group.body}</p>
                  <p className="mt-3 font-mono text-label-sm font-bold uppercase text-ev-green">
                    {group.note}
                  </p>
                </div>
              </details>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

const supportToneClasses = {
  yellow: "bg-ev-yellow text-ev-green",
  teal: "bg-ev-teal-lt text-ev-green",
  blue: "bg-ev-blue-lt text-ev-green",
} as const;

function LearningSupport() {
  return (
    <section id="learning-support" className="relative overflow-hidden bg-ev-cream py-20 sm:py-28">
      <LearningDoodles className="opacity-70" />
      <div
        aria-hidden="true"
        className="absolute -right-24 top-16 h-64 w-64 rotate-12 rounded-[48px] border-[26px] border-ev-yellow/60"
      />
      <div
        aria-hidden="true"
        className="absolute -left-20 bottom-20 h-48 w-48 rounded-full border-[22px] border-ev-teal/15"
      />

      <div className="relative mx-auto max-w-[1200px] px-6 lg:px-10">
        <RevealOnScroll>
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <SectionLabel>{COPY.subjects.support.eyebrow}</SectionLabel>
              <h2 className="max-w-[650px] font-body text-display-lg font-black tracking-[-0.04em] text-ev-ink">
                {COPY.subjects.support.title}
              </h2>
            </div>
            <p className="max-w-[630px] text-body-lg text-ev-muted lg:justify-self-end">
              {COPY.subjects.support.intro}
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {COPY.subjects.support.groups.map((group, index) => (
            <RevealOnScroll key={group.number} delay={index * 0.1}>
              <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border-2 border-ev-green bg-white shadow-card transition duration-300 hover:-translate-y-1">
                <div className={`flex items-center justify-between border-b-2 border-ev-green px-5 py-4 ${supportToneClasses[group.tone]}`}>
                  <span className="font-mono text-label font-bold uppercase">{group.label}</span>
                  <span className="font-mono text-xl font-black">{group.number}</span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-[23px] font-black tracking-[-0.03em] text-ev-ink">
                    {group.title}
                  </h3>
                  <p className="mt-3 text-body-sm text-ev-muted">{group.body}</p>
                  <ul className="mt-6 grid gap-3">
                    {group.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm font-bold text-ev-green">
                        <span
                          aria-hidden="true"
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ev-green font-mono text-[10px] ${supportToneClasses[group.tone]}`}
                        >
                          ✓
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-7">
                    <span className={`inline-flex rounded-full px-3 py-2 font-mono text-label-sm font-bold uppercase ${supportToneClasses[group.tone]}`}>
                      {group.note}
                    </span>
                  </div>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll className="mt-10">
          <article className="grid overflow-hidden rounded-[28px] border-2 border-ev-green bg-ev-green shadow-[8px_9px_0_#FFD21F] lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
            <div className="relative min-h-[300px] overflow-hidden">
              <Image
                src="/online-exam-preparation-ada.png"
                alt="An older child preparing confidently for an assessment in an online lesson"
                width={1536}
                height={1024}
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-ev-green/45" />
            </div>
            <div className="flex flex-col justify-center p-7 text-white sm:p-9">
              <p className="font-mono text-label font-bold uppercase text-ev-yellow">
                Exam support, when it matters
              </p>
              <h3 className="mt-4 text-[clamp(27px,4vw,40px)] font-black leading-tight tracking-[-0.04em]">
                Preparation without the panic.
              </h3>
              <p className="mt-4 text-body-lg text-white/70">
                For older learners preparing for school, international, SAT, or PSAT assessments, lessons focus on the exact gaps, techniques, and practice they need.
              </p>
            </div>
          </article>
        </RevealOnScroll>

        <RevealOnScroll className="mt-10">
          <div className="overflow-hidden rounded-[26px] border-2 border-ev-green bg-ev-green text-white shadow-[8px_9px_0_#FFD21F]">
            <div className="grid lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="p-7 sm:p-9">
                <p className="font-mono text-label font-bold uppercase text-ev-yellow">
                  {COPY.subjects.support.methodLabel}
                </p>
                <ol className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                  {COPY.subjects.support.method.map((step) => (
                    <li key={step.number} className="grid grid-cols-[38px_1fr] gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ev-yellow font-mono text-sm font-black text-ev-yellow">
                        {step.number}
                      </span>
                      <div>
                        <h3 className="font-black text-white">{step.title}</h3>
                        <p className="mt-1 text-body-sm text-white/65">{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="border-t border-white/15 bg-white/[0.06] p-7 lg:max-w-[300px] lg:border-l lg:border-t-0">
                <BookCallButton variant="final" className="w-full">
                  {COPY.subjects.support.cta}
                </BookCallButton>
                <p className="mt-4 text-center text-xs leading-5 text-white/55">
                  {COPY.subjects.support.note}
                </p>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
