import {
  resolveShowreelPosterFromVideo,
  resolveShowreelPosterUrl,
  resolveShowreelVideoUrl,
  type ShowreelLayout,
} from "@/lib/project-images";
import type { SiteSettings } from "@/types";

/** Hero showreel (16:9) — web + mobil aynı kaynak; player ayarları aynı kalır. */
const HOME_SHOWREEL_VIDEO =
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

export function resolveHomeShowreelSlots(settings: SiteSettings): {
  web: HomeShowreelSlot | null;
  mobile: HomeShowreelSlot | null;
  webOnly: boolean;
} {
  const web = buildShowreelSlot(
    settings.homeVideoPoster ?? "",
    HOME_SHOWREEL_VIDEO,
    "landscape",
  );

  return {
    web,
    mobile: null,
    webOnly: Boolean(web),
  };
}
