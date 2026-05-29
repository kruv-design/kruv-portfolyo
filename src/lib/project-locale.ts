import { localizeCategoryString } from "@/lib/category-labels";
import type { Locale } from "@/lib/i18n/config";
import type { Project } from "@/types";

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

/**
 * Proje metinleri — Supabase düz sütunlar:
 * TR: baslik, aciklama, kategori
 * EN: title, description, category (boşsa otomatik çeviri)
 */
export function resolveProjectForLocale(
  project: Project,
  locale: Locale,
): Project {
  if (locale === "tr") {
    return {
      ...project,
      kategori: resolveCategory(project, "tr"),
    };
  }

  return {
    ...project,
    baslik: pickEn(project.baslik, project.title),
    aciklama: pickEn(project.aciklama, project.description),
    kategori: resolveCategory(project, "en"),
  };
}
