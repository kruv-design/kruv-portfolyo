import type { Project } from "@/types";
import type { GaleriKey, GaleriVideoKey } from "@/lib/project-images";
import { mapProjectRow } from "@/lib/map-project-row";

/**
 * Demo projects used ONLY when:
 *   - Supabase is not configured yet (placeholder env), OR
 *   - DB query fails (network / RLS / missing table).
 *
 * Once real data exists in Supabase this file becomes inert — the fallback
 * branch is only taken when a query throws or env is a placeholder.
 *
 * 4 kategori × 5 proje = 20 demo proje.
 *   - Branding
 *   - Packaging
 *   - Social Media
 *   - Motion
 */

const now = new Date().toISOString();

/** Stable seeded image (picsum.photos) — aynı seed = aynı görsel. */
function img(seed: string, w = 1600, h = 900): string {
  return `https://picsum.photos/seed/kruv-${seed}/${w}/${h}`;
}

/** Demo dosyasında hâlâ gorsel/gorseller kullanılabilir — mapProjectRow dönüştürür. */
type DemoInput = Omit<
  Project,
  | "created_at"
  | "updated_at"
  | "kapak"
  | "kapak_video"
  | "title"
  | "category"
  | "description"
  | GaleriKey
  | GaleriVideoKey
> & {
  gorsel?: string;
  gorseller?: string[];
  kapak?: string | null;
  kapak_video?: string;
} & Partial<Record<GaleriKey | GaleriVideoKey, string>>;

function make(p: DemoInput): Project {
  const row = mapProjectRow({
    title: "",
    category: "",
    description: "",
    ...p,
  } as unknown as Record<string, unknown>);
  return { ...row, created_at: now, updated_at: now };
}

/* ─────────────────────────────  CANLI PORTFÖY ÇİFTİ (Marker → Roots) ── */

const portfolioMarkerRoots: Project[] = [
  make({
    id: "demo-marker",
    slug: "marker",
    baslik: "Marker",
    kategori: "branding, packaging",
    aciklama: "MARKER ambalaj ve marka kimliği.",
    gorsel: "https://picsum.photos/seed/kruv-marker-hero/1600/900",
    bolumler: [],
    etiketler: ["branding", "packaging"],
    link: "",
    featured: true,
    next_project_override: "rootsadventure-travel",
    renk: "#C8B8A8",
    sira: 1,
  }),
  make({
    id: "demo-roots-adventure",
    slug: "rootsadventure-travel",
    baslik: "Roots Adventure Travel",
    kategori: "branding",
    aciklama: "Roots Adventure Travel marka kimliği.",
    gorsel: "https://picsum.photos/seed/kruv-roots-hero/1600/900",
    bolumler: [],
    etiketler: ["brand identity", "travel"],
    link: "",
    featured: true,
    renk: "#7A9E7E",
    sira: 2,
  }),
];

/* ─────────────────────────────  BRANDING  ───────────────────────────── */

