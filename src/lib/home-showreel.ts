import {
  resolveShowreelPosterUrl,
  resolveShowreelVideoUrl,
  type ShowreelLayout,
} from "@/lib/project-images";
import type { SiteSettings } from "@/types";

export type HomeShowreelSlot = {
  posterSrc: string;
  videoSrc: string | null;
};

function buildShowreelSlot(
  posterRaw: string,
  videoRaw: string,
  layout: ShowreelLayout,
): HomeShowreelSlot | null {
  const posterSrc = resolveShowreelPosterUrl(posterRaw.trim(), layout);
  if (!posterSrc) return null;
  const video = videoRaw.trim();
  const videoSrc = video
    ? resolveShowreelVideoUrl(video, layout) || null
    : null;
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

  const mobilePosterSrc = mobilePosterRaw
    ? resolveShowreelPosterUrl(mobilePosterRaw, "portrait")
    : "";
  const portraitPosterFallback =
    mobilePosterSrc ||
    (webPosterRaw ? resolveShowreelPosterUrl(webPosterRaw, "portrait") : "") ||
    web?.posterSrc ||
    "";

  const mobileVideoSrc = mobileVideoRaw
    ? resolveShowreelVideoUrl(mobileVideoRaw, "portrait") || null
    : null;
  if (mobileVideoSrc && portraitPosterFallback) {
    return { posterSrc: portraitPosterFallback, videoSrc: mobileVideoSrc };
  }

  const dedicated = buildShowreelSlot(
    settings.homeVideoPosterMobile ?? "",
    settings.homeVideoMobile ?? "",
    "portrait",
  );
  if (dedicated?.videoSrc) return dedicated;

  if (!webVideoRaw) return dedicated;

  const portraitWebVideo =
    resolveShowreelVideoUrl(webVideoRaw, "portrait") || null;
  if (!portraitWebVideo || !portraitPosterFallback) return dedicated;

  return { posterSrc: portraitPosterFallback, videoSrc: portraitWebVideo };
}

export function resolveHomeShowreelSlots(settings: SiteSettings): {
  web: HomeShowreelSlot | null;
  mobile: HomeShowreelSlot | null;
  webOnly: boolean;
} {
  const web = buildShowreelSlot(
    settings.homeVideoPoster ?? "",
    settings.homeVideo ?? "",
    "landscape",
  );

  const mobile = resolveMobileShowreelSlot(settings, web);

  return {
    web,
    mobile,
    webOnly: Boolean(web && !mobile),
  };
}
