import Image from "next/image";
import { COPY } from "@/lib/constants";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="learning-pattern bg-[#111A4A] py-24 text-white"
      style={{ backgroundColor: "#111A4A" }}
    >
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <RevealOnScroll>
          <SectionLabel tone="light">{COPY.testimonials.eyebrow}</SectionLabel>
          <h2 className="font-body text-display-lg font-black tracking-[-0.04em] text-white">
            {COPY.testimonials.sectionTitle}
          </h2>
        </RevealOnScroll>

        <div className="mt-10 grid items-center gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)]">
          <RevealOnScroll direction="right">
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute inset-0 translate-x-3 translate-y-3 rounded-[26px] bg-ev-yellow"
              />
              <div className="relative overflow-hidden rounded-[26px] border-[3px] border-white bg-black shadow-soft">
                <video
                  className="aspect-video w-full bg-black object-contain"
                  controls
                  playsInline
                  preload="metadata"
                  aria-label={COPY.testimonials.videoAriaLabel}
                >
                  <source src="/Testimonials.mp4" type="video/mp4" />
                  Your browser does not support embedded video.
                </video>
              </div>
              <span className="absolute -left-3 -top-3 rotate-[-4deg] rounded-full border-2 border-ev-green bg-ev-yellow px-4 py-2 font-mono text-label font-bold uppercase text-ev-green shadow-card">
                {COPY.testimonials.videoBadge}
              </span>
            </div>
          </RevealOnScroll>

          <RevealOnScroll direction="left" delay={0.1}>
            <article className="rounded-[24px] border-2 border-white/15 bg-white/[0.08] p-7 backdrop-blur-sm">
              <p className="font-mono text-label font-bold uppercase text-ev-yellow">
                {COPY.testimonials.writtenLabel}
              </p>
              <h3 className="mt-4 text-[clamp(25px,3vw,34px)] font-black leading-tight tracking-[-0.035em] text-white">
                {COPY.testimonials.writtenTitle}
              </h3>
              <blockquote className="mt-5">
                <p className="font-display text-[19px] italic leading-8 text-[#E4E7F4]">
                  &ldquo;{COPY.testimonials.writtenQuote}&rdquo;
                </p>
                <footer className="mt-6 border-t border-white/15 pt-5 font-mono text-label-sm font-bold uppercase text-ev-yellow">
                  {COPY.testimonials.writtenAuthor}
                </footer>
              </blockquote>
            </article>
          </RevealOnScroll>
        </div>

        <RevealOnScroll className="mt-10">
          <article className="grid overflow-hidden rounded-[26px] border-2 border-white/15 bg-white/[0.08] md:grid-cols-[minmax(260px,0.7fr)_minmax(0,1.3fr)]">
            <div className="relative min-h-[440px] bg-white/5 p-4 sm:p-6">
              <Image
                src="/curtis-sat-result.jpeg"
                alt="Curtis SAT Mathematics result shared as evidence of focused exam preparation"
                width={531}
                height={932}
                unoptimized
                className="mx-auto h-auto max-h-[560px] w-auto rounded-2xl object-contain shadow-soft"
              />
            </div>
            <div className="flex flex-col justify-center p-7 sm:p-10">
              <p className="font-mono text-label font-bold uppercase text-ev-yellow">
                {COPY.testimonials.resultLabel}
              </p>
              <h3 className="mt-4 max-w-[580px] text-[clamp(28px,4vw,42px)] font-black leading-tight tracking-[-0.04em] text-white">
                {COPY.testimonials.resultTitle}
              </h3>
              <p className="mt-5 max-w-[620px] text-body-lg text-[#D7DBEB]">
                {COPY.testimonials.resultBody}
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {COPY.testimonials.proofPoints.map((point) => (
                  <span
                    key={point}
                    className="rounded-full border border-white/15 bg-white/[0.07] px-3 py-2 text-xs font-bold text-white"
                  >
                    {point}
                  </span>
                ))}
              </div>
            </div>
          </article>
        </RevealOnScroll>

        <RevealOnScroll className="mt-10">
          <article className="grid overflow-hidden rounded-[26px] border-2 border-white/15 bg-white/[0.08] md:grid-cols-[minmax(260px,0.7fr)_minmax(0,1.3fr)]">
            <div className="relative min-h-[620px] bg-white/5 p-4 sm:min-h-[720px] sm:p-6">
              <Image
                src="/WhatsApp Image 2026-07-25 at 2.37.14 PM.jpeg"
                alt="A parent's WhatsApp message thanking the EduVibe academic team after Zion received a Year 3 Science and Technology Design Award"
                fill
                unoptimized
                sizes="(min-width: 768px) 36vw, 100vw"
                className="object-contain p-4 sm:p-6"
              />
            </div>
            <div className="flex flex-col justify-center p-7 sm:p-10">
              <p className="font-mono text-label font-bold uppercase text-ev-yellow">
                {COPY.testimonials.whatsappLabel}
              </p>
              <h3 className="mt-4 max-w-[580px] text-[clamp(28px,4vw,42px)] font-black leading-tight tracking-[-0.04em] text-white">
                {COPY.testimonials.whatsappTitle}
              </h3>
              <p className="mt-5 max-w-[620px] text-body-lg text-[#D7DBEB]">
                {COPY.testimonials.whatsappBody}
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {COPY.testimonials.whatsappProofPoints.map((point) => (
                  <span
                    key={point}
                    className="rounded-full border border-white/15 bg-white/[0.07] px-3 py-2 text-xs font-bold text-white"
                  >
                    {point}
                  </span>
                ))}
              </div>
            </div>
          </article>
        </RevealOnScroll>
      </div>
    </section>
  );
}
