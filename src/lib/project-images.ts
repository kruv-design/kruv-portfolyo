import type { Project } from "@/types";

function cloudName(): string {
  return String(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "").trim();
}

const PROJECT_VIDEO_TRANSFORMS = "q_auto,f_auto:video,w_1920,c_limit";

function showreelVideoTransforms(
  layout: ShowreelLayout,
  options?: { preserveAspect?: boolean },
): string {
  const width = layout === "landscape" ? "w_1920" : "w_720";
  if (options?.preserveAspect) {
    return `q_auto,f_mp4,${width},c_limit`;
  }
  const crop = showreelAspectCrop(layout);
  return `q_auto,f_mp4,${crop},${width}`;
}

/**
 * Supabase / admin: tam https URL veya Cloudinary public_id (örn. kruv-portfolio/abc).
 * Public_id tek başına tarayıcıda görüntülenemez — delivery URL üretilir.
 */
export function resolveProjectImageUrl(raw: string): string {
  const s = raw.trim().replace(/\s+/g, "");
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  const cloud = cloudName();
  if (!cloud) return s;
  const id = s
    .replace(/^\/+/, "")
    .replace(/\.(jpe?g|png|webp|gif|avif|heic)$/i, "");
  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto/${id}`;
}

/** Video: https URL veya Cloudinary video public_id */
export function resolveProjectVideoUrl(raw: string): string {
  const s = raw.trim().replace(/\s+/g, "");
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) {
    const embed = cloudinaryEmbedPlayerParams(s);
    if (embed) {
      return buildCloudinaryVideoUrl(
        embed.publicId,
        PROJECT_VIDEO_TRANSFORMS,
        embed.cloud,
      );
    }
    if (s.includes("/image/upload/")) {
      return s.replace(
        "/image/upload/",
        `/video/upload/${PROJECT_VIDEO_TRANSFORMS}/`,
      );
    }
    return s;
  }
  return buildCloudinaryVideoUrl(s, PROJECT_VIDEO_TRANSFORMS);
}

/** Görsel alanına yapıştırılmış video / embed URL (Görsel 1). */
export function isVideoMediaRaw(raw: string): boolean {
  const s = raw.trim();
  if (!s) return false;
  if (cloudinaryEmbedPlayerParams(s)) return true;
  if (/\/video\/upload\//i.test(s)) return true;
  if (/\.(mp4|webm|mov)(\?|#|$)/i.test(s)) return true;
  return false;
}

function resolveGallerySlotMedia(
  posterRaw: string,
  videoRaw: string,
  allowVideoInPosterField: boolean,
): { posterSrc: string; videoSrc: string | null } {
  const dedicatedVideo = videoRaw.trim();
  if (dedicatedVideo) {
    return {
      posterSrc: resolveProjectImageUrl(posterRaw),
      videoSrc: resolveProjectVideoUrl(dedicatedVideo) || null,
    };
  }
  if (allowVideoInPosterField && isVideoMediaRaw(posterRaw)) {
    return {
      posterSrc: "",
      videoSrc: resolveProjectVideoUrl(posterRaw) || null,
    };
  }
  return {
    posterSrc: resolveProjectImageUrl(posterRaw),
    videoSrc: null,
  };
}

export type ShowreelLayout = "landscape" | "portrait";

function showreelAspectCrop(layout: ShowreelLayout): string {
  return layout === "landscape" ? "c_fill,ar_16:9" : "c_fill,ar_9:16";
}

function showreelAspectToken(layout: ShowreelLayout): string {
  return layout === "landscape" ? "ar_16:9" : "ar_9:16";
}

function urlHasShowreelAspect(url: string, layout: ShowreelLayout): boolean {
  return url.includes(showreelAspectToken(layout));
}

function showreelPosterTransforms(layout: ShowreelLayout): string {
  const width = layout === "landscape" ? "w_1280" : "w_720";
  return `${showreelAspectCrop(layout)},${width},f_auto,q_auto:good`;
}

function stripCloudinaryExtension(id: string): string {
  return id.replace(/\.(mp4|webm|mov|jpe?g|png|webp|gif|avif|heic)$/i, "");
}

/** Cloudinary delivery URL → public_id (transform/version segmentleri atlanır). */
function cloudinaryPublicIdFromUrl(url: string, resource: "video" | "image"): string | null {
  const marker = `/${resource}/upload/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;

  const rest = url.slice(idx + marker.length).split("?")[0] ?? "";
  const segments = rest.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  if (/^v\d+$/.test(segments[0] ?? "")) {
    segments.shift();
  }

  while (segments.length > 1 && /^[a-z0-9_,.-]+$/i.test(segments[0] ?? "") && segments[0]!.includes("_")) {
    segments.shift();
  }

  const joined = segments.join("/");
  return stripCloudinaryExtension(joined) || null;
}

