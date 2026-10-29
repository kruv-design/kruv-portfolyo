/**
 * GG Pizza projesini Supabase'e ekler / günceller (anasayfa 1. sıra).
 * Kullanım: npx vercel env run -e production -- node scripts/seed-gg-pizza.mjs
 */
const CLD = "https://res.cloudinary.com/di0qbhh46/image/upload";
const FOLDER = "kruv-portfolio/projects/gg-pizza";

const payload = {
  slug: "gg-pizza",
  baslik: "GG Pizza",
  title: "GG Pizza",
  kategori: "Marka kimliği, menü tasarımı, sosyal medya, performans",
  category: "Brand identity, menu design, social media, performance",
  aciklama:
    "GG Pizza için marka kimliği, menü ve stand tasarımı, etkinlik branding’i, sosyal medya yönetimi, çekim ve performans pazarlamasını tek bir görsel sistemde birleştirdik. Masadan feed’e, feed’den rezervasyona uzanan bir hikâye.",
  description:
    "For GG Pizza we built brand identity, menu and stand design, event branding, social media management, photography, and performance marketing as one visual system — from the table to the feed, and from the feed to bookings.",
  kapak: `${CLD}/v1793313787/${FOLDER}/kapak.png`,
  galeri_1: `${CLD}/v1792473757/${FOLDER}/g01.png`,
  galeri_2: `${CLD}/v1792473767/${FOLDER}/g02.png`,
  galeri_3: `${CLD}/v1792473756/${FOLDER}/g03.png`,
  galeri_4: `${CLD}/v1792473756/${FOLDER}/g04.png`,
  galeri_5: `${CLD}/v1792473768/${FOLDER}/g05.png`,
  galeri_6: `${CLD}/v1792473768/${FOLDER}/g06.png`,
  galeri_7: `${CLD}/v1792473768/${FOLDER}/g07.png`,
  galeri_8: `${CLD}/v1792473769/${FOLDER}/g08.png`,
  galeri_9: `${CLD}/v1792473769/${FOLDER}/g09.png`,
  galeri_10: `${CLD}/v1792473773/${FOLDER}/g10.png`,
  galeri_11: `${CLD}/v1792473774/${FOLDER}/g11.png`,
  galeri_12: `${CLD}/v1792473773/${FOLDER}/g12.png`,
  galeri_13: `${CLD}/v1792473774/${FOLDER}/g13.png`,
  galeri_14: `${CLD}/v1792473774/${FOLDER}/g14.png`,
  galeri_15: "",
  bolumler: [],
  etiketler: ["brand-identity", "packaging"],
  featured: true,
  yayinda: true,
  next_project_override: "",
  renk: "#E10600",
  sira: 0,
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

// Bump other projects' sira so GG stays first among featured+sira sort
const listRes = await fetch(
  `${url}/rest/v1/projects?select=id,slug,sira&order=sira.asc`,
  { headers },
);
const existing = await listRes.json();
if (!Array.isArray(existing)) {
  console.error("list failed", existing);
  process.exit(1);
}

const gg = existing.find((p) => p.slug === "gg-pizza");
if (!gg) {
  // shift everyone by +10 so 0 is free
  for (const p of existing) {
    await fetch(`${url}/rest/v1/projects?id=eq.${p.id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ sira: (Number(p.sira) || 0) + 10 }),
    });
  }
}

const upsertRes = await fetch(`${url}/rest/v1/projects?on_conflict=slug`, {
  method: "POST",
  headers: {
    ...headers,
    Prefer: "resolution=merge-duplicates,return=representation",
  },
  body: JSON.stringify(payload),
});
const text = await upsertRes.text();
if (!upsertRes.ok) {
  console.error("upsert failed", upsertRes.status, text);
  process.exit(1);
}
console.log("ok", text.slice(0, 400));
