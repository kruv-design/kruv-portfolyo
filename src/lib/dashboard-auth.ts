import { timingSafeEqual } from "node:crypto";

/** kruvtest dashboard ile aynı çerez adı ve Vercel env. */
export const DASHBOARD_AUTH_COOKIE = "dashboard_access";

export function getDashboardPassword(): string {
  return String(process.env.DASHBOARD_PASSWORD ?? "").trim();
}

export function isDashboardPasswordConfigured(): boolean {
  return getDashboardPassword().length > 0;
}

export function isLocalHostname(hostname: string): boolean {
  const host = hostname.replace(/^\[|\]$/g, "").split(":")[0];
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}

/** Yerelde kapı yok; Vercel / üretimde şifre zorunlu (kruvtest). */
export function shouldEnforceDashboardGate(hostname: string): boolean {
  return !isLocalHostname(hostname);
}

export function verifyDashboardPassword(input: string): boolean {
  const expected = getDashboardPassword();
  if (!expected) return false;
  const provided = String(input ?? "").trim();
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function isDashboardCookieAuthed(getCookie: (name: string) => string | undefined): boolean {
  if (!isDashboardPasswordConfigured()) return false;
  return getCookie(DASHBOARD_AUTH_COOKIE) === "1";
}

/** Oturum çerezi — tarayıcı kapanınca silinir; Max-Age yok. */
export function dashboardAuthCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
}

export function clearDashboardAuthCookieOptions() {
  return {
    ...dashboardAuthCookieOptions(),
    maxAge: 0,
  };
}