function buildCloudinaryVideoUrl(
  publicId: string,
  transforms: string,
  cloudOverride?: string,
): string {
  const cloud = (cloudOverride ?? cloudName()).trim();
  if (!cloud) return publicId;
  const id = stripCloudinaryExtension(publicId.replace(/^\/+/, ""));
  return `https://res.cloudinary.com/${cloud}/video/upload/${transforms}/${id}`;
}

/** player.cloudinary.com/embed — HTML5 video src olamaz; public_id çıkarılır. */
function cloudinaryEmbedPlayerParams(
  url: string,
): { cloud: string; publicId: string } | null {
  try {
    const u = new URL(url);
    if (!/player\.cloudinary\.com$/i.test(u.hostname)) return null;
    const cloud =
      u.searchParams.get("cloud_name")?.trim() ||
      u.searchParams.get("cloud")?.trim() ||
      "";
    const publicId =
      u.searchParams.get("public_id")?.trim() ||
      u.searchParams.get("publicId")?.trim() ||
      "";
    if (!cloud || !publicId) return null;
    return { cloud, publicId: decodeURIComponent(publicId) };
  } catch {
    return null;
  }
}

function buildCloudinaryImageUrl(publicId: string, transforms: string): string {
  const cloud = cloudName();
  if (!cloud) return publicId;
  const id = stripCloudinaryExtension(publicId.replace(/^\/+/, ""));
  return `https://res.cloudinary.com/${cloud}/image/upload/${transforms}/${id}`;
}

function cloudinaryVideoPublicId(raw: string): string {
  const s = raw.trim().replace(/\s+/g, "");
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) {
    const embed = cloudinaryEmbedPlayerParams(s);
    if (embed) return embed.publicId;
    return (
      cloudinaryPublicIdFromUrl(s, "video") ??
      cloudinaryPublicIdFromUrl(s, "image") ??
      ""
    );
  }
  return stripCloudinaryExtension(s.replace(/^\/+/, ""));
}

/** Cloudinary video public_id → 9:16 / 16:9 poster karesi (so_0). */
export function resolveShowreelPosterFromVideo(
  raw: string,
  layout: ShowreelLayout,
): string {
  const cloud = cloudName();
  const publicId = cloudinaryVideoPublicId(raw);
  if (!cloud || !publicId) return "";
  const transforms = showreelPosterTransforms(layout);
  return `https://res.cloudinary.com/${cloud}/video/upload/${transforms},so_0/${publicId}.jpg`;
}

/** Anasayfa showreel poster — web 16:9, mobil 9:16. */
export function resolveShowreelPosterUrl(raw: string, layout: ShowreelLayout): string {
  const s = raw.trim().replace(/\s+/g, "");
  if (!s) return "";
  const transforms = showreelPosterTransforms(layout);

  if (/^https?:\/\//i.test(s)) {
    if (s.includes("res.cloudinary.com") && s.includes("/image/upload/")) {
      if (urlHasShowreelAspect(s, layout)) return s;
      const id = cloudinaryPublicIdFromUrl(s, "image");
      if (id) return buildCloudinaryImageUrl(id, transforms);
    }
    return s;
  }

  return buildCloudinaryImageUrl(s, transforms);
}

