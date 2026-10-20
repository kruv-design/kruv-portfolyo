/**
 * GG Pizza — diğer projelerle aynı: galeri_1_video + galeri_5_video.
 * Kullanım: npx vercel env run -e production -- node scripts/patch-gg-pizza-videos.mjs
 */
const V1 =
  "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=kruv-portfolio%2Ftjuplhh3fvinklogpqi4";
const V2 =
  "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=kruv-portfolio%2Fnit0n7q4q4u0dgbn2j2q";

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
  body: JSON.stringify({ galeri_1_video: V1, galeri_5_video: V2 }),
});
const body = await res.text();
if (!res.ok) {
  console.error(res.status, body);
  process.exit(1);
}
console.log("ok", body.slice(0, 300));
