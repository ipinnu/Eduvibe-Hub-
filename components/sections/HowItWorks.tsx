import Link from "next/link";
import { COPY } from "@/lib/constants";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { LearningDoodles } from "@/components/ui/LearningDoodles";

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="learning-pattern bg-[#111A4A] py-24 text-white"
      style={{ backgroundColor: "#111A4A" }}
    >
      <LearningDoodles tone="dark" className="opacity-70" />
      <div className="relative mx-auto grid max-w-[1200px] gap-10 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <RevealOnScroll>
          <SectionLabel>{COPY.howItWorks.eyebrow}</SectionLabel>
          <h2 className="max-w-[520px] font-body text-display-lg font-black tracking-[-0.04em] text-white">
            {COPY.howItWorks.sectionTitle}
          </h2>
          <p className="mt-5 max-w-[470px] text-body-lg text-[#C7CCE4]">
            A clear starting point, a personal teaching rhythm, and progress you can follow.
          </p>
          <Link
            href="/how-it-works"
            className="mt-7 inline-flex min-h-12 items-center rounded-xl border-2 border-ev-yellow bg-ev-yellow px-5 text-[13px] font-extrabold text-ev-green shadow-[4px_4px_0_#fff] transition hover:-translate-y-1"
          >
            See the full learning journey <span aria-hidden="true" className="ml-3">-&gt;</span>
          </Link>
        </RevealOnScroll>

        <div className="grid gap-3">
          {COPY.howItWorks.steps.map((step, index) => (
            <RevealOnScroll key={step.number} delay={index * 0.08}>
              <details
                open={index === 0}
                className="group overflow-hidden rounded-2xl border border-white/15 bg-white/[0.08] backdrop-blur-sm"
              >
                <summary className="flex min-h-16 cursor-pointer list-none items-center gap-4 px-5 py-4 marker:hidden">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ev-yellow/60 bg-ev-yellow/10 font-mono text-[11px] font-bold leading-none text-ev-yellow">
                    {step.number}
                  </span>
                  <span className="flex-1 text-[16px] font-bold text-white">{step.title}</span>
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ev-yellow/50 text-lg font-black text-ev-yellow transition group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <div className="border-t border-white/10 px-5 pb-5 pt-4 sm:pl-[72px]">
                  <p className="max-w-[600px] text-body-sm text-[#C7CCE4]">{step.body}</p>
                </div>
              </details>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
