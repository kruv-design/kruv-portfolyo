import type {
  ProtelBrand,
  ProtelMetric,
  ProtelPitchSettings,
  ProtelProcessStep,
  ProtelSampleVideo,
  ProtelSocialAccount,
  ProtelVideoAspect,
} from "@/types";

const ASPECTS: ProtelVideoAspect[] = ["16:9", "9:16", "4:5", "1:1"];

function asAspect(v: unknown): ProtelVideoAspect {
  const s = String(v ?? "16:9");
  return ASPECTS.includes(s as ProtelVideoAspect) ? (s as ProtelVideoAspect) : "16:9";
}

function asMetrics(v: unknown): ProtelMetric[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const o = item as Record<string, unknown>;
      return {
        label: String(o.label ?? "").trim(),
        value: String(o.value ?? "").trim(),
      };
    })
    .filter((m): m is ProtelMetric => Boolean(m?.label));
}

function asSocial(v: unknown): ProtelSocialAccount[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const o = item as Record<string, unknown>;
      const platform = String(o.platform ?? "").trim();
      if (!platform || platform.toLowerCase() === "tiktok") return null;
      return {
        platform,
        handle: String(o.handle ?? "").trim(),
        url: String(o.url ?? "").trim(),
      };
    })
    .filter((s): s is ProtelSocialAccount => Boolean(s?.platform));
}

function asSampleVideos(v: unknown): ProtelSampleVideo[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const o = item as Record<string, unknown>;
      return {
        title: String(o.title ?? "").trim(),
        videoUrl: String(o.videoUrl ?? o.video_url ?? "").trim(),
        aspectRatio: asAspect(o.aspectRatio ?? o.aspect_ratio),
      };
    })
    .filter((s): s is ProtelSampleVideo => Boolean(s));
}

function asProcessSteps(v: unknown): ProtelProcessStep[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const o = item as Record<string, unknown>;
      return {
        title: String(o.title ?? "").trim(),
        description: String(o.description ?? "").trim(),
      };
    })
    .filter((s): s is ProtelProcessStep => Boolean(s?.title));
}

export function mapProtelSettingsRow(row: Record<string, unknown>): ProtelPitchSettings {
  return {
    heroTitle: String(row.hero_title ?? ""),
    heroIntro: String(row.hero_intro ?? ""),
    proposalTitle: String(row.proposal_title ?? ""),
    proposalVideoUrl: String(row.proposal_video_url ?? ""),
    proposalVideoAspect: asAspect(row.proposal_video_aspect),
    sampleVideos: asSampleVideos(row.sample_videos),
    processSteps: asProcessSteps(row.process_steps),
    updatedAt: String(row.updated_at ?? ""),
  };
}

export function mapProtelBrandRow(row: Record<string, unknown>): ProtelBrand {
  return {
    id: String(row.id ?? ""),
    slug: String(row.slug ?? ""),
    name: String(row.name ?? ""),
    sortOrder: Number(row.sort_order ?? 0),
    metrics: asMetrics(row.metrics),
    socialAccounts: asSocial(row.social_accounts),
    video1Title: String(row.video_1_title ?? ""),
    video1Url: String(row.video_1_url ?? ""),
    video1Aspect: asAspect(row.video_1_aspect),
    video2Title: String(row.video_2_title ?? ""),
    video2Url: String(row.video_2_url ?? ""),
    video2Aspect: asAspect(row.video_2_aspect),
    updatedAt: String(row.updated_at ?? ""),
  };
}

export function settingsInputToDbRow(input: Omit<ProtelPitchSettings, "updatedAt">) {
  return {
    hero_title: input.heroTitle,
    hero_intro: input.heroIntro,
    proposal_title: input.proposalTitle,
    proposal_video_url: input.proposalVideoUrl,
    proposal_video_aspect: input.proposalVideoAspect,
    sample_videos: input.sampleVideos.map((v) => ({
      title: v.title,
      videoUrl: v.videoUrl,
      aspectRatio: v.aspectRatio,
    })),
    process_steps: input.processSteps.map((s) => ({
      title: s.title,
      description: s.description,
    })),
  };
}

export function brandInputToDbRow(
  input: Omit<ProtelBrand, "updatedAt" | "slug" | "id"> & { slug?: string },
) {
  return {
    name: input.name,
    sort_order: input.sortOrder,
    metrics: input.metrics,
    social_accounts: input.socialAccounts.filter(
      (s) => s.platform.toLowerCase() !== "tiktok",
    ),
    video_1_title: input.video1Title,
    video_1_url: input.video1Url,
    video_1_aspect: input.video1Aspect,
    video_2_title: input.video2Title,
    video_2_url: input.video2Url,
    video_2_aspect: input.video2Aspect,
  };
}