const branding: Project[] = [
  make({
    id: "demo-karamel",
    slug: "karamel-marka-kimligi",
    baslik: "Karamel Coffee — Marka Kimliği",
    kategori: "Branding",
    aciklama:
      "Küçük bir kahve markası için sıcak tonlar ve el yazısı tipografiyle hazırlanan tam kimlik sistemi.",
    gorsel:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1600&q=80",
    gorseller: [
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80",
    ],
    bolumler: [
      {
        baslik: "Sorun & Fırsat",
        metin:
          "Karamel, Karaköy'de açılmak üzere olan bağımsız bir kahve markasıydı. Kalabalık pazarda öne çıkmak için güçlü bir görsel kimliğe ihtiyaç vardı.",
      },
      {
        baslik: "Süreç",
        metin:
          "Moodboard aşamasında 3 farklı yön araştırıldı. Sıcak toprak tonları, el yazısı referanslı serif font ve minimal geometri öne çıktı.",
      },
      {
        baslik: "Sonuç",
        metin:
          "6 haftalık süreçte logo, renk paleti, tipografi sistemi, ambalaj ve 40 sayfalık marka rehberi teslim edildi.",
      },
    ],
    etiketler: ["Logo", "Tipografi", "Marka Rehberi"],
    link: "https://example.com/karamel",
    featured: true,
    renk: "#C8A882",
    sira: 10,
  }),
  make({
    id: "demo-meridyen",
    slug: "meridyen-mimarlik",
    baslik: "Meridyen Mimarlık — Kurumsal Kimlik",
    kategori: "Branding",
    aciklama:
      "Butik bir mimarlık ofisi için modernist grid ve ağır sans-serif üzerine kurulu sessiz bir kimlik.",
    gorsel: img("meridyen-hero"),
    gorseller: [img("meridyen-1", 900, 700), img("meridyen-2", 900, 700), img("meridyen-3", 900, 700)],
    bolumler: [
      {
        baslik: "Konum",
        metin:
          "Studio, ağırlıkla kamusal yapı ve kültür merkezi projeleri üretiyor. Kimliğin de aynı disiplinli, az-ama-öz tonu yansıtması istendi.",
      },
      {
        baslik: "Sistem",
        metin:
          "Dört kalınlıkta bir sans-serif, tek noktadan başlayan bir grid ve teknik çizim dilinde işaretlerden oluşan bir ikon ailesi kuruldu.",
      },
    ],
    etiketler: ["Logo", "Kurumsal Kimlik", "Tipografi"],
    link: "",
    featured: false,
    renk: "#6366F1",
    sira: 20,
  }),
  make({
    id: "demo-noria",
    slug: "noria-fitness",
    baslik: "Noria Fitness — Spor Markası",
    kategori: "Branding",
    aciklama:
      "Kadın odaklı bir fitness studio için enerjik, ritmik ve sıcak bir marka sistemi.",
    gorsel: img("noria-hero"),
    gorseller: [img("noria-1", 900, 700), img("noria-2", 900, 700), img("noria-3", 900, 700)],
    bolumler: [
      {
        baslik: "Ses Tonu",
        metin:
          "Topluluk hissi ön planda: 'yarış' değil 'birlikte'. Bu yüzden isim sisteminde emirli dil yerine davet eden bir üslup seçildi.",
      },
      {
        baslik: "İşaret",
        metin:
          "Logotype, kalp atışına referansla yukarı-aşağı hareket eden bir kontur üzerine kuruldu. Animasyonlu versiyonu dijital kanallarda kullanılıyor.",
      },
    ],
    etiketler: ["Logo", "Renk Paleti", "Kadın Odaklı"],
    link: "",
    featured: false,
    renk: "#818CF8",
    sira: 30,
  }),
  make({
    id: "demo-luna",
    slug: "luna-bakery",
    baslik: "Luna Bakery — Butik Fırın",
    kategori: "Branding",
    aciklama:
      "El yapımı ekmek ve hamur işi üreten bir mahalle fırını için romantik, gece temalı bir kimlik.",
    gorsel: img("luna-hero"),
    gorseller: [img("luna-1", 900, 700), img("luna-2", 900, 700)],
    bolumler: [
      {
        baslik: "Hikaye",
        metin:
          "Luna, adını gece üretilen ekmeklerden alıyor. Bu hikaye kimliğe; koyu lacivert gece göğü, altın sarısı buğday başakları ve dolunay işareti olarak taşındı.",
      },
    ],
    etiketler: ["Logo", "İllüstrasyon", "Fırın"],
    link: "",
    featured: false,
    renk: "#2B2A55",
    sira: 40,
  }),
  make({
    id: "demo-atlas",
    slug: "atlas-tech",
    baslik: "Atlas Tech — SaaS Marka Sistemi",
    kategori: "Branding",
    aciklama:
      "Lojistik operasyonları için bir SaaS ürünü — veri yoğun ama okunaklı, sakin bir sistem dili.",
    gorsel: img("atlas-hero"),
    gorseller: [img("atlas-1", 900, 700), img("atlas-2", 900, 700), img("atlas-3", 900, 700)],
    bolumler: [
      {
        baslik: "Ürün Dili",
        metin:
          "Ürün içinde yoğun tablo ve grafik var; o yüzden kimlik olabildiğince nötr ve 'görev odaklı' tutuldu. Tek bir elektrik mavisi aksent rol alıyor.",
      },
      {
        baslik: "Scale",
        metin:
          "Figma component kütüphanesi, tokenize edilmiş bir design system ve 12 farklı ürün arayüzü ekranı için izlenecek rehber teslim edildi.",
      },
    ],
    etiketler: ["Design System", "SaaS", "Logo"],
    link: "",
    featured: false,
    renk: "#1E40FF",
    sira: 50,
  }),
];