/** Anasayfa showreel video — f_mp4; web 16:9, mobil 9:16 crop. */
export function resolveShowreelVideoUrl(
  raw: string,
  layout: ShowreelLayout,
  options?: { preserveAspect?: boolean },
): string {
  const transforms = showreelVideoTransforms(layout, options);
  const s = raw.trim().replace(/\s+/g, "");
  if (!s) return "";

  if (/^https?:\/\//i.test(s)) {
    const embed = cloudinaryEmbedPlayerParams(s);
    if (embed) {
      return buildCloudinaryVideoUrl(
        embed.publicId,
        transforms,
        embed.cloud,
      );
    }
    if (s.includes("/image/upload/")) {
      const id = cloudinaryPublicIdFromUrl(s, "image") ?? cloudinaryPublicIdFromUrl(s, "video");
      if (id) return buildCloudinaryVideoUrl(id, transforms);
      return s.replace("/image/upload/", `/video/upload/${transforms}/`);
    }
    if (s.includes("res.cloudinary.com") && s.includes("/video/upload/")) {
      if (options?.preserveAspect) {
        const id = cloudinaryPublicIdFromUrl(s, "video");
        if (id) return buildCloudinaryVideoUrl(id, transforms);
        return s;
      }
      if (/f_mp4/.test(s) && urlHasShowreelAspect(s, layout)) return s;
      const id = cloudinaryPublicIdFromUrl(s, "video");
      if (id) return buildCloudinaryVideoUrl(id, transforms);
    }
    return s;
  }

  return buildCloudinaryVideoUrl(s, transforms);
}

/** @deprecated showreel için resolveShowreelPosterUrl / resolveShowreelVideoUrl kullanın */
export function applyShowreelAspect(url: string, layout: ShowreelLayout): string {
  if (!url.includes("res.cloudinary.com") || /ar_\d+:\d+/.test(url)) return url;
  const crop = showreelAspectCrop(layout);

  if (url.includes("/video/upload/")) {
    return url.replace("/video/upload/", `/video/upload/${crop}/`);
  }
  if (url.includes("/image/upload/")) {
    return url.replace("/image/upload/", `/image/upload/${crop}/`);
  }
  return url;
}

/** Supabase + admin: kapak + numaralı galeri slotları (hepsi isteğe bağlı). */
export const GALERI_KEYS = [
  "galeri_1",
  "galeri_2",
  "galeri_3",
  "galeri_4",
  "galeri_5",
  "galeri_6",
  "galeri_7",
  "galeri_8",
  "galeri_9",
  "galeri_10",
  "galeri_11",
  "galeri_12",
  "galeri_13",
  "galeri_14",
  "galeri_15",
] as const;

export type GaleriKey = (typeof GALERI_KEYS)[number];

export const GALERI_VIDEO_KEYS = [
  "galeri_1_video",
  "galeri_5_video",
] as const;

export type GaleriVideoKey = (typeof GALERI_VIDEO_KEYS)[number];

/** Galeri slot → opsiyonel video (yalnızca 1. ve 5. görsel). */
export const GALERI_VIDEO_BY_SLOT: Partial<Record<GaleriKey, GaleriVideoKey>> = {
  galeri_1: "galeri_1_video",
  galeri_5: "galeri_5_video",
};

export const GALERI_VIDEO_SLOT_RULES = [
  {
    galeriKey: "galeri_1" as const,
    videoKey: "galeri_1_video" as const,
    /** Görsel 1: yalnızca video da olabilir */
    allowVideoOnly: true,
  },
  {
    galeriKey: "galeri_5" as const,
    videoKey: "galeri_5_video" as const,
    allowVideoOnly: false,
  },
] as const;

export type ProjectImageFields = {
  kapak: string | null;
} & Record<GaleriKey, string> &
  Record<GaleriVideoKey, string>;

