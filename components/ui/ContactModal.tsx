"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { COPY } from "@/lib/constants";

type ContactModalContextValue = {
  open: () => void;
};

const ContactModalContext = createContext<ContactModalContextValue | null>(null);

type ContactModalProviderProps = {
  children: ReactNode;
};

type SubmitState = "idle" | "submitting" | "success" | "fallback" | "error";

export function ContactModalProvider({ children }: ContactModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const prefersReduced = useReducedMotion();
  const value = useMemo(() => ({ open: () => setIsOpen(true) }), []);

  function close() {
    setIsOpen(false);
    setSubmitState("idle");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("submitting");

    const formData = new FormData(event.currentTarget);
    const payload = {
      parentName: String(formData.get("parentName") ?? ""),
      childName: String(formData.get("childName") ?? ""),
      yearGroup: String(formData.get("yearGroup") ?? ""),
      subjectInterest: formData.getAll("subjectInterest").map(String),
      preferredDays: formData.getAll("preferredDays").map(String),
      whatsapp: String(formData.get("whatsapp") ?? ""),
      note: String(formData.get("note") ?? ""),
      website: String(formData.get("website") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json() as { whatsappUrl?: string };
      if (!response.ok && result.whatsappUrl) {
        window.location.assign(result.whatsappUrl);
        setSubmitState("fallback");
        return;
      }
      setSubmitState(response.ok ? "success" : "error");
      if (response.ok) {
        event.currentTarget.reset();
      }
    } catch {
      setSubmitState("error");
    }
  }

  return (
    <ContactModalContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ev-ink/65 px-4 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="call-modal-title"
              className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[14px] bg-ev-cream p-5 shadow-soft sm:p-7"
              initial={{ opacity: 0, y: prefersReduced ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2
                    id="call-modal-title"
                    className="font-display text-display-md text-ev-green"
                  >
                    {COPY.modal.title}
                  </h2>
                  <p className="mt-2 max-w-md text-body-md text-ev-muted">
                    {COPY.modal.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ev-green/15 text-ev-green transition hover:bg-ev-yellow-lt"
                  aria-label={COPY.modal.close}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid gap-4">
                <label className="sr-only" aria-hidden="true">
                  Website
                  <input name="website" type="text" tabIndex={-1} autoComplete="off" />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={COPY.modal.parentName} name="parentName" required />
                  <Field label={COPY.modal.childName} name="childName" required />
                </div>

                <label className="grid gap-2 text-body-sm font-bold text-ev-green">
                  {COPY.modal.yearGroup}
                  <select
                    name="yearGroup"
                    required
                    className="min-h-12 rounded-lg border border-ev-green/15 bg-white px-3 text-body-md font-normal text-ev-ink outline-none focus:border-ev-teal"
                  >
                    <option value="" />
                    {COPY.modal.yearOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <CheckboxGroup
                  label={COPY.modal.subjectInterest}
                  name="subjectInterest"
                  options={COPY.modal.subjects}
                />
                <CheckboxGroup
                  label={COPY.modal.preferredDays}
                  name="preferredDays"
                  options={COPY.modal.days}
                />

                <Field label={COPY.modal.whatsapp} name="whatsapp" type="tel" required />

                <label className="grid gap-2 text-body-sm font-bold text-ev-green">
                  {COPY.modal.note}
                  <textarea
                    name="note"
                    rows={4}
                    placeholder={COPY.modal.notePlaceholder}
                    className="rounded-lg border border-ev-green/15 bg-white px-3 py-3 text-body-md font-normal text-ev-ink outline-none placeholder:text-ev-muted/65 focus:border-ev-teal"
                  />
                </label>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="submit"
                    disabled={submitState === "submitting"}
                    className="min-h-12 rounded-full bg-ev-green px-6 text-[13px] font-bold text-white transition hover:bg-ev-green-mid disabled:cursor-not-allowed disabled:opacity-65"
                  >
                    {submitState === "submitting" ? COPY.modal.submitting : COPY.modal.submit}
                  </button>
                  {submitState === "success" ? (
                    <p className="text-body-sm text-ev-green">{COPY.modal.success}</p>
                  ) : null}
                  {submitState === "error" ? (
                    <p className="text-body-sm text-red-700">{COPY.modal.error}</p>
                  ) : null}
                  {submitState === "fallback" ? (
                    <p className="text-body-sm text-ev-green">WhatsApp is ready. Send the prepared message to finish.</p>
                  ) : null}
                </div>
              </form>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </ContactModalContext.Provider>
  );
}

export function useContactModal() {
  const context = useContext(ContactModalContext);

  if (!context) {
    throw new Error("useContactModal must be used inside ContactModalProvider");
  }

  return context;
}

type FieldProps = {
  label: string;
  name: string;
  type?: "text" | "tel";
  required?: boolean;
};

function Field({ label, name, type = "text", required }: FieldProps) {
  return (
    <label className="grid gap-2 text-body-sm font-bold text-ev-green">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        className="min-h-12 rounded-lg border border-ev-green/15 bg-white px-3 text-body-md font-normal text-ev-ink outline-none focus:border-ev-teal"
      />
    </label>
  );
}

type CheckboxGroupProps = {
  label: string;
  name: string;
  options: readonly string[];
};

function CheckboxGroup({ label, name, options }: CheckboxGroupProps) {
  return (
    <fieldset className="grid gap-2">
      <legend className="text-body-sm font-bold text-ev-green">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option}
            className="flex min-h-11 items-center gap-2 rounded-full border border-ev-green/15 bg-white px-3 text-body-sm text-ev-ink"
          >
            <input
              type="checkbox"
              name={name}
              value={option}
              className="h-4 w-4 accent-ev-teal"
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
