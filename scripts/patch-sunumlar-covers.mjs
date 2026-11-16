/**
 * Figma SUNUMLAR en üst kapak → Cloudinary kapak URL’lerini projects.kapak’a yazar.
 * Kullanım: npx vercel env run -e production -- node scripts/patch-sunumlar-covers.mjs
 */
const CLD = "https://res.cloudinary.com/di0qbhh46/image/upload";

const COVERS = {
  "pricing-coach": `${CLD}/v1794831797/kruv-portfolio/projects/pricing-coach/kapak.jpg`,
  "rootsadventure-travel": `${CLD}/v1794821890/kruv-portfolio/projects/rootsadventure-travel/kapak.jpg`,
  "oguz-media": `${CLD}/v1794821891/kruv-portfolio/projects/oguz-media/kapak.jpg`,
  "gg-pizza": `${CLD}/v1794830906/kruv-portfolio/projects/gg-pizza/kapak.jpg`,
  beadbox: `${CLD}/v1794821900/kruv-portfolio/projects/beadbox/kapak.jpg`,
  musterek: `${CLD}/v1794821901/kruv-portfolio/projects/musterek/kapak.jpg`,
  "opera-hotel-bosphorus": `${CLD}/v1794831799/kruv-portfolio/projects/opera-hotel-bosphorus/kapak.jpg`,
};

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

for (const [slug, kapak] of Object.entries(COVERS)) {
  const res = await fetch(
    `${url}/rest/v1/projects?slug=eq.${encodeURIComponent(slug)}`,
    {
      method: "PATCH",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ kapak }),
    },
  );
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }
  const row = Array.isArray(body) ? body[0] : body;
  if (!res.ok) {
    console.error("FAIL", slug, res.status, text.slice(0, 200));
    process.exitCode = 1;
    continue;
  }
  if (!row) {
    console.error("MISS", slug, "(no row)");
    process.exitCode = 1;
    continue;
  }
  console.log(
    "OK",
    slug,
    String(row.kapak || "").includes(String(COVERS[slug].match(/v\d+/)?.[0] || "")),
  );
}
