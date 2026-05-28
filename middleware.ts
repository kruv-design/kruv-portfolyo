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
    PUBLIC_FILE.test(pathname);

  if (!isAsset && pathname !== "/" && !hasLocalePrefix(pathname)) {
    const next = request.nextUrl.clone();
    next.pathname = `/${DEFAULT_LOCALE}${pathname}`;
    return NextResponse.redirect(next);
  }

  try {
    return await updateSession(request);
  } catch (err) {
    console.error("[middleware]", err);
    if (pathname.startsWith("/admin")) {
      const next = request.nextUrl.clone();
      next.pathname = "/login";
      next.searchParams.set("next", pathname);
      return NextResponse.redirect(next);
    }
    return NextResponse.next({ request });
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|woff2?)$).*)",
  ],
};
