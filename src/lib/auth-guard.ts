import "server-only";
import { supabaseServer } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

/**
 * Ensure the current request is authenticated.
 * Returns the user if OK, throws 401-shaped Response otherwise.
 */
export async function requireUser(): Promise<User> {
  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) {
    throw Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return user;
}
