import type { Project } from "@/types";

function cloudName(): string {
  return String(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "").trim();
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
    // Supabase’e yanlışlıkla image delivery URL yapıştırılmışsa düzelt
    if (s.includes("/image/upload/")) {
      return s.replace(
        "/image/upload/",
        "/video/upload/q_auto,f_auto:video,w_1920,c_limit/",
      );
    }
    return s;
  }
  const cloud = cloudName();
  if (!cloud) return s;
  const id = s
    .replace(/^\/+/, "")
    .replace(/\.(mp4|webm|mov)$/i, "");
  return `https://res.cloudinary.com/${cloud}/video/upload/q_auto,f_auto:video,w_1920,c_limit/${id}`;
}

export type ShowreelLayout = "landscape" | "portrait";

/** Anasayfa showreel — web 16:9, mobil 9:16 (Cloudinary crop). */
export function applyShowreelAspect(url: string, layout: ShowreelLayout): string {
  if (!url.includes("res.cloudinary.com") || /ar_\d+:\d+/.test(url)) return url;
  const crop = layout === "landscape" ? "c_fill,ar_16:9" : "c_fill,ar_9:16";

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
] as const;

export type GaleriKey = (typeof GALERI_KEYS)[number];

export const GALERI_VIDEO_KEYS = [
  "galeri_1_video",
  "galeri_2_video",
  "galeri_3_video",
  "galeri_4_video",
  "galeri_5_video",
  "galeri_6_video",
  "galeri_7_video",
  "galeri_8_video",
  "galeri_9_video",
  "galeri_10_video",
] as const;

export type GaleriVideoKey = (typeof GALERI_VIDEO_KEYS)[number];

export type ProjectImageFields = {
  kapak: string | null;
  kapak_video: string;
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

export function projectCoverVideo(
  project: Pick<Project, "kapak_video">,
): string | null {
  const v = resolveProjectVideoUrl(project.kapak_video ?? "");
  return v || null;
}

export function projectGallery(project: Pick<Project, GaleriKey>): string[] {
  return GALERI_KEYS.map((k) => resolveProjectImageUrl(project[k] ?? "")).filter(Boolean);
}

export type ProjectMediaSlot = {
  key: GaleriKey | "kapak";
  posterSrc: string;
  videoSrc: string | null;
};

/** Kapak + galeri — poster ve opsiyonel video URL */
export function projectMediaSlots(
  project: Pick<Project, "kapak" | "kapak_video" | GaleriKey | GaleriVideoKey>,
): ProjectMediaSlot[] {
  const slots: ProjectMediaSlot[] = [];

  const coverPoster = resolveProjectImageUrl(project.kapak ?? "");
  const coverVideo = resolveProjectVideoUrl(project.kapak_video ?? "");
  if (coverPoster || coverVideo) {
    slots.push({
      key: "kapak",
      posterSrc: coverPoster,
      videoSrc: coverVideo || null,
    });
  }

  for (let i = 0; i < GALERI_KEYS.length; i++) {
    const key = GALERI_KEYS[i]!;
    const videoKey = GALERI_VIDEO_KEYS[i]!;
    const posterSrc = resolveProjectImageUrl(project[key] ?? "");
    const videoSrc = resolveProjectVideoUrl(project[videoKey] ?? "") || null;
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
  return GALERI_KEYS.map((key, i) => {
    const videoKey = GALERI_VIDEO_KEYS[i]!;
    return {
      key,
      posterSrc: resolveProjectImageUrl(project[key] ?? ""),
      videoSrc: resolveProjectVideoUrl(project[videoKey] ?? "") || null,
    };
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

export function kapakVideoFromRow(data: Record<string, unknown>): string {
  return String(data.kapak_video ?? "").trim();
}

/** Poster veya video varsa slot dolu */
export function slotHasMedia(poster: string, video: string): boolean {
  return Boolean(poster.trim() || video.trim());
}
