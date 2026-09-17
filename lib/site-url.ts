/**
 * Canonical public origin for auth redirects, emails, and OAuth callbacks.
 *
 * Invite/recovery emails embed this URL. If it is localhost (or missing in
 * production), Supabase will send people to localhost to sign in.
 */
export function getSiteUrl(request?: Request): string {
  const configured = normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL);
  if (configured && !isLocalhostOrigin(configured)) {
    return configured;
  }

  const vercelProduction = normalizeHostAsHttps(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  if (vercelProduction) {
    return vercelProduction;
  }

  if (request) {
    const fromRequest = originFromRequest(request);
    if (fromRequest && !isLocalhostOrigin(fromRequest)) {
      return fromRequest;
    }
  }

  if (configured) {
    return configured;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be set to your public https origin (e.g. https://eduvibehub.com.ng). " +
        "Without it, invitation and recovery emails point at localhost.",
    );
  }

  return "http://localhost:3000";
}

/**
 * Auth redirect target for invite / recovery emails.
 * Keep this exact path (no query string) so it matches Supabase Redirect URLs.
 * The callback route then sends people to /portal/reset-password with a session.
 * Refuses localhost unless ALLOW_LOCAL_AUTH_REDIRECTS=true.
 */
export function getAuthRedirectUrl(_nextPath?: string, request?: Request): string {
  const origin = getSiteUrl(request);
  const allowLocal = process.env.ALLOW_LOCAL_AUTH_REDIRECTS === "true";
  if (isLocalhostOrigin(origin) && !allowLocal) {
    throw new Error(
      "Refusing to send an auth email with a localhost redirect. " +
        "Set NEXT_PUBLIC_SITE_URL=https://eduvibehub.com.ng (on the host and in .env.local if inviting from your machine), " +
        "and in Supabase Auth set Site URL + Redirect URLs to that origin. " +
        "For local-only testing, set ALLOW_LOCAL_AUTH_REDIRECTS=true.",
    );
  }

  return `${origin}/auth/callback`;
}

function originFromRequest(request: Request): string | null {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (!host) return null;
  const proto = request.headers.get("x-forwarded-proto") || (isLocalhostHost(host) ? "http" : "https");
  return normalizeOrigin(`${proto}://${host}`);
}

function normalizeOrigin(value: string | undefined | null): string | null {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value.trim());
    return url.origin;
  } catch {
    return null;
  }
}

function normalizeHostAsHttps(value: string | undefined | null): string | null {
  if (!value?.trim()) return null;
  const trimmed = value.trim().replace(/^https?:\/\//, "");
  return normalizeOrigin(`https://${trimmed}`);
}

function isLocalhostOrigin(origin: string): boolean {
  try {
    return isLocalhostHost(new URL(origin).hostname);
  } catch {
    return false;
  }
}

function isLocalhostHost(host: string): boolean {
  const hostname = host.split(":")[0]?.toLowerCase() ?? "";
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}
