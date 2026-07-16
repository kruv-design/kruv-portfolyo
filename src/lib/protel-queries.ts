import "server-only";
import { supabasePublic } from "@/lib/supabase/server";
import { isPlaceholderEnv } from "@/lib/demo-data";
import {
  mapProtelBrandRow,
  mapProtelSettingsRow,
} from "@/lib/map-protel-row";
import type { ProtelPitch, ProtelPitchSettings, ProtelBrand, ProtelAdminPitch, ProtelSampleVideo } from "@/types";
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
  {
    title: "Otelinizin Gerçek Potansiyeli",
    videoUrl:
      "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Otelinizin_Gerc%CC%A7ek_Potansiyeli_ukgccv",
    aspectRatio: "9:16",
  },
];

export const DEFAULT_PROTEL_SETTINGS: ProtelPitchSettings = {
  heroTitle: "Ürününüzün Potansiyelini\nSahneye Çıkarın",
  heroIntro:
    "Karmaşık özellikleri etkileyici bir deneyime dönüştürüyoruz.\n\nÜrününüzün nasıl çalıştığını, neden vazgeçilmez olduğunu ve yarattığı farkı görsel bir şölene dönüştürmeye hazır mısınız?",
  proposalTitle: "Demo Projesi",
  proposalPrice: "",
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
    slug: "ggpizza",
    name: "GG Pizza",
    sortOrder: 1,
    metrics: [],
    socialAccounts: [],
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
    slug: "jungleous",
    name: "Jungleous",
    sortOrder: 2,
    metrics: [],
    socialAccounts: [],
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
    socialAccounts: [],
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
    name: "The Scholar School",
    sortOrder: 4,
    metrics: [],
    socialAccounts: [],
    video1Title: "",
    video1Url: "",
    video1Aspect: "16:9",
    video2Title: "",
    video2Url: "",
    video2Aspect: "16:9",
    updatedAt: "",
  },
];

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

    const settings: ProtelPitchSettings = {
      ...settingsRow,
      sampleVideos:
        settingsRow.sampleVideos.length > 0
          ? settingsRow.sampleVideos
          : DEFAULT_PROTEL_SAMPLE_VIDEOS,
    };

    const brands =
      brandsRes.data && brandsRes.data.length > 0
        ? brandsRes.data.map((row) =>
            mapProtelBrandRow(row as Record<string, unknown>),
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