/* ─────────────────────────────  PACKAGING  ──────────────────────────── */

const packaging: Project[] = [
  make({
    id: "demo-terra-cay",
    slug: "terra-cay-ambalaj",
    baslik: "Terra Çay — Ambalaj Serisi",
    kategori: "Packaging",
    aciklama:
      "Tek-orijinli çay serisi için her menşei farklı bir doku ve renkle anlatan ambalaj sistemi.",
    gorsel: img("terra-hero"),
    gorseller: [img("terra-1", 900, 700), img("terra-2", 900, 700), img("terra-3", 900, 700)],
    bolumler: [
      {
        baslik: "Yaklaşım",
        metin:
          "6 farklı çay türü için ortak bir strüktür tutularak renk, desen ve hikâye üzerinden ayrışma sağlandı. Kutularda geri dönüştürülmüş kraft malzeme tercih edildi.",
      },
      {
        baslik: "Üretim",
        metin:
          "2 renkli flekso baskı + sıcak folyo. Yerel tedarikçilerle çalışıldı, teslim süresi 10 güne indirildi.",
      },
    ],
    etiketler: ["Ambalaj", "Çay", "Flekso Baskı"],
    link: "",
    featured: true,
    renk: "#6E8B3D",
    sira: 60,
  }),
  make({
    id: "demo-mavi-yosun",
    slug: "mavi-yosun-kozmetik",
    baslik: "Mavi Yosun — Sürdürülebilir Kozmetik",
    kategori: "Packaging",
    aciklama:
      "Deniz yosunundan üretilen cilt bakım serisi için 100% geri dönüşebilir cam ve kağıt ambalaj.",
    gorsel: img("maviyosun-hero"),
    gorseller: [img("maviyosun-1", 900, 700), img("maviyosun-2", 900, 700)],
    bolumler: [
      {
        baslik: "Malzeme",
        metin:
          "Plastik yerine amber cam, etiketler kompostlanabilir bambu-kağıtta. Kapaklar yenilenebilir mantar kompoziti.",
      },
    ],
    etiketler: ["Kozmetik", "Sürdürülebilir", "Etiket"],
    link: "",
    featured: false,
    renk: "#2F5D62",
    sira: 70,
  }),
  make({
    id: "demo-fume-sarap",
    slug: "fume-sarap",
    baslik: "Füme — Özel Seri Şarap Etiketi",
    kategori: "Packaging",
    aciklama:
      "Küçük üretim bir butik şaraphanenin 12 şişelik limited edition serisi için her şişede farklı illüstrasyon.",
    gorsel: img("fume-hero"),
    gorseller: [img("fume-1", 900, 700), img("fume-2", 900, 700), img("fume-3", 900, 700)],
    bolumler: [
      {
        baslik: "Konsept",
        metin:
          "Her etiketin illüstrasyonu, üretildiği bağın o yılki hasat hikâyesinden geliyor. 12 şişe bir araya geldiğinde kronolojik bir anlatı oluşturuyor.",
      },
      {
        baslik: "Baskı",
        metin:
          "Kabartmalı letterpress + altın folyo. Her şişe numaralandırılıp ıslak mühürle imzalandı.",
      },
    ],
    etiketler: ["Şarap", "Letterpress", "Limited Edition"],
    link: "",
    featured: false,
    renk: "#6B1F2B",
    sira: 80,
  }),
  make({
    id: "demo-zest",
    slug: "zest-icecek",
    baslik: "Zest — Fonksiyonel İçecek",
    kategori: "Packaging",
    aciklama:
      "Doğal bitki özleriyle yapılan 4 ürünlük fonksiyonel içecek serisi. Renkli, genç, raf hakimiyeti yüksek.",
    gorsel: img("zest-hero"),
    gorseller: [img("zest-1", 900, 700), img("zest-2", 900, 700)],
    bolumler: [
      {
        baslik: "Raf Stratejisi",
        metin:
          "Raftaki benzer ürünler genelde pastel ve minimal. Biz tam tersi — yüksek satüre renkler ve büyük tipografi kullanıldı.",
      },
    ],
    etiketler: ["İçecek", "Pet Ambalaj", "Raf Tasarımı"],
    link: "",
    featured: false,
    renk: "#F2C94C",
    sira: 90,
  }),
  make({
    id: "demo-kokler",
    slug: "kokler-cikolata",
    baslik: "Kökler — El Yapımı Çikolata",
    kategori: "Packaging",
    aciklama:
      "Tek-orijinli kakao çekirdeğiyle üretilen bean-to-bar çikolata serisi. 8 farklı bölgenin kartografik hikâyesi.",
    gorsel: img("kokler-hero"),
    gorseller: [img("kokler-1", 900, 700), img("kokler-2", 900, 700), img("kokler-3", 900, 700)],
    bolumler: [
      {
        baslik: "Harita",
        metin:
          "Her tablet çikolatanın ambalajı, kakaonun geldiği bölgenin abstre topografik haritası. İç kağıda çekirdeğin işlenme süreci mikro baskıyla yazıldı.",
      },
    ],
    etiketler: ["Çikolata", "Bean-to-Bar", "İllüstrasyon"],
    link: "",
    featured: false,
    renk: "#3A2318",
    sira: 100,
  }),
];

