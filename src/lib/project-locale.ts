import { localizeCategoryString } from "@/lib/category-labels";
import type { Locale } from "@/lib/i18n/config";
import type { Project, ProjectSection } from "@/types";

function pickEn(primary: string, en: string | undefined): string {
  if (en?.trim()) return en.trim();
  return primary;
}

/** EN kısa açıklama — description sütunu; boşsa aciklama (TR). */
export function projectIntroForLocale(project: Project, locale: Locale): string {
  if (locale === "en") {
    const en = project.description?.trim();
    if (en) return en;
  }
  return project.aciklama?.trim() || "";
}

/** Locale’e göre proje başlığı. */
export function projectTitleForLocale(project: Project, locale: Locale): string {
  if (locale === "en") {
    return pickEn(project.baslik, project.title);
  }
  return project.baslik?.trim() || "";
}

function resolveEtiketler(etiketler: string[], locale: Locale): string[] {
  return etiketler.map((tag) => localizeCategoryString(tag, locale) || tag);
}

function resolveCategory(project: Project, locale: Locale): string {
  if (locale === "en") {
    if (project.category?.trim()) return project.category.trim();
    return localizeCategoryString(project.kategori, "en");
  }

  if (project.kategori?.trim()) {
    return localizeCategoryString(project.kategori, "tr");
  }
  if (project.category?.trim()) {
    return localizeCategoryString(project.category, "tr");
  }
  return "";
}

function resolveSections(
  sections: ProjectSection[],
  locale: Locale,
): ProjectSection[] {
  return sections.map((s) => {
    if (locale === "en") {
      return {
        ...s,
        baslik: pickEn(s.baslik, s.title),
        metin: pickEn(s.metin, s.text),
      };
    }
    return {
      ...s,
      baslik: s.baslik?.trim() || "",
      metin: s.metin?.trim() || "",
    };
  });
}

/**
 * Proje metinleri — Supabase düz sütunlar + bolumler JSON:
 * TR: baslik, aciklama, kategori, bolumler.baslik/metin
 * EN: title, description, category, bolumler.title/text (boşsa TR)
 */
export function resolveProjectForLocale(
  project: Project,
  locale: Locale,
): Project {
  const bolumler = resolveSections(project.bolumler ?? [], locale);

  if (locale === "tr") {
    return {
      ...project,
      baslik: project.baslik?.trim() || "",
      aciklama: project.aciklama?.trim() || "",
      kategori: resolveCategory(project, "tr"),
      etiketler: resolveEtiketler(project.etiketler ?? [], "tr"),
      bolumler,
    };
  }

  return {
    ...project,
    baslik: projectTitleForLocale(project, "en"),
    aciklama: projectIntroForLocale(project, "en"),
    kategori: resolveCategory(project, "en"),
    etiketler: resolveEtiketler(project.etiketler ?? [], "en"),
    bolumler,
  };
}
