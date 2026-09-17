import Link from "next/link";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <main className="bg-ev-cream px-6 py-20 lg:px-10">
      <article className="mx-auto max-w-3xl rounded-[22px] border border-ev-line bg-white p-6 shadow-card sm:p-10">
        <p className="font-mono text-label uppercase text-ev-green-mid">EduVibe Hub policy</p>
        <h1 className="mt-3 font-display text-display-lg text-ev-green">{title}</h1>
        <p className="mt-2 text-body-sm text-ev-muted">Last updated: {updated}</p>
        <div className="mt-8 grid gap-6 text-body-md leading-7 text-ev-ink">{children}</div>
        <p className="mt-10 border-t border-ev-line pt-6 text-body-sm text-ev-muted">Questions? Contact EduVibe Hub on WhatsApp at +234 907 314 9749 or <Link className="font-bold text-ev-green-mid" href="/">book a call</Link>.</p>
      </article>
    </main>
  );
}

export function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section><h2 className="font-display text-[24px] text-ev-green">{title}</h2><div className="mt-2 grid gap-3 text-ev-muted">{children}</div></section>;
}