/* ────────────────────────────  SOCIAL MEDIA  ────────────────────────── */

const social: Project[] = [
  make({
    id: "demo-hafta-cafe",
    slug: "hafta-cafe-instagram",
    baslik: "Hafta Cafe — Instagram Kampanyası",
    kategori: "Social Media",
    aciklama:
      "Haftanın her günü için ayrı renk paleti ve illüstrasyonla kurgulanan 3 aylık Instagram içerik planı.",
    gorsel: img("hafta-hero"),
    gorseller: [img("hafta-1", 900, 900), img("hafta-2", 900, 900), img("hafta-3", 900, 900)],
    bolumler: [
      {
        baslik: "İçerik Takvimi",
        metin:
          "Haftada 5 post + 3 reels + 4 story şablonu; 12 hafta boyunca yinelenebilir modüler bir sistem.",
      },
      {
        baslik: "Sonuç",
        metin:
          "Takipçi sayısı 3 ayda %68 artış; kaydetme oranı kategori ortalamasının 4 katı.",
      },
    ],
    etiketler: ["Instagram", "İçerik Sistemi", "Reels"],
    link: "",
    featured: false,
    renk: "#FF8A5B",
    sira: 110,
  }),
  make({
    id: "demo-denim-co",
    slug: "denim-co-tiktok",
    baslik: "Denim Co. — TikTok Serisi",
    kategori: "Social Media",
    aciklama:
      "Haftalık 'nasıl kombinlenir' temalı 12 bölümlük TikTok video serisi — senaryo, styling ve görsel kimlik.",
    gorsel: img("denim-hero"),
    gorseller: [img("denim-1", 720, 1280), img("denim-2", 720, 1280)],
    bolumler: [
      {
        baslik: "Format",
        metin:
          "Her bölüm 15-22 saniye. Sabit kamera, hızlı kesim ve UI tipografi ile metin üstüne kurulan ritim.",
      },
    ],
    etiketler: ["TikTok", "Video Serisi", "Moda"],
    link: "",
    featured: false,
    renk: "#3C6CE4",
    sira: 120,
  }),
  make({
    id: "demo-yolculuk",
    slug: "yolculuk-otel-reels",
    baslik: "Yolculuk Otel — Reels Kampanyası",
    kategori: "Social Media",
    aciklama:
      "Ege kıyısındaki butik bir otel için 'sessizliğin sesi' temalı 10 bölümlük Reels serisi.",
    gorsel: img("yolculuk-hero"),
    gorseller: [img("yolculuk-1", 720, 1280), img("yolculuk-2", 720, 1280), img("yolculuk-3", 720, 1280)],
    bolumler: [
      {
        baslik: "Yönetim",
        metin:
          "Her bölüm tek bir duyuya odaklanıyor: rüzgâr, dalga, pişirme sesi, çan sesi. Görüntüler yavaş, kesimler uzun.",
      },
    ],
    etiketler: ["Reels", "Otel", "Ses Tasarımı"],
    link: "",
    featured: false,
    renk: "#A2B8C9",
    sira: 130,
  }),
  make({
    id: "demo-pop-fest",
    slug: "pop-music-fest",
    baslik: "Pop Music Festival — Sosyal Medya Kiti",
    kategori: "Social Media",
    aciklama:
      "Şehirlerarası 4 durakta gezen bir festival için her durakta renk ve tipografisi değişen esnek içerik sistemi.",
    gorsel: img("popfest-hero"),
    gorseller: [img("popfest-1", 900, 900), img("popfest-2", 900, 900), img("popfest-3", 900, 900), img("popfest-4", 900, 900)],
    bolumler: [
      {
        baslik: "Sistem",
        metin:
          "Tek bir master template; renk, grid yönü ve ikon seti parametrik olarak değişiyor. Her şehir için 80+ varyasyon 2 haftada üretildi.",
      },
      {
        baslik: "Sonuç",
        metin:
          "Kampanya boyunca 22M organik gösterim, 4 şehrin toplam sanatçı sayfaları 180K etkileşim aldı.",
      },
    ],
    etiketler: ["Festival", "Kampanya", "Template Sistemi"],
    link: "",
    featured: true,
    renk: "#FF3D7F",
    sira: 140,
  }),
  make({
    id: "demo-minik-ev",
    slug: "minik-ev-gida",
    baslik: "Minik Ev — Gıda İçerik Serisi",
    kategori: "Social Media",
    aciklama:
      "Ev yapımı erişte ve turşu üreten butik bir marka için haftada 3 post + 1 reels'lik sessiz içerik mutfağı.",
    gorsel: img("minikev-hero"),
    gorseller: [img("minikev-1", 900, 900), img("minikev-2", 900, 900)],
    bolumler: [
      {
        baslik: "Ton",
        metin:
          "Abartısız, doğal ışık, mutfak sesi ve el plan çekimleri. ASMR hissine yakın, sakin bir dijital mutfak.",
      },
    ],
    etiketler: ["Yemek", "ASMR", "Reels"],
    link: "",
    featured: false,
    renk: "#8B6F3A",
    sira: 150,
  }),
];

