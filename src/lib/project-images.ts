import type { Project } from "@/types";

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
  const k = (project.kapak ?? "").trim();
  return k || null;
}

export function projectGallery(project: Pick<Project, GaleriKey>): string[] {
  return GALERI_KEYS.map((k) => project[k]?.trim() ?? "").filter(Boolean);
}

/** Galeri slot anahtarı korunur — galeri_2 künye hizası için ayrı stil. */
export function projectGallerySlots(
  project: Pick<Project, GaleriKey>,
): { key: GaleriKey; src: string }[] {
  return GALERI_KEYS.map((key) => ({
    key,
    src: project[key]?.trim() ?? "",
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
