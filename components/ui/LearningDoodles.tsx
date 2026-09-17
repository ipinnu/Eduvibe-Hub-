type LearningDoodlesProps = {
  tone?: "light" | "dark";
  className?: string;
};

const doodles = [
  { mark: "ABC", position: "left-[4%] top-[14%] -rotate-12 text-2xl sm:text-3xl" },
  { mark: "1 + 2", position: "right-[5%] top-[22%] rotate-6 text-xl sm:text-2xl" },
  { mark: "✎", position: "bottom-[16%] left-[8%] rotate-[-18deg] text-3xl sm:text-4xl" },
  { mark: "📚", position: "bottom-[11%] right-[7%] rotate-6 text-2xl sm:text-3xl" },
  { mark: "🧪", position: "right-[28%] top-[8%] hidden rotate-12 text-2xl sm:block sm:text-3xl" },
] as const;

export function LearningDoodles({ tone = "light", className = "" }: LearningDoodlesProps) {
  const color = tone === "dark" ? "text-white" : "text-ev-green";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 select-none overflow-hidden ${color} ${className}`}
    >
      {doodles.map((doodle) => (
        <span
          key={doodle.mark}
          className={`absolute font-mono font-black opacity-[0.07] ${doodle.position}`}
        >
          {doodle.mark}
        </span>
      ))}
    </div>
  );
}
