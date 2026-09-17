import { COPY } from "@/lib/constants";

export function TrustBar() {
  return (
    <section className="bg-ev-yellow" aria-label={COPY.trustBar.ariaLabel}>
      <div className="hide-scrollbar mx-auto flex h-11 max-w-[1200px] items-center gap-5 overflow-x-auto px-6 lg:px-10">
        {COPY.trustBar.items.map((item, index) => (
          <div key={item} className="flex shrink-0 items-center gap-5">
            <span className="font-mono text-[11px] font-bold uppercase text-ev-green">
              {item}
            </span>
            {index < COPY.trustBar.items.length - 1 ? (
              <span className="text-ev-green/40" aria-hidden="true">
                {COPY.trustBar.separator}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