export function emptyGaleriSlots(): Record<GaleriKey, string> {
  return Object.fromEntries(GALERI_KEYS.map((k) => [k, ""])) as Record<GaleriKey, string>;
}

export function emptyGaleriVideoSlots(): Record<GaleriVideoKey, string> {
  return Object.fromEntries(
    GALERI_VIDEO_KEYS.map((k) => [k, ""]),
  ) as Record<GaleriVideoKey, string>;
}

export function projectCover(project: Pick<Project, "kapak">): string | null {
  const k = resolveProjectImageUrl(project.kapak ?? "");
  return k || null;
}

export function projectGallery(project: Pick<Project, GaleriKey>): string[] {
  return GALERI_KEYS.map((k) => resolveProjectImageUrl(project[k] ?? "")).filter(Boolean);
}

export type ProjectMediaSlot = {
  key: GaleriKey | "kapak";
  posterSrc: string;
  videoSrc: string | null;
};

/** Kapak + galeri — poster ve opsiyonel video URL (yalnızca galeri 1 / 5). */
export function projectMediaSlots(
  project: Pick<Project, "kapak" | GaleriKey | GaleriVideoKey>,
): ProjectMediaSlot[] {
  const slots: ProjectMediaSlot[] = [];

  const coverPoster = resolveProjectImageUrl(project.kapak ?? "");
  if (coverPoster) {
    slots.push({
      key: "kapak",
      posterSrc: coverPoster,
      videoSrc: null,
    });
  }

  for (const key of GALERI_KEYS) {
    const videoKey = GALERI_VIDEO_BY_SLOT[key];
    const rule = GALERI_VIDEO_SLOT_RULES.find((r) => r.galeriKey === key);
    const { posterSrc, videoSrc } = resolveGallerySlotMedia(
      project[key] ?? "",
      videoKey ? project[videoKey] ?? "" : "",
      rule?.allowVideoOnly ?? false,
    );
    if (posterSrc || videoSrc) {
      slots.push({ key, posterSrc, videoSrc });
    }
  }

  return slots;
}

/** Galeri slot anahtarı korunur — galeri_2 künye hizası için ayrı stil. */
export function projectGallerySlots(
  project: Pick<Project, GaleriKey | GaleriVideoKey>,
): { key: GaleriKey; posterSrc: string; videoSrc: string | null }[] {
  return GALERI_KEYS.map((key) => {
    const videoKey = GALERI_VIDEO_BY_SLOT[key];
    const rule = GALERI_VIDEO_SLOT_RULES.find((r) => r.galeriKey === key);
    const { posterSrc, videoSrc } = resolveGallerySlotMedia(
      project[key] ?? "",
      videoKey ? project[videoKey] ?? "" : "",
      rule?.allowVideoOnly ?? false,
    );
    return { key, posterSrc, videoSrc };
  }).filter((item) => item.posterSrc.length > 0 || Boolean(item.videoSrc));
}

export function galeriFieldsFromRow(data: Record<string, unknown>): Record<GaleriKey, string> {
  const legacy = Array.isArray(data.gorseller) ? (data.gorseller as string[]) : [];
  const out = emptyGaleriSlots();
  for (let i = 0; i < GALERI_KEYS.length; i++) {
    const key = GALERI_KEYS[i]!;
    const direct = String(data[key] ?? "").trim();
    out[key] = direct || String(legacy[i] ?? "").trim();
  }
  return out;
}

export function galeriVideoFieldsFromRow(
  data: Record<string, unknown>,
): Record<GaleriVideoKey, string> {
  const out = emptyGaleriVideoSlots();
  for (const key of GALERI_VIDEO_KEYS) {
    out[key] = String(data[key] ?? "").trim();
  }
  return out;
}

export function kapakFromRow(data: Record<string, unknown>): string | null {
  const k = String(data.kapak ?? data.gorsel ?? "").trim();
  return k || null;
}

/** Poster veya video varsa slot dolu */
export function slotHasMedia(poster: string, video: string): boolean {
  return Boolean(poster.trim() || video.trim());
}
