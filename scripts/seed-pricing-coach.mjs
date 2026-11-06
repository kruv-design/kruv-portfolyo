/**
 * Pricing Coach — Cloudinary görselleri hazır; Supabase projects insert/patch.
 * Kapak: PC 6 (folder + Instagram mockup)
 * Kullanım:
 *   node --env-file=.env.local scripts/seed-pricing-coach.mjs
 */
const CLD = "https://res.cloudinary.com/di0qbhh46/image/upload";
const FOLDER = "kruv-portfolio/projects/pricing-coach";

const urls = {
  kapak: `${CLD}/v1793955720/${FOLDER}/kapak.png`,
  g01: `${CLD}/v1793955719/${FOLDER}/g01.png`,
  g02: `${CLD}/v1793955721/${FOLDER}/g02.png`,
  g03: `${CLD}/v1793955722/${FOLDER}/g03.png`,
  g04: `${CLD}/v1793955723/${FOLDER}/g04.png`,
  g05: `${CLD}/v1793955723/${FOLDER}/g05.png`,
  // g06 = kapak; galeride tekrar yok
  g07: `${CLD}/v1793955725/${FOLDER}/g07.png`,
  g08: `${CLD}/v1793955725/${FOLDER}/g08.png`,
  g09: `${CLD}/v1793955725/${FOLDER}/g09.png`,
  g10: `${CLD}/v1793955727/${FOLDER}/g10.png`,
  g11: `${CLD}/v1793955727/${FOLDER}/g11.png`,
  g12: `${CLD}/v1793955728/${FOLDER}/g12.png`,
};

const payload = {
  slug: "pricing-coach",
  baslik: "Pricing Coach",
  title: "Pricing Coach",
  kategori: "Sosyal medya, marka kimliği, hospitality",
  category: "Social media, brand identity, hospitality",
  aciklama:
    "Pricing Coach için otel gelir yönetimi odaklı bir sosyal medya ve marka dili kurduk: mor–siyah palet, LinkedIn/Instagram içerik sistemi ve ürün hikâyesini taşıyan mockup’lar.",
  description:
    "For Pricing Coach we built a social and brand language around hotel revenue management — a purple–black system, LinkedIn/Instagram content, and product storytelling through mockups.",
  kapak: urls.kapak,
  galeri_1: urls.g01,
  galeri_2: urls.g02,
  galeri_3: urls.g03,
  galeri_4: urls.g04,
  galeri_5: urls.g05,
  galeri_6: urls.g07,
  galeri_7: urls.g08,
  galeri_8: urls.g09,
  galeri_9: urls.g10,
  galeri_10: urls.g11,
  galeri_11: urls.g12,
  galeri_12: "",
  bolumler: [],
  etiketler: ["Sosyal medya", "Marka kimliği", "Hospitality"],
  featured: true,
  yayinda: true,
  renk: "#6B21A8",
  sira: 1,
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
  Prefer: "return=representation",
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

const pc = existing.find((p) => p.slug === "pricing-coach");
if (!pc) {
  // GG(0) kalsın; sira >= 1 olanları +1 kaydır
  for (const p of existing) {
    const s = Number(p.sira) || 0;
    if (s >= 1 && p.slug !== "gg-pizza") {
      await fetch(`${url}/rest/v1/projects?id=eq.${p.id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ sira: s + 1 }),
      });
    }
  }
}

const writeRes = pc
  ? await fetch(`${url}/rest/v1/projects?id=eq.${pc.id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    })
  : await fetch(`${url}/rest/v1/projects`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

const body = await writeRes.json();
if (!writeRes.ok) {
  console.error("write failed", writeRes.status, body);
  process.exit(1);
}
console.log("ok", Array.isArray(body) ? body[0]?.slug : body?.slug, "sira", payload.sira);
console.log("kapak", payload.kapak);
