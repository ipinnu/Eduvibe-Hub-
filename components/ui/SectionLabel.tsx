import type { ReactNode } from "react";

type SectionLabelProps = {
  children: ReactNode;
  tone?: "light" | "dark" | "green";
};

export function SectionLabel({ children, tone = "green" }: SectionLabelProps) {
  const tones = {
    light: "text-white/45",
    dark: "text-ev-teal",
    green: "text-ev-teal",
  };

  return (
    <p className={`mb-3 font-mono text-label font-medium uppercase ${tones[tone]}`}>
      {children}
    </p>
  );
}
