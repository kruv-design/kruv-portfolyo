import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/queries";
import { env } from "@/lib/env";
import { LOCALES } from "@/lib/i18n/config";
import { ENABLE_PUBLIC_CONTACT } from "@/lib/marketing-flags";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects().catch(() => []);
  const base = env.SITE_URL;
  const staticPaths = ENABLE_PUBLIC_CONTACT ? ["/works", "/contact"] : ["/works"];

  return [
    ...LOCALES.flatMap((locale) =>
      staticPaths.map((path) => ({
        url: `${base}/${locale}${path}`,
        changeFrequency: path === "/works" ? ("weekly" as const) : ("monthly" as const),
        priority: path === "/works" ? 0.9 : 0.85,
      })),
    ),
    ...LOCALES.flatMap((locale) =>
      projects.map((p) => ({
        url: `${base}/${locale}/projects/${p.slug}`,
        lastModified: new Date(p.updated_at || p.created_at),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    ),
  ];
}
