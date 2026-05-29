/* eslint-disable no-console */
/**
 * Levantenler — TR aciklama + EN description (düz sütunlar).
 * Usage: npx tsx scripts/patch-levantenler-copy.ts
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv() {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^"|"$/g, "");
      }
    }
  } catch {
    // rely on env
  }
}

const TR_ACIKLAMA = `Levantenler, Doğu Akdeniz'e yerleşen, çoğunlukla İtalyan ve Fransız kökenli topluluklardır. İstanbul ve İzmir başta olmak üzere Osmanlı ve Türk kültürüne, ekonomisine derin izler bıraktılar.

İki kültür arasında doğan yeni bir kültür. Doğu ile Batı'nın kesişimi.

Beyoğlu Kültür Yolu Festivali kapsamında düzenlenen Levantenler Konferansı, bu mirası yaşatmak ve şehirle Levantenler arasında köprü kurmak için hayata geçti.

Konferansın kimlik ve yönlendirme tasarımını biz üstlendik.`;

const EN_TITLE = "Levantines Conference";
const EN_CATEGORY = "Branding, exhibition design";
const EN_DESCRIPTION = `Levantines are people of mostly Italian and French origin who settled in the eastern Mediterranean; primarily Istanbul and Izmir, and shaped Ottoman and Turkish culture and economy for generations.

A culture born between two cultures. The intersection of East and West.

The Levantines Conference, held as part of the Beyoğlu Kültür Yolu Festival, was organized to keep this legacy alive and bridge the Levantines with the city's citizens.

We designed the identity and conference wayfinding.`;

async function main() {
  loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli (.env.local)");
    process.exit(1);
  }

  const sb = createClient(url, key);
  const { error } = await sb
    .from("projects")
    .update({
      aciklama: TR_ACIKLAMA,
      title: EN_TITLE,
      category: EN_CATEGORY,
      description: EN_DESCRIPTION,
    })
    .eq("slug", "levantenler");

  if (error) {
    if (error.code === "42703" || error.code === "PGRST204") {
      console.error(
        "description/title/category sütunları yok — önce supabase/RUN_ME_projects_en_columns.sql çalıştırın.",
      );
      process.exit(1);
    }
    throw error;
  }
  console.log("✓ levantenler — aciklama + title + category + description güncellendi");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
