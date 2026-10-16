import { createHash, timingSafeEqual } from "node:crypto";
import { DASHBOARD_TOKEN_SALT } from "@/lib/dashboard-auth-edge";

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

/** Çerez değeri: şifreden türetilen token (sabit "1" yerine — taklit edilemez). */
export function dashboardSessionToken(): string {
  return createHash("sha256")
    .update(`${DASHBOARD_TOKEN_SALT}${getDashboardPassword()}`, "utf8")
    .digest("hex");
}

export function isDashboardCookieAuthed(getCookie: (name: string) => string | undefined): boolean {
  if (!isDashboardPasswordConfigured()) return false;
  const provided = Buffer.from(String(getCookie(DASHBOARD_AUTH_COOKIE) ?? ""), "utf8");
  const expected = Buffer.from(dashboardSessionToken(), "utf8");
  if (provided.length !== expected.length) return false;
  return timingSafeEqual(provided, expected);
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
