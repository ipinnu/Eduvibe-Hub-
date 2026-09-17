import Link from "next/link";

export function InviteManager() {
  return (
    <>
      <p className="font-mono text-label-sm uppercase text-ev-green-mid">People & access</p>
      <h1 className="mt-3 max-w-3xl font-display text-[42px] leading-tight">Bring the right people into the portal.</h1>
      <p className="mt-3 max-w-2xl text-body-md text-ev-muted">
        Portal accounts are currently created with developer support. Once an account exists, connect it to the correct learner below.
      </p>

      <div className="mt-8 grid items-stretch gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[22px] border border-ev-line bg-white p-6 md:p-8">
          <p className="font-mono text-label-sm uppercase text-ev-green-mid">New account</p>
          <h2 className="mt-3 text-[22px] font-extrabold text-ev-ink">Contact the developer for an invitation.</h2>
          <p className="mt-3 text-[11px] leading-6 text-ev-muted">
            Send the person&apos;s full name, email address, and required role: parent, partner tutor, or student. The developer will create the account and confirm when it is ready to link.
          </p>
          <div className="mt-6 rounded-2xl border border-ev-yellow bg-ev-yellow-lt p-4 text-[11px] font-semibold leading-5 text-ev-green">
            Do not link an account until the developer confirms that its portal role has been configured.
          </div>
        </section>

        <section className="rounded-[22px] bg-ev-green p-6 text-white md:p-8">
          <p className="font-mono text-label-sm uppercase text-ev-yellow">Existing account</p>
          <h2 className="mt-3 text-[22px] font-extrabold">Forgotten password?</h2>
          <p className="mt-3 text-[11px] leading-6 text-white/65">
            Existing users can request their own secure password-reset email from the portal login flow.
          </p>
          <Link
            href="/portal/forgot-password"
            className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-ev-yellow px-5 text-[11px] font-extrabold text-ev-green shadow-[3px_3px_0_#FFFFFF]"
          >
            Open password reset
          </Link>
        </section>
      </div>
    </>
  );
}
