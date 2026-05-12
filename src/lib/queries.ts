import "server-only";
import { supabasePublic } from "@/lib/supabase/server";
import { DEMO_PROJECTS, isPlaceholderEnv } from "@/lib/demo-data";
import type { Project, ProjectSection, SiteSettings } from "@/types";

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteAdi: "kruv.",
  tagline: "Seçilmiş projeler & çalışmalar",
  footerYazi: "kruv. — portfolyo",
  instagramUrl: "",
  xUrl: "",
  linkedinUrl: "",
  behanceUrl: "",
  dribbbleUrl: "",
  youtubeUrl: "",
  pinterestUrl: "",
  githubUrl: "",
};

/**
 * Map a Supabase row (snake/flat) to our Project type. Keeps JSONB shapes tidy.
 */
function rowToProject(row: Record<string, unknown>): Project {
  return {
    id: String(row.id),
    slug: String(row.slug),
    baslik: String(row.baslik ?? ""),
    kategori: String(row.kategori ?? ""),
    aciklama: String(row.aciklama ?? ""),
    gorsel: (row.gorsel as string) || null,
    gorseller: Array.isArray(row.gorseller) ? (row.gorseller as string[]) : [],
    bolumler: Array.isArray(row.bolumler)
      ? (row.bolumler as ProjectSection[])
      : [],
    etiketler: Array.isArray(row.etiketler) ? (row.etiketler as string[]) : [],
    yil: String(row.yil ?? ""),
    musteri: String(row.musteri ?? ""),
    rol: String(row.rol ?? ""),
    sure: String(row.sure ?? ""),
    link: String(row.link ?? ""),
    featured: Boolean(row.featured),
    renk: String(row.renk ?? "#C8B8A8"),
    sira: Number(row.sira ?? 0),
    created_at: String(row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
  };
}

export async function getProjects(): Promise<Project[]> {
  // Before Supabase is wired, surface demo content instead of a blank grid.
  if (isPlaceholderEnv()) return DEMO_PROJECTS;

  try {
    const sb = supabasePublic();
    const { data, error } = await sb
      .from("projects")
      .select("*")
      .order("sira", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw error;
    const rows = (data ?? []).map(rowToProject);
    // If DB is reachable but empty, still show demo so the dev experience
    // is never an empty grid (admin-added projects obviously take priority).
    return rows.length > 0 ? rows : DEMO_PROJECTS;
  } catch {
    return DEMO_PROJECTS;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (isPlaceholderEnv()) {
    return DEMO_PROJECTS.find((p) => p.slug === slug) ?? null;
  }

  try {
    const sb = supabasePublic();
    const { data, error } = await sb
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    if (data) return rowToProject(data);
    // Unknown slug in real DB → also check demo so the seeded link works
    // during the first-run tour. Will be null for truly missing slugs.
    return DEMO_PROJECTS.find((p) => p.slug === slug) ?? null;
  } catch {
    return DEMO_PROJECTS.find((p) => p.slug === slug) ?? null;
  }
}

export async function getSettings(): Promise<SiteSettings> {
  if (isPlaceholderEnv()) {
    return DEFAULT_SITE_SETTINGS;
  }

  try {
    const sb = supabasePublic();
    const { data, error } = await sb
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (error) throw error;
    const row = data as Partial<SiteSettings> | null | undefined;
    return {
      siteAdi: row?.siteAdi ?? DEFAULT_SITE_SETTINGS.siteAdi,
      tagline: row?.tagline ?? DEFAULT_SITE_SETTINGS.tagline,
      footerYazi: row?.footerYazi ?? DEFAULT_SITE_SETTINGS.footerYazi,
      instagramUrl: row?.instagramUrl ?? "",
      xUrl: row?.xUrl ?? "",
      linkedinUrl: row?.linkedinUrl ?? "",
      behanceUrl: row?.behanceUrl ?? "",
      dribbbleUrl: row?.dribbbleUrl ?? "",
      youtubeUrl: row?.youtubeUrl ?? "",
      pinterestUrl: row?.pinterestUrl ?? "",
      githubUrl: row?.githubUrl ?? "",
    };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function getAdjacentSlugs(
  currentSlug: string,
): Promise<{ prev: string | null; next: string | null }> {
  const all = await getProjects();
  const idx = all.findIndex((p) => p.slug === currentSlug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? all[idx - 1].slug : null,
    next: idx < all.length - 1 ? all[idx + 1].slug : null,
  };
}
