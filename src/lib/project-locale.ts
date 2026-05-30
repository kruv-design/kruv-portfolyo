import { localizeCategoryString } from "@/lib/category-labels";
import type { Locale } from "@/lib/i18n/config";
import type { Project, ProjectSection } from "@/types";

function pickEn(primary: string, en: string | undefined): string {
  if (en?.trim()) return en.trim();
  return primary;
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
      bolumler,
    };
  }

  return {
    ...project,
    baslik: pickEn(project.baslik, project.title),
    aciklama: pickEn(project.aciklama, project.description),
    kategori: resolveCategory(project, "en"),
    bolumler,
  };
}
