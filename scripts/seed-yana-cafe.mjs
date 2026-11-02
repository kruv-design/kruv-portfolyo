/**
 * Yana Cafe — Cloudinary görselleri zaten klasörde; Supabase projects upsert.
 * Kullanım:
 *   npx vercel env run -e production -- node scripts/seed-yana-cafe.mjs
 */
const CLD = "https://res.cloudinary.com/di0qbhh46/image/upload";
const FOLDER = "kruv-portfolio/projects/yana-cafe";

const urls = {
  kapak: `${CLD}/v1793629314/${FOLDER}/kapak.jpg`,
  g01: `${CLD}/v1793629075/${FOLDER}/g01.jpg`,
  g02: `${CLD}/v1793629142/${FOLDER}/g02.jpg`,
  g03: `${CLD}/v1793629162/${FOLDER}/g03.jpg`,
  g04: `${CLD}/v1793629184/${FOLDER}/g04.jpg`,
  g05: `${CLD}/v1793629210/${FOLDER}/g05.jpg`,
  g06: `${CLD}/v1793629243/${FOLDER}/g06.jpg`,
  g07: `${CLD}/v1793629302/${FOLDER}/g07.jpg`,
  g08: `${CLD}/v1793629316/${FOLDER}/g08.jpg`,
};

const payload = {
  slug: "yana-cafe",
  baslik: "Yana Cafe",
  title: "Yana Cafe",
  kategori: "Fotoğraf, sosyal medya, hospitality",
  category: "Photography, social media, hospitality",
  aciklama:
    "Yana Cafe için kahve yapım ritüelini merkeze alan bir fotoğraf serisi: çekirdekten demlemeye, dökümden fincana. Sıcak ahşap, koyu tonlar ve el işçiliğiyle markanın specialty dilini sosyal medya ve içerik üretimi için netleştirdik.",
  description:
    "For Yana Cafe we built a photography series around the coffee ritual — from bean to brew to pour. Warm wood, deep tones, and handcrafted moments that give the specialty brand a clear language for social and content.",
  kapak: urls.kapak,
  galeri_1: urls.g01,
  galeri_2: urls.g02,
  galeri_3: urls.g03,
  galeri_4: urls.g04,
  galeri_5: urls.g05,
  galeri_6: urls.g06,
  galeri_7: urls.g07,
  galeri_8: urls.g08,
  galeri_9: "",
  galeri_10: "",
  galeri_11: "",
  galeri_12: "",
  galeri_13: "",
  galeri_14: "",
  galeri_15: "",
  galeri_1_video: "https://res.cloudinary.com/di0qbhh46/video/upload/v1793629442/kruv-portfolio/projects/yana-cafe/v01.mp4",
  galeri_5_video: "https://res.cloudinary.com/di0qbhh46/video/upload/v1793629436/kruv-portfolio/projects/yana-cafe/v02.mp4",
  bolumler: [],
  etiketler: ["Fotoğraf", "Sosyal medya", "Hospitality"],
  featured: true,
  yayinda: true,
  next_project_override: "",
  renk: "#6B4F3A",
  sira: 2,
};

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key || url.includes("[SENSITIVE]") || key.includes("[SENSITIVE]")) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
  Prefer: "resolution=merge-duplicates,return=representation",
};

const listRes = await fetch(
  `${url}/rest/v1/projects?select=id,slug,sira&order=sira.asc`,
  { headers },
);
const existing = await listRes.json();
if (!Array.isArray(existing)) {
  console.error("list failed", existing);
  process.exit(1);
}

const yana = existing.find((p) => p.slug === "yana-cafe");
if (!yana) {
  // Keep GG(0) Opera(1); bump others at/above 2
  for (const p of existing) {
    const s = Number(p.sira) || 0;
    if (s >= 2 && p.slug !== "gg-pizza" && p.slug !== "opera-hotel-bosphorus") {
      await fetch(`${url}/rest/v1/projects?id=eq.${p.id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ sira: s + 1 }),
      });
    }
  }
}

const upsertRes = await fetch(`${url}/rest/v1/projects?on_conflict=slug`, {
  method: "POST",
  headers,
  body: JSON.stringify(payload),
});
const body = await upsertRes.json();
if (!upsertRes.ok) {
  console.error("upsert failed", upsertRes.status, body);
  process.exit(1);
}
console.log("ok", Array.isArray(body) ? body[0]?.slug : body?.slug, "sira", payload.sira);
console.log("kapak", payload.kapak);
