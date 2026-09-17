import { COPY } from "@/lib/constants";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { LearningDoodles } from "@/components/ui/LearningDoodles";

export function Philosophy() {
  return (
    <section id="philosophy" className="relative overflow-hidden bg-ev-board py-20">
      <LearningDoodles />
      <div className="relative mx-auto grid max-w-[1200px] gap-12 px-6 md:grid-cols-[0.9fr_1.1fr] lg:px-10">
        <RevealOnScroll>
          <SectionLabel>{COPY.philosophy.eyebrow}</SectionLabel>
          <h2 className="max-w-[430px] whitespace-pre-line font-display text-display-md text-ev-green">
            {COPY.philosophy.quote}
          </h2>
          <p className="mt-5 max-w-[420px] text-body-md text-ev-muted">
            {COPY.philosophy.body}
          </p>
        </RevealOnScroll>

        <div className="grid gap-6">
          {COPY.philosophy.pillars.map((pillar, index) => (
            <RevealOnScroll key={pillar.label} delay={index * 0.15} direction="right">
              <div className="border-l-[3px] border-ev-yellow pl-4">
                <h3 className="font-mono text-label-sm font-medium uppercase text-ev-teal">
                  {pillar.label}
                </h3>
                <p className="mt-2 max-w-[540px] text-body-sm text-ev-muted">
                  {pillar.body}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
