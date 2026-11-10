/**
 * Müşterek Hizalanma — sergi fotoğrafçılığı açıklaması.
 * Kullanım: npx vercel env run -e production -- node scripts/patch-musterek-copy.mjs
 */
const PATCH = {
  kategori: "Fotoğraf, sergi",
  category: "Photography, exhibition",
  aciklama:
    "Ye’r Community’nin dördüncü yılı kapsamında 24 Ekim 2026’da TOMTOM - Mekan Tophane’de gerçekleşen Müşterek Hizalanma karma sergisinin fotoğrafını çektik. Sekiz genç sanatçının beden, malzeme ve mekân üzerinden kurduğu ortak atmosferi; ışık, kumaş, ses ve yerleştirmelerle şekillenen kolektif deneyimi belgedik.",
  description:
    "We photographed Müşterek Hizalanma, the group exhibition held on 24 October 2026 at TOMTOM - Mekan Tophane for Ye’r Community’s fourth year. We documented the shared atmosphere eight young artists built around body, material, and space, and the collective experience shaped by light, fabric, sound, and installation.",
  etiketler: ["Fotoğraf", "Sergi"],
};

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing Supabase env");
  process.exit(1);
}

const res = await fetch(`${url}/rest/v1/projects?slug=eq.musterek`, {
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
console.log("ok", body.slice(0, 800));
