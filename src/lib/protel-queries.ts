import "server-only";
import { supabasePublic } from "@/lib/supabase/server";
import { isPlaceholderEnv } from "@/lib/demo-data";
import {
  mapProtelBrandRow,
  mapProtelSettingsRow,
} from "@/lib/map-protel-row";
import type { ProtelPitch, ProtelPitchSettings, ProtelBrand, ProtelAdminPitch, ProtelSampleVideo, ProtelSocialAccount } from "@/types";
import { resolveProtelPassword } from "@/lib/protel-auth";

export const DEFAULT_PROTEL_PROCESS_STEPS = [
  {
    title: "Tanışma & Analiz",
    description:
      "Toplantı ile markanızı ve ürününüzü detaylıca öğrenip analiz ediyoruz.",
  },
  {
    title: "Üretim",
    description:
      "Videonun temellerini atıyoruz. Görsel kurguyu, ekrandaki yazıları ve seslendirme metinlerini hazırlayıp onayınıza sunuyoruz.",
  },
  {
    title: "Prodüksiyon & Seslendirme",
    description:
      "Onayınızın ardından animasyonları hazırlayıp profesyonel seslendirme (voice-over) ile birleştiriyoruz.",
  },
  {
    title: "Teslim",
    description:
      "Final kontrollerin ardından videonuzu yayına hazır şekilde teslim ediyoruz.",
  },
];

export const DEFAULT_PROTEL_SAMPLE_VIDEOS: ProtelSampleVideo[] = [
  {
    title: "Otelinizin Gerçek Potansiyeli",
    videoUrl:
      "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Otelinizin_Gerc%CC%A7ek_Potansiyeli_ukgccv",
    aspectRatio: "9:16",
  },
  {
    title: "Fiyat Parite Uyuşmazlığı",
    videoUrl:
      "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Fiyat_Parite_Uyus%CC%A7mazl%C4%B1g%CC%86%C4%B1_-_9x16_yaxbkt",
    aspectRatio: "9:16",
  },
  {
    title: "UI animasyon örneği",
    videoUrl:
      "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=tten-2_fnwkmj",
    aspectRatio: "16:9",
  },
  {
    title: "UI animasyon örneği",
    videoUrl:
      "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=tten_bj3iyd",
    aspectRatio: "16:9",
  },
  {
    title: "UI animasyon örneği",
    videoUrl:
      "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Otter_v4_annlwz",
    aspectRatio: "16:9",
  },
];

export const DEFAULT_PROTEL_HERO_EYEBROW =
  "Protel için örnek çalışmalar, üretim süreci ve teklif formu";

export const DEFAULT_PROTEL_SETTINGS: ProtelPitchSettings = {
  heroEyebrow: DEFAULT_PROTEL_HERO_EYEBROW,
  heroTitle: "Ürününüzün Potansiyelini\nSahneye Çıkarın",
  heroIntro:
    "Karmaşıklığı akıcı deneyimlere dönüştürüyoruz.\n\nÜrününüzün en gelişmiş özelliklerini; anlaşılır, etkileyici ve akılda kalıcı animasyonlarla görünür kılıyor, kullanıcıların değeri ilk saniyede hissetmesini sağlıyoruz.",
  proposalTitle: "Demo",
  proposalPrice: "0.000 ₺",
  proposalVideoUrl: "",
  proposalVideoAspect: "16:9",
  processDuration: "2/3 HAFTA",
  sampleVideos: DEFAULT_PROTEL_SAMPLE_VIDEOS,
  processSteps: DEFAULT_PROTEL_PROCESS_STEPS,
  updatedAt: "",
};

