import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n/config";

const PUBLIC_FILE = /\.[^/]+$/;

function hasLocalePrefix(pathname: string): boolean {
  return LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
}

/** Kök `/` artık App Router `src/app/page.tsx` üzerinden locale'e gider. */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/protel") ||
    pathname.startsWith("/olly") ||
    pathname.startsWith("/habits") ||
    PUBLIC_FILE.test(pathname);

  if (!isAsset && pathname !== "/" && !hasLocalePrefix(pathname)) {
    const next = request.nextUrl.clone();
    next.pathname = `/${DEFAULT_LOCALE}${pathname}`;
    const redirect = NextResponse.redirect(next);
    redirect.headers.set("x-kruv-locale", DEFAULT_LOCALE);
    return redirect;
  }

  const activeLocale = LOCALES.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  try {
    const response = await updateSession(request);
    if (activeLocale) {
      response.headers.set("x-kruv-locale", activeLocale);
    } else if (pathname === "/") {
      response.headers.set("x-kruv-locale", DEFAULT_LOCALE);
    }
    return response;
  } catch (err) {
    console.error("[middleware]", err);
    if (pathname.startsWith("/admin")) {
      const next = request.nextUrl.clone();
      next.pathname = "/login";
      next.searchParams.set("next", pathname);
      return NextResponse.redirect(next);
    }
    const fallback = NextResponse.next({ request });
    if (activeLocale) {
      fallback.headers.set("x-kruv-locale", activeLocale);
    }
    return fallback;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|woff2?)$).*)",
  ],
};
