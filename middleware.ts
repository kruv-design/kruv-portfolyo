import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import {
  DEFAULT_LOCALE,
  LOCALES,
  normalizeLocale,
} from "@/lib/i18n/config";

const PUBLIC_FILE = /\.[^/]+$/;

function hasLocalePrefix(pathname: string): boolean {
  return LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
}

/** Kök `/` artık `src/app/route.ts` (GET) ile `public/kruv.html` döndürüyor — rewrite gerekmez. */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    PUBLIC_FILE.test(pathname);

  if (!isAsset && !hasLocalePrefix(pathname)) {
    const next = request.nextUrl.clone();
    if (pathname === "/") {
      const cookieLocale = normalizeLocale(request.cookies.get("kruv-locale")?.value);
      const headerLocale = normalizeLocale(
        request.headers.get("accept-language")?.split(",")[0],
      );
      const locale = cookieLocale || headerLocale || DEFAULT_LOCALE;
      next.pathname = `/${locale}/works`;
    } else {
      next.pathname = `/${DEFAULT_LOCALE}${pathname}`;
    }
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
