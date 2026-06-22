import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/queries";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n/config";
import { ENABLE_PUBLIC_CONTACT } from "@/lib/marketing-flags";

const PRODUCTION_URL = "https://kruv.com";

function localePriority(locale: Locale, trWeight: number, enWeight: number): number {
  return locale === DEFAULT_LOCALE ? trWeight : enWeight;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects().catch(() => []);
  const base = PRODUCTION_URL;
  const now = new Date();

  const staticPaths = ENABLE_PUBLIC_CONTACT ? ["/works", "/contact"] : ["/works"];

  return [
    // Anasayfalar — TR birincil
    ...LOCALES.map((locale) => ({
      url: `${base}/${locale}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: localePriority(locale, 1.0, 0.75),
    })),

    // Projeler + İletişim
    ...LOCALES.flatMap((locale) =>
      staticPaths.map((path) => ({
        url: `${base}/${locale}${path}`,
        lastModified: now,
        changeFrequency: path === "/works" ? ("weekly" as const) : ("monthly" as const),
        priority:
          path === "/works"
            ? localePriority(locale, 0.9, 0.7)
            : localePriority(locale, 0.85, 0.65),
      })),
    ),

    // Proje detay sayfaları
    ...LOCALES.flatMap((locale) =>
      projects.map((p) => ({
        url: `${base}/${locale}/projects/${p.slug}`,
        lastModified: new Date(p.updated_at || p.created_at),
        changeFrequency: "monthly" as const,
        priority: localePriority(locale, 0.8, 0.6),
      })),
    ),
  ];
}
