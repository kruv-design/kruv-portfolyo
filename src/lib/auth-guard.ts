import "server-only";
import { supabaseServer } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

/** Route handler’da `catch` ile dönülecek 401/503 yanıtları ayırt etmek için. */
export function isAuthFailureResponse(e: unknown): e is Response {
  return e instanceof Response;
}

/**
 * Ensure the current request is authenticated.
 * Başarısızlıkta yalnızca `Response` fırlatır — `catch (e) { if (isAuthFailureResponse(e)) return e }` ile kullanın.
 */
export async function requireUser(): Promise<User> {
  try {
    const sb = await supabaseServer();
    const {
      data: { user },
      error,
    } = await sb.auth.getUser();
    if (error) {
      console.error("[requireUser] getUser:", error.message);
      throw Response.json(
        { error: `Kimlik servisi: ${error.message}` },
        { status: 503 },
      );
    }
    if (!user) {
      throw Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    return user;
  } catch (e) {
    if (isAuthFailureResponse(e)) throw e;
    console.error("[requireUser]", e);
    throw Response.json(
      { error: "Oturum doğrulanamadı (beklenmeyen hata)." },
      { status: 503 },
    );
  }
}
