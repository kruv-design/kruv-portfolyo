/**
 * GG Pizza — kategori / açıklama / etiketler.
 * Kullanım: npx vercel env run -e production -- node scripts/patch-gg-pizza-copy.mjs
 */
const PATCH = {
  kategori: "Sosyal medya, video, fotoğraf, marka kimliği",
  category: "Social media, video, photography, brand identity",
  aciklama:
    "GG Pizza’nın sosyal medya, video ve fotoğraf iletişimini merkeze alıyoruz; içerik üretimi ve günlük feed yönetimi asıl işimiz. Marka kimliği, ambalaj ve etkinlik çalışmaları bu hikâyeyi destekleyen ikinci planda.",
  description:
    "For GG Pizza we put social media, video, and photography communication first — content production and day-to-day feed management are the core. Brand identity, packaging, and event work sit in a supporting role.",
  etiketler: ["Sosyal medya", "Marka kimliği", "Ambalaj"],
};

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing Supabase env");
  process.exit(1);
}

const res = await fetch(`${url}/rest/v1/projects?slug=eq.gg-pizza`, {
  method: "PATCH",
  headers: {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  },
  body: JSON.stringify(PATCH),
});
const body = await res.text();
if (!res.ok) {
  console.error(res.status, body);
  process.exit(1);
}
console.log("ok", body.slice(0, 500));
