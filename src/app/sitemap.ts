import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/queries";
import { LOCALES } from "@/lib/i18n/config";
import { ENABLE_PUBLIC_CONTACT } from "@/lib/marketing-flags";

const PRODUCTION_URL = "https://kruv.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects().catch(() => []);
  const base = PRODUCTION_URL;
  const now = new Date();

  const staticPaths = ENABLE_PUBLIC_CONTACT ? ["/works", "/contact"] : ["/works"];

  return [
    // Anasayfalar — en yüksek öncelik
    ...LOCALES.map((locale) => ({
      url: `${base}/${locale}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 1.0,
    })),

    // Works + Contact
    ...LOCALES.flatMap((locale) =>
      staticPaths.map((path) => ({
        url: `${base}/${locale}${path}`,
        lastModified: now,
        changeFrequency: path === "/works" ? ("weekly" as const) : ("monthly" as const),
        priority: path === "/works" ? 0.9 : 0.85,
      })),
    ),

    // Proje detay sayfaları
    ...LOCALES.flatMap((locale) =>
      projects.map((p) => ({
        url: `${base}/${locale}/projects/${p.slug}`,
        lastModified: new Date(p.updated_at || p.created_at),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
    ),
  ];
}
