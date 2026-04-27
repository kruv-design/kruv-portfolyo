import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookiePayload = { name: string; value: string; options?: CookieOptions };

/**
 * Refreshes the Supabase session cookie on every request that hits the app.
 * Called from middleware.ts (root).
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const { pathname } = request.nextUrl;
  const isAdminArea = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/login";

  // If Supabase isn't configured (fresh clone, no .env.local yet), skip
  // auth but still block /admin so developers get a clear signal.
  if (!url || !key || url.includes("placeholder")) {
    if (isAdminArea) {
      const next = request.nextUrl.clone();
      next.pathname = "/login";
      next.searchParams.set("next", pathname);
      return NextResponse.redirect(next);
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookiePayload[]) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        supabaseResponse = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          supabaseResponse.cookies.set(name, value, options);
        }
      },
    },
  });

  // getUser() both refreshes the token and tells us if the session is valid.
  // Wrap in try/catch so a network blip never turns into a 500.
  let user: Awaited<ReturnType<typeof supabase.auth.getUser>>["data"]["user"] =
    null;
  try {
    const res = await supabase.auth.getUser();
    user = res.data.user;
  } catch {
    user = null;
  }

  if (isAdminArea && !user) {
    const next = request.nextUrl.clone();
    next.pathname = "/login";
    next.searchParams.set("next", pathname);
    return NextResponse.redirect(next);
  }

  if (isLoginPage && user) {
    const next = request.nextUrl.clone();
    next.pathname = "/admin";
    next.search = "";
    return NextResponse.redirect(next);
  }

  return supabaseResponse;
}
