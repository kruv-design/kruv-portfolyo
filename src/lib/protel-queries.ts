import "server-only";
import { supabasePublic } from "@/lib/supabase/server";
import { isPlaceholderEnv } from "@/lib/demo-data";
import {
  mapProtelBrandRow,
  mapProtelSettingsRow,
} from "@/lib/map-protel-row";
import type { ProtelPitch, ProtelPitchSettings, ProtelBrand } from "@/types";

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
    description: "Storyboard oluşturulması.",
  },
  {
    title: "Animasyon sample",
    description: "Örnek animasyon üretimi ve onay.",
  },
  {
    title: "Teslim",
    description: "Final animasyon teslimi.",
  },
];

export const DEFAULT_PROTEL_SETTINGS: ProtelPitchSettings = {
  heroTitle: "Protel için",
  heroIntro:
    "Ürününüzü anlatan, kullanıcıyı yönlendiren UI animasyon videoları üretiyoruz.",
  proposalTitle: "Ürün UI animasyon video",
  proposalVideoUrl: "",
  proposalVideoAspect: "16:9",
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