export const DEFAULT_PROTEL_BRANDS: ProtelBrand[] = [
  {
    id: "",
    slug: "pricing-coach",
    name: "Pricing Coach",
    sortOrder: 0,
    metrics: [],
    socialAccounts: [
      {
        platform: "Instagram",
        handle: "@pricing_coach",
        url: "https://www.instagram.com/pricing_coach/",
      },
    ],
    video1Title: "Pricing Coach Reel",
    video1Url:
      "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=09-03_pc_reel_dto7xl",
    video1Aspect: "9:16",
    video2Title: "İnsanların elinden işini mi alıyor?",
    video2Url:
      "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=insanlar%C4%B1n_elinden_isini_mi_aliyor-_en_pt6cl9",
    video2Aspect: "9:16",
    updatedAt: "",
  },
  {
    id: "",
    slug: "ggpizza",
    name: "GG Pizza",
    sortOrder: 1,
    metrics: [],
    socialAccounts: [
      {
        platform: "Instagram",
        handle: "@ggpizzaa",
        url: "https://www.instagram.com/ggpizzaa/",
      },
    ],
    video1Title: "GG Pizza",
    video1Url:
      "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=GG_6_rdirzm",
    video1Aspect: "9:16",
    video2Title: "Food is Art",
    video2Url:
      "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Food_is_art_yx3vep",
    video2Aspect: "9:16",
    updatedAt: "",
  },
  {
    id: "",
    slug: "jungleous",
    name: "Jungleous",
    sortOrder: 2,
    metrics: [],
    socialAccounts: [
      {
        platform: "Instagram",
        handle: "@jungleous",
        url: "https://www.instagram.com/jungleous/",
      },
    ],
    video1Title: "",
    video1Url: "",
    video1Aspect: "16:9",
    video2Title: "",
    video2Url: "",
    video2Aspect: "16:9",
    updatedAt: "",
  },
  {
    id: "",
    slug: "bulung-lojistik",
    name: "Bulung Lojistik",
    sortOrder: 3,
    metrics: [],
    socialAccounts: [
      {
        platform: "Instagram",
        handle: "@bulunglogistics",
        url: "https://www.instagram.com/bulunglogistics/",
      },
    ],
    video1Title: "",
    video1Url: "",
    video1Aspect: "16:9",
    video2Title: "",
    video2Url: "",
    video2Aspect: "16:9",
    updatedAt: "",
  },
  {
    id: "",
    slug: "the-scholar-school",
    name: "The Scholars School",
    sortOrder: 4,
    metrics: [],
    socialAccounts: [
      {
        platform: "Instagram",
        handle: "@the.scholarsschool",
        url: "https://www.instagram.com/the.scholarsschool/",
      },
    ],
    video1Title: "The Scholars School",
    video1Url:
      "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=TSS-W1-THURSDAY_ryll1v",
    video1Aspect: "9:16",
    video2Title: "The Scholars School",
    video2Url:
      "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=TSS-W2-THURSDAY_jg6m09",
    video2Aspect: "9:16",
    updatedAt: "",
  },
];

function normalizeProposalTitle(title: string) {
  const t = title.trim();
  if (
    !t ||
    t === "Ürün UI animasyon video" ||
    t === "Demo Projesi"
  ) {
    return "Demo";
  }
  return t;
}

function normalizeSampleVideo(item: ProtelSampleVideo): ProtelSampleVideo {
  const haystack = (() => {
    try {
      return decodeURIComponent(`${item.title} ${item.videoUrl}`).toLowerCase();
    } catch {
      return `${item.title} ${item.videoUrl}`.toLowerCase();
    }
  })();

  if (haystack.includes("otelinizin") || haystack.includes("fiyat_parite")) {
    return { ...item, aspectRatio: "9:16" };
  }

  if (haystack.includes("tten-2")) {
    return { ...item, aspectRatio: "16:9" };
  }

  if (haystack.includes("9x16")) {
    return { ...item, aspectRatio: "9:16" };
  }

  return item;
}

function normalizeSampleVideos(items: ProtelSampleVideo[]): ProtelSampleVideo[] {
  return items.map(normalizeSampleVideo);
}

function normalizeHeroEyebrow(eyebrow: string): string {
  const trimmed = eyebrow.trim();
  if (!trimmed) {
    return DEFAULT_PROTEL_HERO_EYEBROW;
  }

  const normalized = trimmed.toLocaleLowerCase("tr-TR");
  if (
    normalized === "ui animasyon videoları" ||
    normalized === "ui animasyon videolari" ||
    normalized.startsWith("ui animasyon")
  ) {
    return DEFAULT_PROTEL_HERO_EYEBROW;
  }

  return trimmed;
}

function normalizeHeroSettings(
  settings: ProtelPitchSettings,
): ProtelPitchSettings {
  const title = settings.heroTitle.trim();
  const intro = settings.heroIntro.trim();

  const legacyTitle =
    !title ||
    title === "Protel için" ||
    title === "Protel icin";

  const legacyIntro =
    !intro ||
    intro.includes("Karmaşık özellikleri etkileyici bir deneyime") ||
    intro.includes("Ürününüzün nasıl çalıştığını, neden vazgeçilmez") ||
    intro.includes("Ürününüzü anlatan, kullanıcıyı yönlendiren");

  return {
    ...settings,
    heroEyebrow: normalizeHeroEyebrow(settings.heroEyebrow),
    heroTitle: legacyTitle ? DEFAULT_PROTEL_SETTINGS.heroTitle : settings.heroTitle,
    heroIntro: legacyIntro ? DEFAULT_PROTEL_SETTINGS.heroIntro : settings.heroIntro,
  };
}

