"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/portal/login");
    router.refresh();
  }

  return (
    <button type="button" onClick={signOut} disabled={loading} className="mt-2 w-full rounded-lg px-3 py-2 text-left text-[10px] font-bold text-white/55 transition hover:bg-white/10 hover:text-white disabled:opacity-50">
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
