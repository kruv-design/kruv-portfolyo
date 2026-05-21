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
] as const;

export type GaleriKey = (typeof GALERI_KEYS)[number];

export type ProjectImageFields = {
  kapak: string | null;
} & Record<GaleriKey, string>;

export function emptyGaleriSlots(): Record<GaleriKey, string> {
  return Object.fromEntries(GALERI_KEYS.map((k) => [k, ""])) as Record<GaleriKey, string>;
}

export function projectCover(project: Pick<Project, "kapak">): string | null {
  const k = resolveProjectImageUrl(project.kapak ?? "");
  return k || null;
}

export function projectGallery(project: Pick<Project, GaleriKey>): string[] {
  return GALERI_KEYS.map((k) => resolveProjectImageUrl(project[k] ?? "")).filter(Boolean);
}

/** Galeri slot anahtarı korunur — galeri_2 künye hizası için ayrı stil. */
export function projectGallerySlots(
  project: Pick<Project, GaleriKey>,
): { key: GaleriKey; src: string }[] {
  return GALERI_KEYS.map((key) => ({
    key,
    src: resolveProjectImageUrl(project[key] ?? ""),
  })).filter((item) => item.src.length > 0);
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

export function kapakFromRow(data: Record<string, unknown>): string | null {
  const k = String(data.kapak ?? data.gorsel ?? "").trim();
  return k || null;
}
