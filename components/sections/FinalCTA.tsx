import { COPY } from "@/lib/constants";
import { BookCallButton } from "@/components/ui/Button";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-ev-teal py-24">
      <div className="mx-auto max-w-[1200px] px-6 text-center lg:px-10">
        <RevealOnScroll>
          <SectionLabel>{COPY.finalCta.eyebrow}</SectionLabel>
          <h2 className="mx-auto max-w-[600px] whitespace-pre-line font-body text-display-lg font-black tracking-[-0.04em] text-ev-ink">
            {COPY.finalCta.headline}
          </h2>
          <p className="mx-auto mt-5 max-w-[480px] text-body-lg text-ev-muted">
            {COPY.finalCta.body}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <BookCallButton variant="final">{COPY.finalCta.primary}</BookCallButton>
            <a
              href={COPY.finalCta.whatsappHref}
              className="text-body-sm font-bold text-ev-teal underline underline-offset-[3px]"
            >
              {COPY.finalCta.secondary}
            </a>
          </div>
          <p className="mt-5 font-mono text-label text-ev-muted">
            {COPY.finalCta.microCopy}
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
