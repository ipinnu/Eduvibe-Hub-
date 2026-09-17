"use client";

import { useActionState } from "react";
import type { ActionResult } from "@/app/portal/actions";

export function ActionForm({ action, children, submitLabel, className = "" }: { action: (state: ActionResult, formData: FormData) => Promise<ActionResult>; children: React.ReactNode; submitLabel: string; className?: string }) {
  const [state, formAction, pending] = useActionState(action, { ok: false, message: "" });
  return <form action={formAction} className={className}>{children}<button disabled={pending} className="mt-5 min-h-11 rounded-xl bg-ev-green px-5 text-[11px] font-extrabold text-white shadow-[3px_3px_0_#FFD21F] disabled:opacity-50">{pending ? "Saving…" : submitLabel}</button>{state.message ? <p role="status" className={`mt-4 rounded-xl border px-4 py-3 text-[11px] font-semibold ${state.ok ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-700"}`}>{state.message}</p> : null}</form>;
}

