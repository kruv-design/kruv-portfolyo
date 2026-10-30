/**
 * Yeni blog: Lobide ilk 8 saniye...
 * Çalıştırma: node scripts/publish-blog-first-8-seconds.mjs
 * Önkoşul: .env.local içinde NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 */
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function loadEnv() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const candidates = [
    path.join(root, ".env.local"),
    path.join(root, ".env.production.local"),
  ];
  const out = {};
  for (const file of candidates) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf8").split("\n")) {
      if (!line.includes("=") || line.trim().startsWith("#")) continue;
      const i = line.indexOf("=");
      const k = line.slice(0, i).trim();
      let v = line.slice(i + 1).trim();
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      if (v) out[k] = v;
    }
  }
  return out;
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "Eksik env: NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli (.env.local).",
  );
  process.exit(1);
}

const cloud =
  env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "di0qbhh46";
const kapak = `https://res.cloudinary.com/${cloud}/image/upload/kruv-portfolio/blog/premium-whitespace.png`;

const post = {
  slug: "lobide-ilk-8-saniye",
  baslik: "Lobide ilk 8 saniye neden her şeyi belirler",
  title: "Why the first 8 seconds in the lobby decide everything",
  aciklama:
    "Misafir kapıdan girer. Henüz check-in yok, henüz oda yok. Ama karar çoktan oluşmaya başlamıştır: “Burada kendimi önemli hissediyor muyum, yoksa sıraya mı girdim?”\n\nBu kararın çoğu bilinçli değil. Koku, ışık, ses yüksekliği, birinin bakış süresi, zeminin sesi. Beyin güveni hızlı tartar; lüksü katalogdan değil, bedenden okur.",
  description:
    "A guest walks through the door. No check-in yet, no room yet. But a decision is already forming: “Do I feel valued here, or am I just in line?”\n\nMost of that decision is not conscious. Scent, light, volume, how long someone looks at you, the sound of the floor. The brain sizes up trust fast. It reads luxury from the body, not from a brochure.",
  kapak,
  yayinda: true,
  bolumler: [
    {
      baslik: "Sosyal medya sayfası dijital lobidir",
      title: "Your social feed is the digital lobby",
      metin:
        "Aynı refleks telefonda da var. Biri oteli veya restoranı ilk kez Instagram’da, TikTok’ta, belki bir Reels karesinde görür. O kare lobinin kapısıdır. Işık, tempo, yüz ifadesi, yazı tipi, boşluk… Misafir “güzel mekan” demeden önce “ben buraya ait miyim?” diye sorar.\n\nSosyal medya sayfası süs değil; dijital lobidir. Düzensiz grid, rastgele filtre, özensiz story ritmi, lobideki fazla yüksek müzik kadar bozar. Güçlü bir sosyal vitrin tek başına yetmez ama zayıf bir sosyal vitrin her şeyi bozar.\n\nSite, rezervasyon, menü: bunlar ikinci kapı. İlk kapı çoğu zaman telefonun içinde açılır. Fotoğraf “sessiz bir akşam” diyorsa, story temposu da o geceyi taşımalı; profil bio’su da, öne çıkanlar da, kaydırırken hissedilen düzen de. Acele ettiren metin, kalabalık kapak, üç farklı dil… küçük gibi durur; aslında karşılama bozulmuştur.",
      text: "The same reflex lives on the phone. Someone first meets a hotel or restaurant on Instagram, TikTok, maybe a single Reels frame. That frame is the lobby door. Light, pace, expression, type, space… Before they say “nice place,” they ask “do I belong here?”\n\nA social page is not decoration. It is the digital lobby. A messy grid, random filters, a careless story rhythm damage the feeling as much as music turned too loud in a real lobby. A strong social presence is not enough on its own, but a weak one breaks everything.\n\nWebsite, booking, menu: those are the second door. The first door usually opens inside the phone. If the photo says “a quiet evening,” the story pace should carry that night too, along with the bio, the highlights, and the order you feel while scrolling. Rushed copy, a crowded cover, three competing tones… they look small, but the welcome is already broken.",
      gorsel: "",
    },
    {
      baslik: "İlk kaydırmada ne hissediliyor?",
      title: "What do they feel on the first scroll?",
      metin:
        "Kruv olarak baktığımız yer tam burası: sosyal medyada duruş, ritm ve görünüm. Misafiri içeri davet eden dil buradan kurulur; site ve diğer kanallar bunu tamamlar, onun yerine geçmez.\n\nSoru şu: Misafirinizin ilk 8 saniyesinde (çoğu zaman bir kaydırmada) neyi hissettiriyorsunuz: davet mi, gürültü mü?\n\nMarkanızın dijital lobisini netleştirmek isterseniz, projelerimize göz atabilir veya kruv.com üzerinden bizimle konuşabilirsiniz.",
      text: "That is exactly where we look at Kruv: posture, rhythm, and appearance on social. The language that invites a guest in is built here. The website and other channels complete it; they do not replace it.\n\nSo: in your guest’s first 8 seconds (often one scroll), what do you make them feel: an invitation, or noise?\n\nIf you want to sharpen your brand’s digital lobby, browse our work or talk to us at kruv.com.",
      gorsel: "",
    },
  ],
};

const res = await fetch(`${url}/rest/v1/blog_posts?on_conflict=slug`, {
  method: "POST",
  headers: {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates,return=representation",
  },
  body: JSON.stringify([post]),
});

const body = await res.text();
if (!res.ok) {
  console.error(`HATA Supabase ${res.status}:`, body.slice(0, 500));
  process.exit(1);
}

const rows = JSON.parse(body);
console.log("Yayında:");
for (const r of rows) {
  console.log(`- ${r.slug}`);
  console.log(`  TR https://kruv.com/tr/blog/${r.slug}`);
  console.log(`  EN https://kruv.com/en/blog/${r.slug}`);
}
