/**
 * GG Pizza kapak + galeri URL'lerini Cloudinary'ye taşır.
 * Kullanım: npx vercel env run -e production -- node scripts/patch-gg-pizza-cloudinary.mjs
 */
const CLD = "https://res.cloudinary.com/di0qbhh46/image/upload";
const FOLDER = "kruv-portfolio/projects/gg-pizza";

const patch = {
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
};

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key || url.includes("[SENSITIVE]") || key.includes("[SENSITIVE]")) {
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
  body: JSON.stringify(patch),
});
const body = await res.text();
if (!res.ok) {
  console.error(res.status, body);
  process.exit(1);
}
const row = JSON.parse(body)?.[0];
console.log(
  "ok",
  row?.slug,
  "kapak=",
  String(row?.kapak || "").includes("cloudinary"),
  "g1=",
  String(row?.galeri_1 || "").includes("cloudinary"),
);
