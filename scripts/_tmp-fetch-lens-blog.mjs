import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
for (const name of [".env.vercel.tmp", ".env.local", ".env.production.local"]) {
  const file = path.join(root, name);
  if (!existsSync(file)) continue;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#") || !t.includes("=")) continue;
    const i = t.indexOf("=");
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (v && !process.env[k]) process.env[k] = v;
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
console.log("url?", Boolean(url), "key?", Boolean(key), "keyLen", key?.length ?? 0);
if (!url || !key) process.exit(1);

const res = await fetch(
  `${url}/rest/v1/blog_posts?slug=eq.hangi-mekani-hangi-lens-ceker&select=id,slug,baslik,title,aciklama,kapak,yayinda,bolumler`,
  { headers: { apikey: key, Authorization: `Bearer ${key}` } },
);
const text = await res.text();
console.log("status", res.status);
console.log(text.slice(0, 5000));
