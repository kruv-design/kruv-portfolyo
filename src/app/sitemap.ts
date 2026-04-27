import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/queries";
import { env } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects().catch(() => []);
  const base = env.SITE_URL;
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    ...projects.map((p) => ({
      url: `${base}/projects/${p.slug}`,
      lastModified: new Date(p.updated_at || p.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
