import { NextResponse } from "next/server";
import { requirePortalRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const user = await requirePortalRole(["tutor_admin", "partner_tutor"]);
  const supabase = await createClient();
  await supabase.from("google_connections").delete().eq("user_id", user.id);
  return NextResponse.redirect(new URL("/portal/settings?google=disconnected", request.url), 303);
}

