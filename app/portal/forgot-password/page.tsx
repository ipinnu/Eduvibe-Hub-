"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function sendReset(event: React.FormEvent) {
    event.preventDefault();
    setStatus("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // Exact allowlisted path — callback then routes to /portal/reset-password.
      redirectTo: `${window.location.origin}/auth/callback`,
    });
    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
    setStatus("sent");
    setMessage("Check your email for a secure password reset link.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ev-cream px-6 py-12">
      <section className="w-full max-w-md rounded-[28px] border border-ev-line bg-white p-7 shadow-soft sm:p-10">
        <Link href="/" className="text-[21px] font-black tracking-[-0.05em]">EduVibe<span className="text-ev-green-mid">Hub</span></Link>
        <p className="mt-10 font-mono text-label-sm uppercase text-ev-green-mid">Account recovery</p>
        <h1 className="mt-3 font-display text-[42px] leading-tight">Reset your password.</h1>
        <p className="mt-3 text-body-sm text-ev-muted">Enter the email connected to your EduVibe portal account.</p>
        <form onSubmit={sendReset} className="mt-7 space-y-5">
          <label className="block text-[10px] font-extrabold uppercase tracking-wide text-ev-muted">Email address<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-ev-line px-4 py-3.5 text-[12px] outline-none focus:border-ev-green" /></label>
          {message ? <p className={`rounded-xl p-3 text-[11px] font-semibold ${status === "error" ? "bg-red-50 text-red-700" : "bg-ev-teal-lt text-ev-green"}`}>{message}</p> : null}
          <button disabled={status === "sending" || status === "sent"} className="w-full rounded-xl bg-ev-green py-3.5 text-[12px] font-extrabold text-white disabled:opacity-60">{status === "sending" ? "Sending…" : status === "sent" ? "Email sent" : "Send reset link"}</button>
        </form>
        <Link href="/portal/login" className="mt-6 block text-center text-[10px] font-bold text-ev-green-mid">← Back to portal login</Link>
      </section>
    </main>
  );
}
