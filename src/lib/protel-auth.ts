import "server-only";
import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const PROTEL_AUTH_COOKIE = "protel_access";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export function getProtelPassword(): string {
  return String(process.env.PROTEL_PAGE_PASSWORD ?? "").trim();
}

export async function isProtelAuthed(): Promise<boolean> {
  const expected = getProtelPassword();
  if (!expected) return false;
  const jar = await cookies();
  return jar.get(PROTEL_AUTH_COOKIE)?.value === "1";
}

export function verifyProtelPassword(input: string): boolean {
  const expected = getProtelPassword();
  if (!expected) return false;
  const provided = String(input ?? "").trim();
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function protelAuthCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  };
}
