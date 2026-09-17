"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { COPY } from "@/lib/constants";
import { BookCallButton } from "@/components/ui/Button";

export function Hero() {
  const prefersReduced = useReducedMotion();

  return (
    <section id="top" className="relative overflow-hidden bg-ev-yellow pt-[72px] md:pt-20">
      <span className="floaty pointer-events-none absolute left-[5%] top-32 text-4xl text-white/75" aria-hidden="true">✦</span>
      <span className="pointer-events-none absolute right-[7%] top-28 rotate-12 text-5xl font-black text-ev-green/10" aria-hidden="true">ABC</span>

      <div className="mx-auto grid min-h-[690px] max-w-[1200px] gap-6 px-5 py-6 sm:gap-10 sm:px-6 sm:py-12 md:grid-cols-[53fr_47fr] md:items-center md:gap-12 lg:px-10 lg:py-20">
        <div className="order-2 md:order-1">
          <p className="mb-4 inline-flex -rotate-1 rounded-full border-2 border-ev-green bg-white px-3 py-2 font-mono text-[8px] font-bold uppercase text-ev-green shadow-[3px_3px_0_#111A4A] sm:mb-5 sm:px-4 sm:text-label">
            {COPY.hero.eyebrow}
          </p>
          <h1 className="max-w-[680px] font-body text-[clamp(38px,11vw,76px)] font-black leading-[0.98] tracking-[-0.055em] text-ev-ink">
            {COPY.hero.headlineBefore}{" "}
            <span className="scribble text-ev-green-mid">{COPY.hero.headlineMark}</span>
            <br />
            {COPY.hero.headlineAfter}
          </h1>
          <p className="mt-4 max-w-[520px] text-[14px] font-medium leading-[1.55] text-ev-ink/75 sm:mt-7 sm:text-[16px] sm:leading-7">
            {COPY.hero.sub}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-4">
            <BookCallButton showArrow>{COPY.hero.cta}</BookCallButton>
            <Link href="/how-it-works" className="text-body-sm font-extrabold text-ev-green underline decoration-2 underline-offset-4">
              {COPY.hero.secondaryCta}
            </Link>
          </div>
          <p className="mt-4 font-mono text-[8px] font-bold text-ev-green sm:mt-5 sm:text-label">{COPY.hero.microCopy}</p>
        </div>

        <div className="order-1 md:order-2">
          <div className="relative mx-auto aspect-square w-full max-w-[245px] sm:max-w-[390px] md:ml-auto md:max-w-[500px]">
            <div className="absolute inset-[3%] translate-x-3 translate-y-4 rounded-full bg-ev-green shadow-soft" aria-hidden="true" />
            <div className="absolute inset-0 rotate-6 rounded-full border-[3px] border-dashed border-white/80" aria-hidden="true" />
            <div className="absolute inset-[4%] z-[1] rounded-full border-[7px] border-white bg-white p-[5%] shadow-soft">
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_50%_38%,#ffffff_0%,#f4f8ff_72%)] ring-2 ring-ev-green/10">
                <Image
                  src="/Logo V2.png"
                  alt="EduVibe Hub learners climbing books toward their goals"
                  width={554}
                  height={713}
                  priority
                  className="h-[88%] w-[88%] object-contain mix-blend-multiply"
                />
              </div>
            </div>

            <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -rotate-2 whitespace-nowrap rounded-full border-2 border-ev-green bg-white px-4 py-1.5 font-mono text-[7px] font-extrabold uppercase tracking-[0.14em] text-ev-green shadow-[3px_3px_0_#55B925] sm:px-5 sm:py-2 sm:text-[9px] sm:tracking-[0.16em]">
              Learn · grow · thrive
            </div>
            <span className="absolute right-[2%] top-[18%] z-10 flex h-10 w-10 rotate-6 items-center justify-center rounded-full border-[3px] border-white bg-ev-teal text-lg shadow-card sm:h-14 sm:w-14 sm:text-2xl" aria-hidden="true">★</span>
            <span className="absolute bottom-[14%] left-[1%] z-10 flex h-9 w-9 -rotate-6 items-center justify-center rounded-full border-[3px] border-white bg-ev-green-mid text-base text-white shadow-card sm:h-12 sm:w-12 sm:text-xl" aria-hidden="true">✓</span>

            <motion.div
              initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-7 -left-8 z-10 hidden max-w-[250px] rotate-2 rounded-2xl border-2 border-ev-green bg-white p-4 shadow-card md:block"
            >
              <p className="text-[14px] font-bold leading-snug text-ev-ink">{COPY.hero.quote}</p>
              <p className="mt-2 font-mono text-label-sm text-ev-muted">{COPY.hero.quoteAuthor}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