function validSocialAccounts(accounts: ProtelSocialAccount[]): ProtelSocialAccount[] {
  return accounts.filter((account) => account.url.trim());
}

function normalizeBrand(brand: ProtelBrand): ProtelBrand {
  const fallback = DEFAULT_PROTEL_BRANDS.find((item) => item.slug === brand.slug);
  if (!fallback) return brand;

  let next: ProtelBrand = {
    ...brand,
    name: brand.name.trim() === fallback.name.trim() ? brand.name : fallback.name,
  };

  const socialAccounts = validSocialAccounts(next.socialAccounts);
  if (socialAccounts.length === 0 && fallback.socialAccounts.length > 0) {
    next = { ...next, socialAccounts: fallback.socialAccounts };
  } else if (socialAccounts.length > 0) {
    next = { ...next, socialAccounts };
  }

  if (brand.slug !== "the-scholar-school") {
    return next;
  }

  const video1Haystack = (() => {
    try {
      return decodeURIComponent(brand.video1Url).toLowerCase();
    } catch {
      return brand.video1Url.toLowerCase();
    }
  })();

  const hasWrongFirstVideo =
    video1Haystack.includes("insanlar") ||
    video1Haystack.includes("09-03_pc") ||
    video1Haystack.includes("pricing_coach");

  if (!hasWrongFirstVideo) {
    return next;
  }

  return {
    ...next,
    name: fallback.name,
    video1Title: fallback.video1Title,
    video1Url: fallback.video1Url,
    video1Aspect: fallback.video1Aspect,
  };
}

function mergeBrandDefaults(brand: ProtelBrand): ProtelBrand {
  const fallback = DEFAULT_PROTEL_BRANDS.find((item) => item.slug === brand.slug);
  if (!fallback) return brand;

  const merged: ProtelBrand = {
    ...brand,
    socialAccounts: validSocialAccounts(brand.socialAccounts).length > 0
      ? validSocialAccounts(brand.socialAccounts)
      : fallback.socialAccounts,
    video1Title: brand.video1Title.trim() || fallback.video1Title,
    video1Url: brand.video1Url.trim() || fallback.video1Url,
    video1Aspect: brand.video1Aspect || fallback.video1Aspect,
    video2Title: brand.video2Title.trim() || fallback.video2Title,
    video2Url: brand.video2Url.trim() || fallback.video2Url,
    video2Aspect: brand.video2Aspect || fallback.video2Aspect,
  };

  return normalizeBrand(merged);
}

export async function getProtelPitch(): Promise<ProtelPitch> {
  if (isPlaceholderEnv()) {
    return {
      settings: DEFAULT_PROTEL_SETTINGS,
      brands: DEFAULT_PROTEL_BRANDS,
    };
  }

  try {
    const sb = supabasePublic();
    const [settingsRes, brandsRes] = await Promise.all([
      sb.from("protel_pitch_settings").select("*").eq("id", 1).maybeSingle(),
      sb
        .from("protel_brands")
        .select("*")
        .order("sort_order", { ascending: true }),
    ]);

    if (settingsRes.error) throw settingsRes.error;
    if (brandsRes.error) throw brandsRes.error;

    const settingsRow = settingsRes.data
      ? mapProtelSettingsRow(settingsRes.data as Record<string, unknown>)
      : DEFAULT_PROTEL_SETTINGS;

    const settings: ProtelPitchSettings = normalizeHeroSettings({
      ...settingsRow,
      sampleVideos: normalizeSampleVideos(
        settingsRow.sampleVideos.length > 0
          ? settingsRow.sampleVideos
          : DEFAULT_PROTEL_SAMPLE_VIDEOS,
      ),
      proposalTitle: normalizeProposalTitle(settingsRow.proposalTitle),
      proposalPrice: settingsRow.proposalPrice.trim() || "0.000 ₺",
    });

    const brands =
      brandsRes.data && brandsRes.data.length > 0
        ? brandsRes.data.map((row) =>
            mergeBrandDefaults(
              mapProtelBrandRow(row as Record<string, unknown>),
            ),
          )
        : DEFAULT_PROTEL_BRANDS;

    return { settings, brands };
  } catch {
    return {
      settings: DEFAULT_PROTEL_SETTINGS,
      brands: DEFAULT_PROTEL_BRANDS,
    };
  }
}

export async function getProtelAdminPitch(): Promise<ProtelAdminPitch> {
  const pitch = await getProtelPitch();
  const pagePassword = await resolveProtelPassword();
  return { ...pitch, pagePassword: pagePassword || "protelkruv" };
}
