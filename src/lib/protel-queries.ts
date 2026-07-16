import "server-only";
import { supabasePublic } from "@/lib/supabase/server";
import { isPlaceholderEnv } from "@/lib/demo-data";
import {
  mapProtelBrandRow,
  mapProtelSettingsRow,
} from "@/lib/map-protel-row";
import type { ProtelPitch, ProtelPitchSettings, ProtelBrand, ProtelAdminPitch } from "@/types";
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

export const DEFAULT_PROTEL_SETTINGS: ProtelPitchSettings = {
  heroTitle: "Ürününüzün Potansiyelini\nSahneye Çıkarın",
  heroIntro:
    "Karmaşık özellikleri etkileyici bir deneyime dönüştürüyoruz.\n\nÜrününüzün nasıl çalıştığını, neden vazgeçilmez olduğunu ve yarattığı farkı görsel bir şölene dönüştürmeye hazır mısınız?",
  proposalTitle: "Demo Projesi",
  proposalPrice: "",
  proposalVideoUrl: "",
  proposalVideoAspect: "16:9",
  processDuration: "2/3 HAFTA",
  sampleVideos: [],
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

    const settings = settingsRes.data
      ? mapProtelSettingsRow(settingsRes.data as Record<string, unknown>)
      : DEFAULT_PROTEL_SETTINGS;

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
