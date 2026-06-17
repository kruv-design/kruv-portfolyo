import type { Locale } from "@/lib/i18n/config";
import { BRAND_NAME } from "@/lib/brand";
import {
  projectIntroForLocale,
  projectTitleForLocale,
  resolveProjectForLocale,
} from "@/lib/project-locale";
import type { Project } from "@/types";

const META_MAX = 160;

/** Proje detay — `{title} - {açıklama}`; CMS boşsa kategori yedek. */
export function projectMetaDescription(project: Project, locale: Locale): string {
  const title = projectTitleForLocale(project, locale);
  const intro = projectIntroForLocale(project, locale).trim();

  if (intro) {
    const lowerIntro = intro.toLowerCase();
    const lowerTitle = title.toLowerCase();
    const prefixed =
      lowerIntro.startsWith(lowerTitle) || lowerIntro.startsWith(`${lowerTitle} -`)
        ? intro
        : `${title} - ${intro}`;
    return prefixed.slice(0, META_MAX);
  }

  const category = resolveProjectForLocale(project, locale).kategori?.trim();
  if (locale === "en") {
    return (
      category
        ? `${title} - ${category} project by ${BRAND_NAME}`
        : `${title} - Creative project by ${BRAND_NAME}`
    ).slice(0, META_MAX);
  }

  return (
    category
      ? `${title} - ${category} projesi. ${BRAND_NAME} yaratıcı tasarım stüdyosu.`
      : `${title} - ${BRAND_NAME} yaratıcı tasarım stüdyosu projesi.`
  ).slice(0, META_MAX);
}
