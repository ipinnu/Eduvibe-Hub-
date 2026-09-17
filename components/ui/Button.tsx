"use client";

import type { ReactNode } from "react";
import { useContactModal } from "./ContactModal";

type BookCallButtonProps = {
  children: ReactNode;
  variant?: "nav" | "primary" | "final";
  showArrow?: boolean;
  className?: string;
};

export function BookCallButton({
  children,
  variant = "primary",
  showArrow = false,
  className = "",
}: BookCallButtonProps) {
  const { open } = useContactModal();

  const variants = {
    nav: "min-h-11 border-2 border-ev-green bg-white px-5 text-ev-green shadow-[3px_3px_0_#111A4A] hover:-translate-y-0.5",
    primary: "min-h-12 border-2 border-ev-green bg-ev-green px-6 text-white shadow-[4px_4px_0_#fff] hover:-translate-y-1",
    final: "min-h-12 border-2 border-ev-green bg-ev-yellow px-7 text-ev-green shadow-[4px_4px_0_#111A4A] hover:-translate-y-1",
  };

  return (
    <button
      type="button"
      onClick={open}
      className={`inline-flex items-center justify-center gap-3 rounded-xl text-[13px] font-extrabold transition ${variants[variant]} ${className}`}
    >
      <span>{children}</span>
      {showArrow ? (
        <span
          aria-hidden="true"
          className="flex h-6 w-6 items-center justify-center rounded-full bg-ev-yellow text-ev-green"
        >
          -&gt;
        </span>
      ) : null}
    </button>
  );
}