/* ──────────────────────────────  MOTION  ────────────────────────────── */

const motion: Project[] = [
  make({
    id: "demo-nebula",
    slug: "nebula-logo-motion",
    baslik: "Nebula — Logo Motion",
    kategori: "Motion",
    aciklama:
      "Bir fintech markası için 3 saniyelik brand reveal. Tek akıcı hareket, tek aksent rengi, loop'a uygun.",
    gorsel: img("nebula-hero"),
    gorseller: [img("nebula-1", 900, 700), img("nebula-2", 900, 700)],
    bolumler: [
      {
        baslik: "Hareket",
        metin:
          "Logonun çekirdek geometrisi, tek bir eğri boyunca açılarak sonlandırılıyor. Easing: spring, 0.92 damping.",
      },
    ],
    etiketler: ["Logo Motion", "Brand Reveal", "After Effects"],
    link: "",
    featured: false,
    renk: "#7A5CFF",
    sira: 160,
  }),
  make({
    id: "demo-horizon",
    slug: "horizon-tanitim",
    baslik: "Horizon Auto — Tanıtım Filmi",
    kategori: "Motion",
    aciklama:
      "Elektrikli araç markası için 60 saniyelik launch filmi — 3B render + çekimden komposit + tipografik anlatım.",
    gorsel: img("horizon-hero"),
    gorseller: [img("horizon-1", 1600, 900), img("horizon-2", 1600, 900), img("horizon-3", 1600, 900)],
    bolumler: [
      {
        baslik: "Konsept",
        metin:
          "'Ufkun kendisi ol' temasıyla çöl, göl yüzeyi ve şehir geçişleri arasında aracın sessiz gelişini anlatıyor.",
      },
      {
        baslik: "Pipeline",
        metin:
          "Blender ile araç render'ı, DaVinci ile renk, After Effects ile tipografi ve son kompozit.",
      },
    ],
    etiketler: ["Tanıtım Filmi", "3D", "Launch"],
    link: "",
    featured: false,
    renk: "#0F1E3A",
    sira: 170,
  }),
  make({
    id: "demo-vibe-ui",
    slug: "vibe-player-ui",
    baslik: "Vibe Player — Arayüz Animasyonları",
    kategori: "Motion",
    aciklama:
      "Bir müzik uygulamasının kritik 8 etkileşimi için mikro-interaction seti. Figma + Rive + SwiftUI.",
    gorsel: img("vibe-hero"),
    gorseller: [img("vibe-1", 900, 1600), img("vibe-2", 900, 1600), img("vibe-3", 900, 1600)],
    bolumler: [
      {
        baslik: "Yaklaşım",
        metin:
          "Her etkileşim aynı ease (cubic 0.22, 1, 0.36, 1) ve 240–420ms arası süre kullanıyor. Böylece uygulama tek bir ritimmiş gibi hissettiriyor.",
      },
    ],
    etiketler: ["UI Motion", "Rive", "Micro-interaction"],
    link: "",
    featured: false,
    renk: "#00D4A4",
    sira: 180,
  }),
  make({
    id: "demo-showreel-24",
    slug: "kruv-showreel-2024",
    baslik: "Kruv. Showreel 2024",
    kategori: "Motion",
    aciklama:
      "Yıl içinde yapılan motion, brand ve ürün projelerinden kesit sunan 52 saniyelik yıllık reel.",
    gorsel: img("showreel-hero"),
    gorseller: [img("showreel-1", 1600, 900), img("showreel-2", 1600, 900)],
    bolumler: [
      {
        baslik: "Ritim",
        metin:
          "Kurgu tek bir bas vuruşa kilitli; her 1/8 beatte bir kare değişiyor. Renk dünyası sadece 3 tonla sınırlandırıldı.",
      },
    ],
    etiketler: ["Showreel", "Kurgu", "Ses"],
    link: "",
    featured: true,
    renk: "#6366F1",
    sira: 190,
  }),
  make({
    id: "demo-altin-koza",
    slug: "altin-koza-opener",
    baslik: "Altın Koza Film — Festival Opener",
    kategori: "Motion",
    aciklama:
      "Bir kısa film festivalinin 15 saniyelik açılış jeneriği; arşiv görüntüleri + tipografik kolaj.",
    gorsel: img("koza-hero"),
    gorseller: [img("koza-1", 1600, 900), img("koza-2", 1600, 900)],
    bolumler: [
      {
        baslik: "Malzeme",
        metin:
          "Türkiye sinema tarihinden kamuya açık 12 klip; grain, flare ve film iğnelemesi tek elden uygulandı.",
      },
    ],
    etiketler: ["Festival", "Opener", "Arşiv"],
    link: "",
    featured: false,
    renk: "#D4AF37",
    sira: 200,
  }),
];

export const DEMO_PROJECTS: Project[] = [
  ...portfolioMarkerRoots,
  ...branding,
  ...packaging,
  ...social,
  ...motion,
];

/**
 * Backward compatibility: ilk demo proje (featured Karamel) — bazı önizleme
 * yerlerinde tek proje örneği gerekiyor.
 */
export const DEMO_PROJECT: Project = branding[0];

/**
 * True when no real Supabase project has been configured yet.
 * Used to decide whether falling back to demo content is safe.
 */
export function isPlaceholderEnv(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return (
    !url ||
    url.includes("placeholder") ||
    url === "https://xxxxxxxx.supabase.co"
  );
}
