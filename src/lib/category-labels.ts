import type { Locale } from "@/lib/i18n/config";
import type { WorkPageFilterLabel } from "@/lib/project-categories";

type CategoryEntry = Record<Locale, string>;

/** Bilinen kategori parçaları — TR/EN eşlemesi (virgüllü metinler parça parça çevrilir). */
const CATEGORY_BY_NORM: Record<string, CategoryEntry> = {
  "social media": { tr: "Sosyal medya", en: "Social media" },
  sosyal: { tr: "Sosyal medya", en: "Social media" },
  "sosyal medya": { tr: "Sosyal medya", en: "Social media" },
  branding: { tr: "Markalaşma", en: "Branding" },
  markalaşma: { tr: "Markalaşma", en: "Branding" },
  marka: { tr: "Markalaşma", en: "Branding" },
  "marka kimliği": { tr: "Marka kimliği", en: "Brand identity" },
  "brand identity": { tr: "Marka kimliği", en: "Brand identity" },
  editorial: { tr: "Editoryal", en: "Editorial" },
  editoryal: { tr: "Editoryal", en: "Editorial" },
  "web design": { tr: "Web tasarım", en: "Web design" },
  "web tasarım": { tr: "Web tasarım", en: "Web design" },
  packaging: { tr: "Ambalaj", en: "Packaging" },
  ambalaj: { tr: "Ambalaj", en: "Packaging" },
  motion: { tr: "Hareketli medya", en: "Motion" },
  "hareketli medya": { tr: "Hareketli medya", en: "Motion" },
  "moving media": { tr: "Hareketli medya", en: "Motion" },
  "ui/ux": { tr: "UI/UX", en: "UI/UX" },
  grafik: { tr: "Grafik tasarım", en: "Graphic design" },
  "graphic design": { tr: "Grafik tasarım", en: "Graphic design" },
  "exhibition design": { tr: "Sergi tasarımı", en: "Exhibition design" },
  "sergi tasarımı": { tr: "Sergi tasarımı", en: "Exhibition design" },
  "sergileme tasarımı": { tr: "Sergi tasarımı", en: "Exhibition design" },
  photography: { tr: "Fotoğraf", en: "Photography" },
  fotoğraf: { tr: "Fotoğraf", en: "Photography" },
  fotograf: { tr: "Fotoğraf", en: "Photography" },
  hospitality: { tr: "Hospitality", en: "Hospitality" },
  video: { tr: "Video", en: "Video" },
};

const WORK_FILTER_I18N: Record<WorkPageFilterLabel, CategoryEntry> = {
  "Social media": { tr: "Sosyal medya", en: "Social media" },
  Branding: { tr: "Markalaşma", en: "Branding" },
  Editorial: { tr: "Editoryal", en: "Editorial" },
  "Web design": { tr: "Web tasarım", en: "Web design" },
  Packaging: { tr: "Ambalaj", en: "Packaging" },
};

function normalizeKey(part: string): string {
  return part
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function localizePart(part: string, locale: Locale): string {
  const trimmed = part.trim();
  if (!trimmed) return "";
  const entry = CATEGORY_BY_NORM[normalizeKey(trimmed)];
  return entry ? entry[locale] : trimmed;
}

/** `"branding, packaging"` / `"social-media"` → locale’e göre okunur etiket. */
export function localizeCategoryString(raw: string, locale: Locale): string {
  const parts = raw.split(/[,·|]/).map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return raw.trim();
  return parts.map((part) => localizePart(part, locale)).join(", ");
}

export function workFilterDisplayLabel(
  filter: WorkPageFilterLabel,
  locale: Locale,
): string {
  return WORK_FILTER_I18N[filter][locale];
}
