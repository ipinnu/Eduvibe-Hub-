import "server-only";

import { createCipheriv, createDecipheriv, createHash, randomBytes, randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site-url";

const calendarScope = "https://www.googleapis.com/auth/calendar.events";

function redirectUri() {
  return `${getSiteUrl()}/api/integrations/google/callback`;
}

function encryptionKey() {
  const secret = process.env.GOOGLE_TOKEN_ENCRYPTION_KEY;
  if (!secret) throw new Error("GOOGLE_TOKEN_ENCRYPTION_KEY is not configured.");
  return createHash("sha256").update(secret).digest();
}

export function encryptToken(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return [iv.toString("base64url"), cipher.getAuthTag().toString("base64url"), encrypted.toString("base64url")].join(".");
}

export function decryptToken(value: string) {
  const [iv, tag, encrypted] = value.split(".");
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(iv, "base64url"));
  decipher.setAuthTag(Buffer.from(tag, "base64url"));
  return Buffer.concat([decipher.update(Buffer.from(encrypted, "base64url")), decipher.final()]).toString("utf8");
}

export function getGoogleAuthorizationUrl(state: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) throw new Error("GOOGLE_CLIENT_ID is not configured.");
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri(),
    response_type: "code",
    scope: calendarScope,
    access_type: "offline",
    include_granted_scopes: "true",
    prompt: "consent",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export async function exchangeGoogleCode(code: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ code, client_id: process.env.GOOGLE_CLIENT_ID || "", client_secret: process.env.GOOGLE_CLIENT_SECRET || "", redirect_uri: redirectUri(), grant_type: "authorization_code" }),
  });
  const tokens = await response.json() as { access_token?: string; refresh_token?: string; expires_in?: number; scope?: string; error_description?: string };
  if (!response.ok || !tokens.access_token) throw new Error(tokens.error_description || "Google authorization failed.");
  return tokens;
}

async function refreshGoogleToken(refreshToken: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: process.env.GOOGLE_CLIENT_ID || "", client_secret: process.env.GOOGLE_CLIENT_SECRET || "", refresh_token: refreshToken, grant_type: "refresh_token" }),
  });
  const tokens = await response.json() as { access_token?: string; expires_in?: number; error_description?: string };
  if (!response.ok || !tokens.access_token) throw new Error(tokens.error_description || "Google token refresh failed.");
  return tokens;
}

export async function createGoogleCalendarLesson(input: { userId: string; title: string; description: string; startsAt: string; endsAt: string; attendees?: string[] }) {
  const supabase = await createClient();
  const { data: connection } = await supabase.from("google_connections").select("encrypted_access_token,encrypted_refresh_token,access_token_expires_at").eq("user_id", input.userId).maybeSingle();
  if (!connection) return { connected: false as const };

  let accessToken = decryptToken(connection.encrypted_access_token);
  const expiresAt = connection.access_token_expires_at ? new Date(connection.access_token_expires_at).getTime() : 0;
  if (expiresAt < Date.now() + 60_000 && connection.encrypted_refresh_token) {
    const refreshed = await refreshGoogleToken(decryptToken(connection.encrypted_refresh_token));
    accessToken = refreshed.access_token!;
    await supabase.from("google_connections").update({ encrypted_access_token: encryptToken(accessToken), access_token_expires_at: new Date(Date.now() + (refreshed.expires_in || 3600) * 1000).toISOString() }).eq("user_id", input.userId);
  }

  const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all", {
    method: "POST",
    headers: { authorization: `Bearer ${accessToken}`, "content-type": "application/json" },
    body: JSON.stringify({
      summary: input.title,
      description: input.description,
      start: { dateTime: input.startsAt },
      end: { dateTime: input.endsAt },
      attendees: (input.attendees || []).filter(Boolean).map((email) => ({ email })),
      conferenceData: { createRequest: { requestId: randomUUID(), conferenceSolutionKey: { type: "hangoutsMeet" } } },
    }),
  });
  const event = await response.json() as { id?: string; hangoutLink?: string; conferenceData?: { entryPoints?: Array<{ entryPointType: string; uri: string }> }; error?: { message?: string } };
  if (!response.ok || !event.id) throw new Error(event.error?.message || "Google Calendar event creation failed.");
  const meetUrl = event.hangoutLink || event.conferenceData?.entryPoints?.find((item) => item.entryPointType === "video")?.uri || null;
  return { connected: true as const, eventId: event.id, meetUrl };
}
