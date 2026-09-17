"use client";

import Link from "next/link";
import { useState } from "react";
import { signInToPortal } from "./actions";

export default function PortalLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function signIn(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.set("email", email);
    formData.set("password", password);
    const result = await signInToPortal(formData);

    if (!result.ok) {
      setError(result.error);
      setLoading(false);
      return;
    }

    window.location.assign(result.redirectTo);
  }

  return (
    <main className="grid min-h-screen bg-ev-cream lg:grid-cols-[0.9fr_1.1fr]">
      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="text-[22px] font-black tracking-[-0.05em]">EduVibe<span className="text-ev-green-mid">Hub</span></Link>
          <p className="mt-14 font-mono text-label-sm uppercase text-ev-green-mid">Private learning portal</p>
          <h1 className="mt-3 font-display text-[48px] leading-tight">Welcome back.</h1>
          <p className="mt-3 text-body-sm text-ev-muted">Sign in to see lessons, learners, progress, and your EduVibe workspace.</p>
          <form onSubmit={signIn} className="mt-8 space-y-5">
            <label className="block text-[10px] font-extrabold uppercase tracking-wide text-ev-muted">Email address<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-ev-line bg-white px-4 py-3.5 text-[12px] outline-none focus:border-ev-green" /></label>
            <label className="block text-[10px] font-extrabold uppercase tracking-wide text-ev-muted">Password<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-ev-line bg-white px-4 py-3.5 text-[12px] outline-none focus:border-ev-green" /></label>
            <div className="flex justify-end"><Link href="/portal/forgot-password" className="text-[10px] font-bold text-ev-green-mid hover:underline">Forgot password?</Link></div>
            {error ? <p className="rounded-xl bg-red-50 p-3 text-[11px] font-semibold text-red-700">{error}</p> : null}
            <button disabled={loading} className="w-full rounded-xl border-2 border-ev-green bg-ev-yellow py-3.5 text-[12px] font-extrabold text-ev-green shadow-[4px_4px_0_#111A4A] disabled:opacity-60">{loading ? "Signing in…" : "Sign in to my portal"}</button>
          </form>
          <p className="mt-6 text-center text-[10px] text-ev-muted">Need access? Your EduVibe tutor or parent account manager can invite you.</p>
        </div>
      </section>
      <aside className="relative hidden overflow-hidden bg-ev-green p-14 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border-[65px] border-ev-yellow/15" />
        <p className="font-mono text-label-sm uppercase text-ev-yellow">One shared learning space</p>
        <div className="relative max-w-xl"><blockquote className="font-display text-[54px] leading-[1.05]">“Progress becomes powerful when everyone can see it.”</blockquote><p className="mt-8 max-w-md text-body-md text-white/65">Tutor, parent, and child — connected around the lesson, the next step, and every win along the way.</p></div>
        <div className="grid grid-cols-3 gap-3">{["Lessons", "Progress", "Resources"].map((label) => <div key={label} className="rounded-xl border border-white/15 bg-white/5 p-4 text-[10px] font-bold">{label}</div>)}</div>
      </aside>
    </main>
  );
}
