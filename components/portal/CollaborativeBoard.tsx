"use client";

import { useEffect, useRef, useState } from "react";
import { getSnapshot, loadSnapshot, Tldraw, type Editor, type TLEditorSnapshot } from "tldraw";
import { createClient } from "@/lib/supabase/client";

export function CollaborativeBoard({ sessionId, initialSnapshot, initialRevision, readOnly }: { sessionId: string; initialSnapshot: TLEditorSnapshot | null; initialRevision: number; readOnly: boolean }) {
  const editorRef = useRef<Editor | null>(null);
  const revisionRef = useRef(initialRevision);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stopListening = useRef<(() => void) | null>(null);
  const [status, setStatus] = useState(readOnly ? "View only" : "Live sync ready");

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel(`board-row-${sessionId}`).on("postgres_changes", { event: "UPDATE", schema: "public", table: "lesson_boards", filter: `session_id=eq.${sessionId}` }, (payload) => {
      const next = payload.new as { snapshot?: TLEditorSnapshot; revision?: number };
      if (!next.snapshot || !editorRef.current || Number(next.revision || 0) <= revisionRef.current) return;
      revisionRef.current = Number(next.revision || 0);
      editorRef.current.store.mergeRemoteChanges(() => loadSnapshot(editorRef.current!.store, next.snapshot!));
      setStatus("Synced with lesson");
    }).subscribe();
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      stopListening.current?.();
      void supabase.removeChannel(channel);
    };
  }, [sessionId]);

  function mount(editor: Editor) {
    editorRef.current = editor;
    if (initialSnapshot) loadSnapshot(editor.store, initialSnapshot);
    editor.updateInstanceState({ isReadonly: readOnly });
    if (readOnly) return;
    stopListening.current = editor.store.listen(() => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      setStatus("Saving…");
      saveTimer.current = setTimeout(async () => {
        const response = await fetch(`/api/lesson-boards/${sessionId}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ snapshot: getSnapshot(editor.store), revision: revisionRef.current }) });
        const result = await response.json() as { revision?: number; error?: string; board?: { snapshot?: TLEditorSnapshot; revision?: number } };
        if (response.ok && result.revision != null) { revisionRef.current = result.revision; setStatus("Saved and synced"); }
        else if (response.status === 409 && result.board?.snapshot && result.board.revision != null) {
          revisionRef.current = result.board.revision;
          editor.store.mergeRemoteChanges(() => loadSnapshot(editor.store, result.board!.snapshot!));
          setStatus(result.error || "A newer board was loaded");
        } else setStatus(result.error || "Could not save");
      }, 800);
    }, { source: "user", scope: "document" });
  }

  return <div className="eduvibe-lesson-board relative h-[calc(100vh-13rem)] min-h-[560px] rounded-[22px] border-2 border-ev-green bg-white"><div className="absolute right-3 top-3 z-[80] rounded-full bg-ev-green px-3 py-1.5 text-[9px] font-bold text-white shadow">{status}</div><Tldraw onMount={mount} /></div>;
}
