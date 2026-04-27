"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Client-side Supabase instance. Safe for browser bundles.
 * Only the anon key is exposed; RLS must be enforced in DB.
 */
export function supabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
