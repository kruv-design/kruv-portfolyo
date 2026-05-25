/* eslint-disable no-console */
/**
 * Seed Supabase with the three prototype projects from the original kruv.html.
 * Usage:  npx tsx scripts/seed.ts
 *
 * Requires: SUPABASE_SERVICE_ROLE_KEY + NEXT_PUBLIC_SUPABASE_URL in .env.local
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Tiny .env.local loader (no extra deps)
function loadEnv() {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^"|"$/g, "");
      }
    }
  } catch {
    // .env.local not present — rely on real env
  }
}

function slugify(input: string): string {
  const MAP: Record<string, string> = {
    ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", İ: "i",
    ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u",
  };
  return input
    .split("")
    .map((ch) => MAP[ch] ?? ch)
    .join("")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

const SEED = [
  {
    baslik: "Marka Kimliği — Karamel",
    kategori: "Branding",
    aciklama:
      "Küçük bir kahve markası için sıcak tonlar ve el yazısı tipografiyle hazırlanan tam kimlik sistemi.",
    bolumler: [
      {
        baslik: "Sorun & Fırsat",
        metin:
          "Karamel, İstanbul Karaköy'de açılmak üzere olan bağımsız bir kahve markasıydı. Kalabalık pazarda öne çıkmak için güçlü bir görsel kimliğe ihtiyaç vardı.",
      },
      {
        baslik: "Süreç",
        metin:
          "Moodboard aşamasından 3 farklı yön araştırıldı. Sıcak toprak tonları, el yazısı referanslı serif font ve minimal geometri öne çıktı.",
      },
      {
        baslik: "Sonuç",
        metin:
          "6 haftalık süreçte logo, renk paleti, tipografi sistemi, ambalaj ve 40 sayfalık marka rehberi teslim edildi.",
      },
    ],
    etiketler: ["Logo", "Ambalaj", "Marka Rehberi"],
    link: "https://example.com", featured: true, renk: "#C8A882",
  },
  {
    baslik: "Web Uygulaması — Finetrack",
    kategori: "UI/UX",
    aciklama:
      "Freelancer'lar için minimalist finans takip aracı. Figma'dan geliştirmeye kadar uçtan uca süreç.",
    bolumler: [
      {
        baslik: "Proje Hakkında",
        metin:
          "Finetrack, bağımsız çalışanların gelir-gider takibini karmaşık araçlara başvurmadan yapabilmesi için tasarlandı.",
      },
      {
        baslik: "Tasarım Kararları",
        metin:
          "5 freelancer ile yapılan görüşme sonucunda 3 kritik iş akışı belirlendi. Yüksek doğruluklu Figma prototipleri 2 tur kullanıcı testiyle iyileştirildi.",
      },
    ],
    etiketler: ["Figma", "Prototip", "Web App"],
    link: "", featured: false, renk: "#7A9E8E",
  },
  {
    baslik: "Poster Serisi — Fütürizm",
    kategori: "Grafik",
    aciklama:
      "80'ler fütürizm estetiğinden ilham alan 5 parçalık sınırlı baskı poster koleksiyonu.",
    bolumler: [
      {
        baslik: "Konsept",
        metin:
          "Retrowave estetiğini risografi baskı tekniğiyle buluşturan kapsüler bir koleksiyon.",
      },
      {
        baslik: "Teknik",
        metin:
          "Illustrator'da vektörel çizim, 2 renkli risografi baskı. 50×70 cm, 100 adetlik sınırlı seri.",
      },
    ],
    etiketler: ["Poster", "İllüstrasyon", "Risografi"],
    link: "", featured: false, renk: "#8E7AAD",
  },
];

async function main() {
  loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
    process.exit(1);
  }

  const sb = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const rows = SEED.map((p, i) => ({
    ...p,
    slug: slugify(p.baslik),
    kapak: "",
    kapak_video: "",
    galeri_1: "",
    galeri_1_video: "",
    galeri_2: "",
    galeri_2_video: "",
    galeri_3: "",
    galeri_3_video: "",
    galeri_4: "",
    galeri_4_video: "",
    galeri_5: "",
    galeri_5_video: "",
    galeri_6: "",
    galeri_6_video: "",
    galeri_7: "",
    galeri_7_video: "",
    galeri_8: "",
    galeri_8_video: "",
    galeri_9: "",
    galeri_9_video: "",
    galeri_10: "",
    galeri_10_video: "",
    sira: (i + 1) * 10,
  }));

  const { data, error } = await sb
    .from("projects")
    .upsert(rows, { onConflict: "slug" })
    .select("id, slug");

  if (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
  console.log(`Seeded ${data?.length ?? 0} projects.`);
}

main();
