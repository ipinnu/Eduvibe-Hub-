import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { requirePortalRole } from "@/lib/auth";
import { getGoogleAuthorizationUrl } from "@/lib/google-calendar";

export async function GET(request: Request) {
  await requirePortalRole(["tutor_admin", "partner_tutor"]);
  try {
    const state = randomBytes(24).toString("base64url");
    const cookieStore = await cookies();
    cookieStore.set("google_oauth_state", state, { httpOnly: true, sameSite: "lax", secure: new URL(request.url).protocol === "https:", maxAge: 600, path: "/" });
    return NextResponse.redirect(getGoogleAuthorizationUrl(state));
  } catch (error) {
    const message = encodeURIComponent(error instanceof Error ? error.message : "Google Calendar is not configured.");
    return NextResponse.redirect(new URL(`/portal/settings?google=error&message=${message}`, request.url));
  }
}

