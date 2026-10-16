import { type NextRequest, NextResponse } from "next/server";
import { dashboardSessionTokenEdge } from "@/lib/dashboard-auth-edge";

/**
 * /admin şifre kapısı — kruvtest ile aynı DASHBOARD_PASSWORD.
 * Yerelde (localhost) kapı yok. Şifre tanımlı değilse admin kapalı kalır.
 * Not: kökteki middleware.ts src/ yapısında Next tarafından çalıştırılmıyor;
 * bu dosya yalnızca admin kapısını yönetir.
 */
const DASHBOARD_AUTH_COOKIE = "dashboard_access";

function isLocalHost(request: NextRequest): boolean {
  const raw =
    request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  const host = raw.split(",")[0].trim().replace(/^\[|\]$/g, "").split(":")[0];
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}

export async function middleware(request: NextRequest) {
  if (isLocalHost(request)) return NextResponse.next();

  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/login";

  const password = String(process.env.DASHBOARD_PASSWORD ?? "").trim();
  const cookie = request.cookies.get(DASHBOARD_AUTH_COOKIE)?.value ?? "";
  const authed =
    password.length > 0 && cookie === (await dashboardSessionTokenEdge(password));

  if (!isLogin && !authed) {
    const next = request.nextUrl.clone();
    next.pathname = "/login";
    next.search = "";
    next.searchParams.set("next", pathname);
    return NextResponse.redirect(next);
  }

  if (isLogin && authed) {
    const next = request.nextUrl.clone();
    next.pathname = "/admin";
    next.search = "";
    return NextResponse.redirect(next);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/login"],
};
