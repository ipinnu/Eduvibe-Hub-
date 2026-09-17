"use client";

export default function PortalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const detail =
    error.message && !error.message.includes("omitted in production")
      ? error.message
      : "Login worked, but a portal page hit a server error. Most often the Supabase migrations are not fully applied, or this account has no profile/role yet.";

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-6 py-20">
      <section className="w-full rounded-[22px] border border-red-200 bg-white p-7 shadow-card">
        <p className="font-mono text-label uppercase text-red-700">Portal setup required</p>
        <h1 className="mt-3 font-display text-display-md text-ev-green">This module could not load.</h1>
        <p className="mt-3 text-body-md text-ev-muted">{detail}</p>
        <ol className="mt-5 list-decimal space-y-2 pl-5 text-[12px] leading-5 text-ev-muted">
          <li>In Supabase SQL editor, run the three files in <code className="text-ev-green">supabase/migrations/</code> in order.</li>
          <li>Confirm your user has a row in <code className="text-ev-green">profiles</code> with the right role.</li>
          <li>Sign out, sign back in, and open the portal again.</li>
        </ol>
        {error.digest ? <p className="mt-4 font-mono text-[10px] text-ev-muted">Digest: {error.digest}</p> : null}
        <button type="button" onClick={reset} className="mt-6 rounded-full bg-ev-green px-5 py-3 text-body-sm font-bold text-white">
          Try again
        </button>
      </section>
    </main>
  );
}
