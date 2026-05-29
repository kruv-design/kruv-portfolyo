import type { Locale } from "@/lib/i18n/config";
import type { Project, ProjectI18n, ProjectSection } from "@/types";

function pickText(
  primary: string,
  override: string | undefined,
  locale: Locale,
): string {
  if (locale === "en" && override?.trim()) return override.trim();
  return primary;
}

function pickSections(
  primary: ProjectSection[],
  override: ProjectSection[] | undefined,
  locale: Locale,
): ProjectSection[] {
  if (locale === "en" && override && override.length > 0) return override;
  return primary;
}

function pickTags(
  primary: string[],
  override: string[] | undefined,
  locale: Locale,
): string[] {
  if (locale === "en" && override && override.length > 0) return override;
  return primary;
}

/** Kategori etiketleri — EN sayfada CMS çevirisi yoksa bilinen eşlemeler. */
const CATEGORY_EN_BY_NORM: Record<string, string> = {
  "social media": "Social media",
  branding: "Branding",
  editorial: "Editorial",
  "web design": "Web design",
  packaging: "Packaging",
  motion: "Motion",
  "ui/ux": "UI/UX",
  grafik: "Graphic design",
  ambalaj: "Packaging",
};

function localizeCategoryFallback(kategori: string, locale: Locale): string {
  if (locale !== "en") return kategori;
  const parts = kategori.split(/[,·|]/).map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return kategori;
  return parts
    .map((part) => {
      const key = part.toLowerCase();
      return CATEGORY_EN_BY_NORM[key] ?? part;
    })
    .join(", ");
}

/**
 * Proje detay (ve metadata) için locale’e göre metin alanlarını çözümler.
 * EN alanı boşsa TR’ye düşer (mevcut projeler kırılmaz).
 */
export function resolveProjectForLocale(
  project: Project,
  locale: Locale,
): Project {
  if (locale !== "en") return project;

  const en = project.i18n?.en;
  if (!en) {
    return {
      ...project,
      kategori: localizeCategoryFallback(project.kategori, locale),
    };
  }

  return {
    ...project,
    baslik: pickText(project.baslik, en.baslik, locale),
    aciklama: pickText(project.aciklama, en.aciklama, locale),
    kategori: en.kategori?.trim()
      ? en.kategori.trim()
      : localizeCategoryFallback(project.kategori, locale),
    bolumler: pickSections(project.bolumler, en.bolumler, locale),
    etiketler: pickTags(project.etiketler, en.etiketler, locale),
  };
}

export function parseProjectI18n(raw: unknown): ProjectI18n | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const root = raw as Record<string, unknown>;
  const enRaw = root.en;
  if (!enRaw || typeof enRaw !== "object") return undefined;

  const en = enRaw as Record<string, unknown>;
  const block: NonNullable<ProjectI18n["en"]> = {};

  if (typeof en.baslik === "string" && en.baslik.trim()) block.baslik = en.baslik.trim();
  if (typeof en.aciklama === "string" && en.aciklama.trim()) {
    block.aciklama = en.aciklama.trim();
  }
  if (typeof en.kategori === "string" && en.kategori.trim()) {
    block.kategori = en.kategori.trim();
  }
  if (Array.isArray(en.bolumler)) {
    const sections = (en.bolumler as ProjectSection[]).filter(
      (b) => b?.baslik?.trim() || b?.metin?.trim(),
    );
    if (sections.length) block.bolumler = sections;
  }
  if (Array.isArray(en.etiketler)) {
    const tags = (en.etiketler as string[])
      .map((t) => String(t).trim())
      .filter(Boolean);
    if (tags.length) block.etiketler = tags;
  }

  if (Object.keys(block).length === 0) return undefined;
  return { en: block };
}

/** Admin kaydı: boş EN alanlarını at, tamamen boşsa undefined. */
export function buildProjectI18nPayload(en: {
  baslik: string;
  aciklama: string;
  kategori: string;
  bolumler: ProjectSection[];
  etiketler: string[];
}): ProjectI18n | undefined {
  const block: NonNullable<ProjectI18n["en"]> = {};

  if (en.baslik.trim()) block.baslik = en.baslik.trim();
  if (en.aciklama.trim()) block.aciklama = en.aciklama.trim();
  if (en.kategori.trim()) block.kategori = en.kategori.trim();

  const bolumler = en.bolumler.filter((b) => b.baslik.trim() || b.metin.trim());
  if (bolumler.length) block.bolumler = bolumler;

  const etiketler = en.etiketler.map((t) => t.trim()).filter(Boolean);
  if (etiketler.length) block.etiketler = etiketler;

  if (Object.keys(block).length === 0) return undefined;
  return { en: block };
}

export const EMPTY_PROJECT_I18N_EN = {
  baslik: "",
  aciklama: "",
  kategori: "",
  bolumler: [] as ProjectSection[],
  etiketler: [] as string[],
};
