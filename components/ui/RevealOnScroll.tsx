"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealOnScrollProps = {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "right" | "left" | "none";
  className?: string;
};

export function RevealOnScroll({
  children,
  delay = 0,
  direction = "up",
  className,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const hidden = {
    opacity: 0,
    y: direction === "up" && !prefersReduced ? 28 : 0,
    x:
      direction === "right" && !prefersReduced
        ? -28
        : direction === "left" && !prefersReduced
          ? 28
          : 0,
  };

  return (
    <motion.div
      ref={ref}
      initial={mounted ? hidden : false}
      animate={!mounted || inView ? { opacity: 1, x: 0, y: 0 } : hidden}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
