import "server-only";
import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/server";

export const PROTEL_AUTH_COOKIE = "protel_access";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export function getProtelPasswordFromEnv(): string {
  return String(process.env.PROTEL_PAGE_PASSWORD ?? "").trim();
}

async function getProtelPasswordFromDb(): Promise<string> {
  try {
    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from("protel_page_secrets")
      .select("page_password")
      .eq("id", 1)
      .maybeSingle();

    if (error) throw error;
    return String(data?.page_password ?? "").trim();
  } catch {
    return "";
  }
}

/** Supabase şifresi öncelikli; yoksa Vercel env yedek. */
export async function resolveProtelPassword(): Promise<string> {
  const fromDb = await getProtelPasswordFromDb();
  if (fromDb) return fromDb;
  return getProtelPasswordFromEnv();
}

export async function isProtelAuthed(): Promise<boolean> {
  const expected = await resolveProtelPassword();
  if (!expected) return false;
  const jar = await cookies();
  return jar.get(PROTEL_AUTH_COOKIE)?.value === "1";
}

export async function verifyProtelPassword(input: string): Promise<boolean> {
  const expected = await resolveProtelPassword();
  if (!expected) return false;
  const provided = String(input ?? "").trim();
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(expected, "utf8");
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
