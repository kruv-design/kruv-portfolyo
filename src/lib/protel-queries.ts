import "server-only";
import { supabasePublic } from "@/lib/supabase/server";
import { isPlaceholderEnv } from "@/lib/demo-data";
import {
  mapProtelBrandRow,
  mapProtelSettingsRow,
} from "@/lib/map-protel-row";
import type { ProtelPitch, ProtelPitchSettings, ProtelBrand, ProtelAdminPitch, ProtelSampleVideo, ProtelSocialAccount, ProtelProcessStep } from "@/types";
import { resolveProtelPassword } from "@/lib/protel-auth";

export const DEFAULT_PROTEL_PROCESS_STEPS = [
  {
    title: "Brief & ürünü anlama",
    description: "İyi bir brief alma ve ürünü tam olarak anlama.",
  },
  {
    title: "Script + voice-over",
    description: "Senaryo ve seslendirme metni yazımı.",
  },
  {
    title: "Storyboard",
    description:
      "Her sahneyi, geçişi ve kullanıcı akışını önceden planlayarak üretim sürecini netleştiriyoruz.",
  },
  {
    title: "Animasyon sample",
    description:
      "Animasyonun görsel dili, ritmi ve hareket prensiplerini yansıtan örnek sahneyi hazırlayıp onayınıza sunuyoruz.",
  },
  {
    title: "Teslim",
    description:
      "Geri bildirimlerin ardından final animasyonu optimize edilmiş formatlarda teslim ediyoruz.",
  },
];

function normalizeProcessStep(step: ProtelProcessStep): ProtelProcessStep {
  const title = step.title.trim().toLocaleLowerCase("tr-TR");

  if (title.includes("storyboard")) {
    return {
      ...step,
      description:
        "Her sahneyi, geçişi ve kullanıcı akışını önceden planlayarak üretim sürecini netleştiriyoruz.",
    };
  }

  if (title.includes("animasyon sample") || title.includes("animation sample")) {
    return {
      ...step,
      description:
        "Animasyonun görsel dili, ritmi ve hareket prensiplerini yansıtan örnek sahneyi hazırlayıp onayınıza sunuyoruz.",
    };
  }

  if (title.includes("teslim")) {
    return {
      ...step,
      description:
        "Geri bildirimlerin ardından final animasyonu optimize edilmiş formatlarda teslim ediyoruz.",
    };
  }

  return step;
}

function normalizeProcessSteps(steps: ProtelProcessStep[]): ProtelProcessStep[] {
  const source = steps.length > 0 ? steps : DEFAULT_PROTEL_PROCESS_STEPS;
  return source.map(normalizeProcessStep);
}

export const DEFAULT_PROTEL_SAMPLE_VIDEOS: ProtelSampleVideo[] = [
  {
    title: "Rate Coach UI Ad",
    videoUrl:
      "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Rate_Coach_-_UI_Ad_-_9x16_vlpmqt",
    aspectRatio: "9:16",
  },
  {
    title: "Fiyat Parite Uyuşmazlığı",
    videoUrl:
      "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Fiyat_Parite_Uyus%CC%A7mazl%C4%B1g%CC%86%C4%B1_-_9x16_yaxbkt",
    aspectRatio: "9:16",
  },
  {
    title: "Karşında Olly",
    videoUrl:
      "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=karsinda_olly_-_1_rl9a6h",
    aspectRatio: "9:16",
  },
  {
    title: "Otelinizin Gerçek Potansiyeli",
    videoUrl:
      "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Otelinizin_Gerc%CC%A7ek_Potansiyeli_ukgccv",
    aspectRatio: "9:16",
  },
  {
    title: "Rate Shopper UI Ad",
    videoUrl:
      "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Rate_Shopper_-_UI_Ad_-_9x16_mjlrfv",
    aspectRatio: "9:16",
  },
  {
    title: "UI animasyon örneği",
    videoUrl:
      "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=tten-2_fnwkmj",
    aspectRatio: "16:9",
  },
  {
    title: "CHP Dijital Kampüs",
    videoUrl:
      "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=CHP_-_Dijital_Kampu%CC%88s_1_1_f3nbhu",
    aspectRatio: "16:9",
  },
  {
    title: "UI animasyon örneği",
    videoUrl:
      "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=tten_bj3iyd",
    aspectRatio: "16:9",
  },
  {
    title: "Trick Landing Page",
    videoUrl:
      "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Trick_Landing_Page_v2_zutvtv",
    aspectRatio: "16:9",
  },
  {
    title: "UI animasyon örneği",
    videoUrl:
      "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Otter_v4_annlwz",
    aspectRatio: "16:9",
  },
  {
    title: "BV Main",
    videoUrl:
      "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=BV_MAIN_onzybr",
    aspectRatio: "16:9",
  },
];

export const DEFAULT_PROTEL_HERO_EYEBROW =
  "Protel için örnek çalışmalar, üretim süreci ve teklif formu";

