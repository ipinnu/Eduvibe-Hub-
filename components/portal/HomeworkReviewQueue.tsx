import { reviewHomework } from "@/app/portal/actions";
import { ActionForm } from "@/components/portal/ActionForm";
import type { PortalRole } from "@/lib/portal";
import type { HomeworkItem } from "@/lib/portal-data";

export function HomeworkReviewQueue({ role, homework }: { role: PortalRole; homework: HomeworkItem[] }) {
  if (role !== "tutor_admin" && role !== "partner_tutor") return null;
  const submitted = homework.filter((item) => item.status === "submitted");
  if (!submitted.length) return null;
  return <section className="mt-6 rounded-[22px] border border-ev-line bg-white p-5 md:p-6"><p className="font-mono text-label-sm uppercase text-ev-green-mid">Review queue</p><h2 className="mt-2 text-[16px] font-extrabold">Submitted homework awaiting feedback</h2><div className="mt-5 grid gap-4 lg:grid-cols-2">{submitted.map((item) => <ActionForm key={item.id} action={reviewHomework} submitLabel="Save feedback" className="rounded-2xl bg-ev-board p-4"><input type="hidden" name="homework_id" value={item.id} /><h3 className="text-[12px] font-extrabold">{item.student?.full_name} · {item.title}</h3>{item.submission_url ? <a href={item.submission_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-[10px] font-bold text-ev-green-mid">Open submitted work ↗</a> : null}<p className="mt-2 text-[10px] text-ev-muted">{item.submission_note || "No submission note."}</p><label className="mt-4 block text-[10px] font-extrabold uppercase tracking-wide text-ev-muted">Tutor feedback<textarea name="feedback" required className="mt-2 min-h-24 w-full rounded-xl border border-ev-line bg-white px-4 py-3 text-[11px]" /></label></ActionForm>)}</div></section>;
}

