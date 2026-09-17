import "tldraw/tldraw.css";
import Link from "next/link";
import type { TLEditorSnapshot } from "tldraw";
import { CollaborativeBoard } from "@/components/portal/CollaborativeBoard";
import { ActionForm } from "@/components/portal/ActionForm";
import { toggleBoardLock } from "@/app/portal/actions";
import { PortalShell } from "@/components/portal/PortalShell";
import { requirePortalRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function LessonBoardPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const user = await requirePortalRole(["tutor_admin", "partner_tutor", "parent", "child"]);
  const { sessionId } = await params;
  const supabase = await createClient();
  const { data: session } = await supabase.from("sessions").select("id,title,subject,starts_at,board_locked,student:students(full_name)").eq("id", sessionId).maybeSingle();
  if (!session) notFound();
  const lesson = session as unknown as { id: string; title: string; subject: string; starts_at: string; board_locked: boolean; student: { full_name: string } | null };
  const { data: board } = await supabase.from("lesson_boards").select("snapshot,revision").eq("session_id", sessionId).maybeSingle();
  const readOnly = user.role === "parent" || (user.role === "child" && lesson.board_locked);
  return <PortalShell role={user.role} userName={user.fullName} userEmail={user.email}><div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><Link href="/portal/sessions" className="text-[10px] font-bold text-ev-green-mid">← Lesson schedule</Link><h1 className="mt-2 font-display text-[36px]">{lesson.title}</h1><p className="mt-1 text-[10px] text-ev-muted">{lesson.student?.full_name} · {lesson.subject} · {readOnly ? "View only" : "Draw together"}</p></div><div className="max-w-md"><p className="text-[9px] leading-4 text-ev-muted">Changes auto-save to the lesson and appear for other open participants through Supabase Realtime. Parent access is view-only.</p>{user.role === "tutor_admin" || user.role === "partner_tutor" ? <ActionForm action={toggleBoardLock} submitLabel={lesson.board_locked ? "Enable student editing" : "Lock student editing"} className="mt-2"><input type="hidden" name="session_id" value={sessionId} /><input type="hidden" name="locked" value={lesson.board_locked ? "no" : "yes"} /></ActionForm> : null}</div></div><CollaborativeBoard sessionId={sessionId} initialSnapshot={(board?.snapshot as TLEditorSnapshot | null) || null} initialRevision={Number(board?.revision || 0)} readOnly={readOnly} /></PortalShell>;
}