export const DEFAULT_PROTEL_PROPOSAL_NOTE =
  "İlk demo video, ürününüzü tanımamız ve çalışma biçimimizi deneyimlemeniz için tarafımızdan hazırlanır. Herhangi bir ücret talep etmiyoruz.";

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
    video1Title: "2025 Özet",
    video1Url:
      "https://res.cloudinary.com/di0qbhh46/video/upload/2025_O%CC%88zet_1_jirwsa",
    video1Aspect: "9:16",
    video2Title: "Rate Shopper",
    video2Url:
      "https://res.cloudinary.com/di0qbhh46/video/upload/TR_-_Rate_Shopper_-_UI_Ad_-_9x16_ryeth4",
    video2Aspect: "9:16",
    video3Title: "Airline Capacity",
    video3Url:
      "https://res.cloudinary.com/di0qbhh46/video/upload/AIRLINE_CAPACITY_1_xsmyx9",
    video3Aspect: "9:16",
    video4Title: "RC nedir",
    video4Url:
      "https://res.cloudinary.com/di0qbhh46/video/upload/rc_nedir_paylas%C4%B1ld%C4%B1_h3oetq",
    video4Aspect: "9:16",
    updatedAt: "",
  },
  {
    id: "",
    slug: "opera-hotel-bosphorus",
    name: "Opera Hotel Bosphorus",
    sortOrder: 1,
    metrics: [],
    socialAccounts: [
      {
        platform: "Instagram",
        handle: "@operahotelbosphorus",
        url: "https://www.instagram.com/operahotelbosphorus/",
      },
    ],
    video1Title: "I have a plan",
    video1Url:
      "https://res.cloudinary.com/di0qbhh46/video/upload/banyo_bybyvh.mp4",
    video1Aspect: "9:16",
    video2Title: "Trust the process",
    video2Url:
      "https://res.cloudinary.com/di0qbhh46/video/upload/pizza_etwcvu.mp4",
    video2Aspect: "9:16",
    video3Title: "Breakfast but make it Fabulous",
    video3Url:
      "https://res.cloudinary.com/di0qbhh46/video/upload/kahvalti_nvt3g3.mp4",
    video3Aspect: "9:16",
    video4Title: "Beyoğlu",
    video4Url:
      "https://res.cloudinary.com/di0qbhh46/video/upload/beyog%CC%86lu_ufmgff.mp4",
    video4Aspect: "9:16",
    updatedAt: "",
  },
  {
    id: "",
    slug: "ggpizza",
    name: "GG Pizza",
    sortOrder: 2,
    metrics: [],
    socialAccounts: [
      {
        platform: "Instagram",
        handle: "@ggpizzaa",
        url: "https://www.instagram.com/ggpizzaa/",
      },
    ],
    video1Title: "Şef",
    video1Url:
      "https://res.cloudinary.com/di0qbhh46/video/upload/GG_B5V6_z4kdx7.mp4",
    video1Aspect: "9:16",
    video2Title: "Domates sosu",
    video2Url:
      "https://res.cloudinary.com/di0qbhh46/video/upload/Bal%C4%B1k_editv6_krpyin.mp4",
    video2Aspect: "9:16",
    video3Title: "Pizza ve bira",
    video3Url:
      "https://res.cloudinary.com/di0qbhh46/video/upload/PI%CC%87ZZA_BI%CC%87RA_l4jbxi.mp4",
    video3Aspect: "9:16",
    video4Title: "Tatlı",
    video4Url:
      "https://res.cloudinary.com/di0qbhh46/video/upload/Sequence_01_1_zj0jey.mp4",
    video4Aspect: "9:16",
    updatedAt: "",
  },
  {
    id: "",
    slug: "jungleous",
    name: "Jungleous",
    sortOrder: 3,
    metrics: [],
    socialAccounts: [
      {
        platform: "Instagram",
        handle: "@jungleous",
        url: "https://www.instagram.com/jungleous/",
      },
    ],
    video1Title: "Otel",
    video1Url:
      "https://res.cloudinary.com/di0qbhh46/video/upload/Otel_ymhzl1",
    video1Aspect: "9:16",
    video2Title: "Bitki Bakımı",
    video2Url:
      "https://res.cloudinary.com/di0qbhh46/video/upload/Jungleous_Bitki_Bak%C4%B1m-_1_t56dj8",
    video2Aspect: "9:16",
    video3Title: "Anneler Günü",
    video3Url:
      "https://res.cloudinary.com/di0qbhh46/video/upload/Jungleous_Anneler_Gu%CC%88nu%CC%88_-_Ad_3_nbrz5h",
    video3Aspect: "9:16",
    video4Title: "Ofis Bitki Bakım",
    video4Url:
      "https://res.cloudinary.com/di0qbhh46/video/upload/Ofis_Bitki_Bak%C4%B1m_mi3jov",
    video4Aspect: "9:16",
    updatedAt: "",
  },
  {
    id: "",
    slug: "bulung-lojistik",
    name: "Bulung Lojistik",
    sortOrder: 4,
    metrics: [],
    socialAccounts: [
      {
        platform: "Instagram",
        handle: "@bulunglogistics",
        url: "https://www.instagram.com/bulunglogistics/",
      },
    ],
    video1Title: "Reels",
    video1Url:
      "https://res.cloudinary.com/di0qbhh46/video/upload/kruv-portfolio/social/bulung-lojistik/01-reels",
    video1Aspect: "9:16",
    video2Title: "4 mevsim",
    video2Url:
      "https://res.cloudinary.com/di0qbhh46/video/upload/kruv-portfolio/social/bulung-lojistik/02-4-mevsim",
    video2Aspect: "9:16",
    video3Title: "Soru cevap",
    video3Url:
      "https://res.cloudinary.com/di0qbhh46/video/upload/kruv-portfolio/social/bulung-lojistik/03-soru-cevap",
    video3Aspect: "9:16",
    video4Title: "Bulung Safety",
    video4Url:
      "https://res.cloudinary.com/di0qbhh46/video/upload/kruv-portfolio/social/bulung-lojistik/04-safety",
    video4Aspect: "9:16",
    updatedAt: "",
  },
  {
    id: "",
    slug: "the-scholar-school",
    name: "The Scholars School",
    sortOrder: 5,
    metrics: [],
    socialAccounts: [
      {
        platform: "Instagram",
        handle: "@the.scholarsschool",
        url: "https://www.instagram.com/the.scholarsschool/",
      },
    ],
    video1Title: "TSS v2",
    video1Url:
      "https://res.cloudinary.com/di0qbhh46/video/upload/tssv2_cptimb",
    video1Aspect: "9:16",
    video2Title: "W1 Thursday",
    video2Url:
      "https://res.cloudinary.com/di0qbhh46/video/upload/TSS-W1-THURSDAY_btanhk",
    video2Aspect: "9:16",
    video3Title: "W2 Thursday",
    video3Url:
      "https://res.cloudinary.com/di0qbhh46/video/upload/TSS-W2-THURSDAY_mnztlt",
    video3Aspect: "9:16",
    video4Title: "W6 Tuesday",
    video4Url:
      "https://res.cloudinary.com/di0qbhh46/video/upload/TSS-W6-TUESDAY_qsowjo",
    video4Aspect: "9:16",
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

  if (haystack.includes("chp") && haystack.includes("dijital")) {
    return { ...item, aspectRatio: "16:9" };
  }

  if (haystack.includes("9x16")) {
    return { ...item, aspectRatio: "9:16" };
  }

  return item;
}

