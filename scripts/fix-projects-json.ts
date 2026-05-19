/* eslint-disable no-console */
/**
 * Fix null / invalid JSON on projects.gorseller, bolumler, etiketler.
 * Usage: npx tsx scripts/fix-projects-json.ts
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
    /* rely on process env */
  }
}

function normalizeJsonArray(value: unknown, field: string): unknown[] | null {
  if (value === null || value === undefined) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    const t = value.trim();
    if (!t || t.toLowerCase() === "json") return [];
    try {
      const parsed = JSON.parse(t) as unknown;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      console.warn(`  ${field}: invalid string → []`);
      return [];
    }
  }
  console.warn(`  ${field}: unexpected type ${typeof value} → []`);
  return [];
}

async function main() {
  loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: rows, error } = await supabase
    .from("projects")
    .select("id, slug, gorseller, bolumler, etiketler");

  if (error) {
    console.error("Select failed:", error.message);
    process.exit(1);
  }

  let fixed = 0;
  for (const row of rows ?? []) {
    const gorseller = normalizeJsonArray(row.gorseller, "gorseller");
    const bolumler = normalizeJsonArray(row.bolumler, "bolumler");
    const etiketler = normalizeJsonArray(row.etiketler, "etiketler");

    const needsFix =
      row.gorseller !== gorseller ||
      row.bolumler !== bolumler ||
      row.etiketler !== etiketler ||
      !Array.isArray(row.gorseller) ||
      !Array.isArray(row.bolumler) ||
      !Array.isArray(row.etiketler);

    if (!needsFix) continue;

    const { error: upErr } = await supabase
      .from("projects")
      .update({ gorseller, bolumler, etiketler })
      .eq("id", row.id);

    if (upErr) {
      console.error(`Failed ${row.slug ?? row.id}:`, upErr.message);
      process.exit(1);
    }
    console.log(`Fixed: ${row.slug ?? row.id}`);
    fixed += 1;
  }

  console.log(`Done. ${fixed} row(s) updated, ${(rows?.length ?? 0) - fixed} already OK.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
