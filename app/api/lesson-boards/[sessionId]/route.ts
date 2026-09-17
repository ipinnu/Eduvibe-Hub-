import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { data: session } = await supabase.from("sessions").select("id,student_id,board_locked").eq("id", sessionId).maybeSingle();
  if (!session) return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
  const { data: board } = await supabase.from("lesson_boards").select("snapshot,revision,updated_at").eq("session_id", sessionId).maybeSingle();
  return NextResponse.json({ board: board || { snapshot: null, revision: 0 }, locked: session.board_locked });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const [{ data: profile }, { data: session }] = await Promise.all([
    supabase.from("profiles").select("role").eq("id", userId).single(),
    supabase.from("sessions").select("id,student_id,board_locked").eq("id", sessionId).maybeSingle(),
  ]);
  if (!session || !profile) return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
  if (profile.role === "parent" || (profile.role === "child" && session.board_locked)) return NextResponse.json({ error: "This board is read-only." }, { status: 403 });
  const body = await request.json() as { snapshot?: unknown; revision?: number };
  if (!body.snapshot || JSON.stringify(body.snapshot).length > 900_000) return NextResponse.json({ error: "Invalid or oversized board." }, { status: 400 });
  const expectedRevision = Math.max(0, Number(body.revision || 0));
  const revision = expectedRevision + 1;
  const { data: updated, error } = await supabase
    .from("lesson_boards")
    .update({ snapshot: body.snapshot, revision, updated_by: userId, updated_at: new Date().toISOString() })
    .eq("session_id", sessionId)
    .eq("revision", expectedRevision)
    .select("revision")
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (!updated) {
    const { data: latest } = await supabase.from("lesson_boards").select("snapshot,revision").eq("session_id", sessionId).maybeSingle();
    return NextResponse.json({ error: "Another participant saved first. Their latest changes were loaded; please add yours again.", board: latest }, { status: 409 });
  }
  return NextResponse.json({ revision: updated.revision });
}
