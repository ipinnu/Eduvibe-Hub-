"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getSession().then(({ data }) => {
      setSignedIn(Boolean(data.session));
      setReady(true);
    });
  }, []);

  async function updatePassword(event: React.FormEvent) {
    event.preventDefault();
    if (password.length < 8) {
      setMessage("Use at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("The passwords do not match.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }
    router.replace("/portal");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ev-cream px-6 py-12">
      <section className="w-full max-w-md rounded-[28px] border border-ev-line bg-white p-7 shadow-soft sm:p-10">
        <p className="font-mono text-label-sm uppercase text-ev-green-mid">Secure your account</p>
        <h1 className="mt-3 font-display text-[42px] leading-tight">Choose a new password.</h1>
        <p className="mt-3 text-body-sm text-ev-muted">
          Your invite link already signed you in. Set a password, then you go straight into your portal.
        </p>
        {!ready ? (
          <p className="mt-7 text-[11px] font-semibold text-ev-muted">Checking your secure session…</p>
        ) : !signedIn ? (
          <div className="mt-7 space-y-4">
            <p className="rounded-xl bg-red-50 p-3 text-[11px] font-semibold text-red-700">
              This page needs a fresh invite or recovery link. Open the latest email from EduVibe Hub, or request a new one.
            </p>
            <Link href="/portal/login" className="block text-center text-[10px] font-bold text-ev-green-mid">
              ← Back to portal login
            </Link>
          </div>
        ) : (
          <form onSubmit={updatePassword} className="mt-7 space-y-5">
            <label className="block text-[10px] font-extrabold uppercase tracking-wide text-ev-muted">
              New password
              <input
                required
                type="password"
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-xl border border-ev-line px-4 py-3.5 text-[12px] outline-none focus:border-ev-green"
              />
            </label>
            <label className="block text-[10px] font-extrabold uppercase tracking-wide text-ev-muted">
              Confirm password
              <input
                required
                type="password"
                minLength={8}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="mt-2 w-full rounded-xl border border-ev-line px-4 py-3.5 text-[12px] outline-none focus:border-ev-green"
              />
            </label>
            {message ? <p className="rounded-xl bg-red-50 p-3 text-[11px] font-semibold text-red-700">{message}</p> : null}
            <button
              disabled={loading}
              className="w-full rounded-xl bg-ev-green py-3.5 text-[12px] font-extrabold text-white disabled:opacity-60"
            >
              {loading ? "Updating…" : "Save password & open portal"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
