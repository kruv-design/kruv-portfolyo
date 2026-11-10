/**
 * Müşterek + Beadbox — Figma Claude sections → Cloudinary → Supabase.
 * Kullanım: node --env-file=.env.local scripts/seed-musterek-beadbox.mjs
 */
const CLD = "https://res.cloudinary.com/di0qbhh46/image/upload";

const projects = [
  {
    slug: "musterek",
    baslik: "Müşterek Hizalanma",
    title: "Müşterek Hizalanma",
    kategori: "Fotoğraf, sergi",
    category: "Photography, exhibition",
    aciklama:
      "Ye’r Community’nin dördüncü yılı kapsamında 24 Ekim 2026’da TOMTOM - Mekan Tophane’de gerçekleşen Müşterek Hizalanma karma sergisinin fotoğrafını çektik. Sekiz genç sanatçının beden, malzeme ve mekân üzerinden kurduğu ortak atmosferi; ışık, kumaş, ses ve yerleştirmelerle şekillenen kolektif deneyimi belgedik.",
    description:
      "We photographed Müşterek Hizalanma, the group exhibition held on 24 October 2026 at TOMTOM - Mekan Tophane for Ye’r Community’s fourth year. We documented the shared atmosphere eight young artists built around body, material, and space, and the collective experience shaped by light, fabric, sound, and installation.",
    kapak: `${CLD}/v1793957252/kruv-portfolio/projects/musterek/kapak.png`,
    galeri_1: `${CLD}/v1793957254/kruv-portfolio/projects/musterek/g01.jpg`,
    galeri_2: `${CLD}/v1793957260/kruv-portfolio/projects/musterek/g02.png`,
    galeri_3: `${CLD}/v1793957261/kruv-portfolio/projects/musterek/g03.jpg`,
    galeri_4: `${CLD}/v1793957262/kruv-portfolio/projects/musterek/g04.jpg`,
    galeri_5: `${CLD}/v1793957263/kruv-portfolio/projects/musterek/g05.jpg`,
    galeri_6: `${CLD}/v1793957264/kruv-portfolio/projects/musterek/g06.png`,
    galeri_7: `${CLD}/v1793957266/kruv-portfolio/projects/musterek/g07.jpg`,
    galeri_8: "",
    galeri_9: "",
    galeri_10: "",
    galeri_11: "",
    galeri_12: "",
    bolumler: [],
    etiketler: ["Fotoğraf", "Sergi"],
    featured: true,
    yayinda: true,
    renk: "#A67C52",
    sira: 2,
  },
  {
    slug: "beadbox",
    baslik: "Beadbox",
    title: "Beadbox",
    kategori: "Fotoğraf, sosyal medya, ürün",
    category: "Photography, social media, product",
    aciklama:
      "Beadbox için el yapımı takıların dokusunu öne çıkaran bir ürün fotoğrafı ve sosyal medya seti hazırladık: krem zemin, soft ışık ve telefon mockup’larıyla markanın sıcak, dokunsal dilini kurduk.",
    description:
      "For Beadbox we built a product photography and social set that highlights handmade jewelry texture — cream surfaces, soft light, and phone mockups that carry the brand’s warm, tactile voice.",
    kapak: `${CLD}/v1793957237/kruv-portfolio/projects/beadbox/kapak.png`,
    galeri_1: `${CLD}/v1793957238/kruv-portfolio/projects/beadbox/g01.jpg`,
    galeri_2: `${CLD}/v1793957239/kruv-portfolio/projects/beadbox/g02.png`,
    galeri_3: `${CLD}/v1793957241/kruv-portfolio/projects/beadbox/g03.jpg`,
    galeri_4: `${CLD}/v1793957242/kruv-portfolio/projects/beadbox/g04.jpg`,
    galeri_5: `${CLD}/v1793957243/kruv-portfolio/projects/beadbox/g05.png`,
    galeri_6: `${CLD}/v1793957247/kruv-portfolio/projects/beadbox/g06.jpg`,
    galeri_7: `${CLD}/v1793957248/kruv-portfolio/projects/beadbox/g07.jpg`,
    galeri_8: `${CLD}/v1793957250/kruv-portfolio/projects/beadbox/g08.jpg`,
    galeri_9: `${CLD}/v1793957251/kruv-portfolio/projects/beadbox/g09.jpg`,
    galeri_10: "",
    galeri_11: "",
    galeri_12: "",
    bolumler: [],
    etiketler: ["Fotoğraf", "Sosyal medya", "Ürün"],
    featured: true,
    yayinda: true,
    renk: "#D4B896",
    sira: 3,
  },
];

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

const listRes = await fetch(`${url}/rest/v1/projects?select=id,slug,sira&order=sira.asc`, { headers });
const existing = await listRes.json();
if (!Array.isArray(existing)) {
  console.error("list failed", existing);
  process.exit(1);
}
const bySlug = Object.fromEntries(existing.map((p) => [p.slug, p]));

const needInsert = projects.some((p) => !bySlug[p.slug]);
if (needInsert) {
  for (const p of existing) {
    const s = Number(p.sira) || 0;
    if (s >= 2 && !["gg-pizza", "pricing-coach", "musterek", "beadbox"].includes(p.slug)) {
      await fetch(`${url}/rest/v1/projects?id=eq.${p.id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ sira: s + 2 }),
      });
    }
  }
}

for (const payload of projects) {
  const prev = bySlug[payload.slug];
  const res = prev
    ? await fetch(`${url}/rest/v1/projects?id=eq.${prev.id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(payload),
      })
    : await fetch(`${url}/rest/v1/projects`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
  const body = await res.json();
  if (!res.ok) {
    console.error("write failed", payload.slug, res.status, body);
    process.exit(1);
  }
  console.log("ok", payload.slug, "sira", payload.sira);
}
