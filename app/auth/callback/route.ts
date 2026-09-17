import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Invite / recovery emails land here with ?code=...
 * Exchanging the code creates a signed-in session (cookies), then we send
 * the user to set their password while already authenticated.
 */
export async function GET(request: NextRequest) {
  const requestUrl = request.nextUrl;
  const code = requestUrl.searchParams.get("code");
  // Invite + password-recovery emails should land on the set-password screen.
  const requestedNext = requestUrl.searchParams.get("next") ?? "/portal/reset-password";
  const next = requestedNext.startsWith("/") ? requestedNext : "/portal/reset-password";

  if (!code) {
    return NextResponse.redirect(new URL("/portal/login?error=callback", requestUrl.origin));
  }

  let response = NextResponse.redirect(new URL(next, requestUrl.origin));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL("/portal/login?error=callback", requestUrl.origin));
  }

  return response;
}
