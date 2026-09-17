"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { COPY } from "@/lib/constants";
import { BookCallButton } from "@/components/ui/Button";

export function Nav() {
  const [open, setOpen] = useState(false);
  const prefersReduced = useReducedMotion();

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b-2 border-ev-green bg-ev-yellow text-ev-ink">
      <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between px-5 sm:px-6 md:h-20 lg:px-10">
        <Link
          href="/"
          className="flex items-center"
          aria-label={COPY.brand.logoLabel}
          onClick={() => setOpen(false)}
        >
          <span className="text-[21px] font-black leading-none tracking-[-0.05em]">
            {COPY.nav.brandEdu}<span className="text-ev-green-mid">{COPY.nav.brandHub}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {COPY.nav.links.map((link) => (
            <Link key={link.href} href={link.href} className="text-[13px] font-extrabold text-ev-green transition hover:text-ev-green-mid">
              {link.label}
            </Link>
          ))}
          <BookCallButton variant="nav">{COPY.nav.cta}</BookCallButton>
        </nav>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-ev-green bg-white md:hidden"
          aria-label={open ? COPY.nav.closeMenu : COPY.nav.openMenu}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="relative block h-4 w-5" aria-hidden="true">
            <span className={`absolute left-0 top-0 h-0.5 w-5 bg-ev-green transition ${open ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`absolute left-0 top-[7px] h-0.5 w-5 bg-ev-green transition ${open ? "opacity-0" : ""}`} />
            <span className={`absolute left-0 top-[14px] h-0.5 w-5 bg-ev-green transition ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="border-t-2 border-ev-green bg-ev-yellow px-6 pb-5 pt-3 md:hidden"
            initial={{ opacity: 0, height: prefersReduced ? "auto" : 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: prefersReduced ? "auto" : 0 }}
          >
            <div className="mx-auto grid max-w-[1200px] gap-2">
              {COPY.nav.links.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="min-h-11 py-3 text-body-md font-bold text-ev-green">
                  {link.label}
                </Link>
              ))}
              <BookCallButton variant="nav" className="w-full">{COPY.nav.cta}</BookCallButton>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

export function LogoMark() {
  return (
    <span className="flex h-28 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-[4px] border-ev-teal bg-white p-1 shadow-[5px_5px_0_#FFD21F]">
      <Image
        src="/Logo V2.png"
        alt="EduVibe Hub"
        width={88}
        height={113}
        className="h-full w-full object-contain"
      />
    </span>
  );
}
