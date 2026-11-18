import {
  resolveShowreelPosterFromVideo,
  resolveShowreelPosterUrl,
  resolveShowreelVideoUrl,
  type ShowreelLayout,
} from "@/lib/project-images";
import type { SiteSettings } from "@/types";

/** Hero web (16:9) — Cloudinary embed; player ayarları aynı kalır. */
const HOME_SHOWREEL_WEB_VIDEO =
  "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Kruv_Showreel_-_16x9_v2_v4xc70";

export type HomeShowreelSlot = {
  posterSrc: string;
  videoSrc: string | null;
};

function buildShowreelSlot(
  posterRaw: string,
  videoRaw: string,
  layout: ShowreelLayout,
  videoOptions?: { preserveAspect?: boolean },
): HomeShowreelSlot | null {
  const video = videoRaw.trim();
  const videoSrc = video
    ? resolveShowreelVideoUrl(video, layout, videoOptions) || null
    : null;
  if (!videoSrc) return null;

  const posterSrc =
    resolveShowreelPosterUrl(posterRaw.trim(), layout) ||
    resolveShowreelPosterFromVideo(video, layout) ||
    "";

  return { posterSrc, videoSrc };
}

function resolveMobileShowreelSlot(
  settings: SiteSettings,
  web: HomeShowreelSlot | null,
): HomeShowreelSlot | null {
  const mobilePosterRaw = (settings.homeVideoPosterMobile ?? "").trim();
  const mobileVideoRaw = (settings.homeVideoMobile ?? "").trim();
  const webPosterRaw = (settings.homeVideoPoster ?? "").trim();
  const webVideoRaw = (settings.homeVideo ?? "").trim();

  // homeVideoMobile — orijinal dikey video; zorla 9:16 crop yok
  if (mobileVideoRaw) {
    const mobileVideoSrc =
      resolveShowreelVideoUrl(mobileVideoRaw, "portrait", {
        preserveAspect: true,
      }) || null;
    if (mobileVideoSrc) {
      const posterSrc =
        resolveShowreelPosterUrl(mobilePosterRaw, "portrait") ||
        resolveShowreelPosterFromVideo(mobileVideoRaw, "portrait") ||
        (webPosterRaw
          ? resolveShowreelPosterUrl(webPosterRaw, "portrait")
          : "") ||
        resolveShowreelPosterFromVideo(webVideoRaw, "portrait") ||
        web?.posterSrc ||
        "";
      return { posterSrc, videoSrc: mobileVideoSrc };
    }
  }

  const dedicated = buildShowreelSlot(
    settings.homeVideoPosterMobile ?? "",
    settings.homeVideoMobile ?? "",
    "portrait",
    { preserveAspect: true },
  );
  if (dedicated?.videoSrc) return dedicated;

  if (!webVideoRaw) return null;

  const portraitWebVideo =
    resolveShowreelVideoUrl(webVideoRaw, "portrait") || null;
  const portraitPosterFallback =
    resolveShowreelPosterUrl(mobilePosterRaw, "portrait") ||
    (webPosterRaw ? resolveShowreelPosterUrl(webPosterRaw, "portrait") : "") ||
    resolveShowreelPosterFromVideo(webVideoRaw, "portrait") ||
    web?.posterSrc ||
    "";

  if (!portraitWebVideo || !portraitPosterFallback) return null;

  return { posterSrc: portraitPosterFallback, videoSrc: portraitWebVideo };
}

export function resolveHomeShowreelSlots(settings: SiteSettings): {
  web: HomeShowreelSlot | null;
  mobile: HomeShowreelSlot | null;
  webOnly: boolean;
} {
  const web = buildShowreelSlot(
    settings.homeVideoPoster ?? "",
    HOME_SHOWREEL_WEB_VIDEO,
    "landscape",
  );

  const mobile = resolveMobileShowreelSlot(
    {
      ...settings,
      // Mobil ayrı ayar yoksa web hero’nun yeni kaynağını kullanır
      homeVideo: HOME_SHOWREEL_WEB_VIDEO,
    },
    web,
  );

  return {
    web,
    mobile,
    webOnly: Boolean(web && !mobile),
  };
}
