/**
 * Opera Hotel Bosphorus — etiketleri Figma/okunur TR forma çek.
 *   node --env-file=.env.production.pulled scripts/patch-opera-etiketler.mjs
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
if (!url || !key) {
  console.error("Missing Supabase URL / service role key");
  process.exit(1);
}

const sb = createClient(url, key, { auth: { persistSession: false } });
const payload = {
  etiketler: ["Sosyal medya", "Fotoğraf", "Hospitality"],
  kategori: "Sosyal medya, fotoğraf, hospitality",
};

const { data, error } = await sb
  .from("projects")
  .update(payload)
  .eq("slug", "opera-hotel-bosphorus")
  .select("slug, etiketler, kategori")
  .maybeSingle();

if (error) {
  console.error(error);
  process.exit(1);
}
console.log("updated", data);
