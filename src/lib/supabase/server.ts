import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

type CookiePayload = { name: string; value: string; options?: CookieOptions };

/**
 * Server component / Route handler client.
 * Uses the user's session cookie — safe to call from RSCs.
 */
export async function supabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookiePayload[]) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a pure RSC; cookies are readonly there — safe to ignore.
        }
      },
    },
  });
}

/**
 * Elevated server-only client. Use SPARINGLY — only in:
 *   - seed scripts
 *   - migrations
 *   - webhooks where RLS cannot run
 * Never import this into client components.
 */
export function supabaseAdmin() {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Cookie-free public reader. Safe to call from:
 *   - generateStaticParams / generateMetadata
 *   - sitemap / robots
 *   - any build-time RSC that only needs public data
 * RLS still applies (anon role, read-only for public tables).
 */
export function supabasePublic() {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