const SAMPLE_VIDEO_SORT_KEYS = [
  "rate_coach",
  "fiyat_parite",
  "karsinda_olly",
  "otelinizin",
  "rate_shopper",
  "tten-2",
  "chp_-_dijital",
  "tten_bj3iyd",
  "trick_landing",
  "otter_v4",
  "bv_main",
] as const;

function sampleVideoHaystack(item: ProtelSampleVideo): string {
  try {
    return decodeURIComponent(`${item.title} ${item.videoUrl}`).toLowerCase();
  } catch {
    return `${item.title} ${item.videoUrl}`.toLowerCase();
  }
}

function sampleVideoSortRank(item: ProtelSampleVideo): number {
  const haystack = sampleVideoHaystack(item);
  const index = SAMPLE_VIDEO_SORT_KEYS.findIndex((key) => haystack.includes(key));
  return index === -1 ? SAMPLE_VIDEO_SORT_KEYS.length : index;
}

function normalizeSampleVideos(items: ProtelSampleVideo[]): ProtelSampleVideo[] {
  return items
    .map(normalizeSampleVideo)
    .sort((a, b) => sampleVideoSortRank(a) - sampleVideoSortRank(b));
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

  if (brand.slug === "pricing-coach") {
    const title1 = next.video1Title.trim().toLowerCase();
    if (title1 === "butik oteller" || title1 === "butik otel") {
      next = { ...next, video1Title: fallback.video1Title };
    }
  }

  const forceVideoGrid = new Set([
    "ggpizza",
    "opera-hotel-bosphorus",
    "bulung-lojistik",
    "the-scholar-school",
    "pricing-coach",
    "jungleous",
  ]);

  if (forceVideoGrid.has(brand.slug)) {
    return {
      ...next,
      video1Title: fallback.video1Title,
      video1Url: fallback.video1Url,
      video1Aspect: fallback.video1Aspect,
      video2Title: fallback.video2Title,
      video2Url: fallback.video2Url,
      video2Aspect: fallback.video2Aspect,
      video3Title: fallback.video3Title,
      video3Url: fallback.video3Url,
      video3Aspect: fallback.video3Aspect,
      video4Title: fallback.video4Title,
      video4Url: fallback.video4Url,
      video4Aspect: fallback.video4Aspect,
    };
  }

  return next;
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
    video3Title: brand.video3Title.trim() || fallback.video3Title,
    video3Url: brand.video3Url.trim() || fallback.video3Url,
    video3Aspect: brand.video3Aspect || fallback.video3Aspect,
    video4Title: brand.video4Title.trim() || fallback.video4Title,
    video4Url: brand.video4Url.trim() || fallback.video4Url,
    video4Aspect: brand.video4Aspect || fallback.video4Aspect,
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
      processSteps: normalizeProcessSteps(settingsRow.processSteps),
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
