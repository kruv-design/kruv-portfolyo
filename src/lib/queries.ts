import "server-only";
import { supabasePublic } from "@/lib/supabase/server";
import { mapProjectRow } from "@/lib/map-project-row";
import {
  getSequentialNext,
  getSequentialPrev,
  resolveNextProject,
  sortProjectsBySira,
} from "@/lib/next-project";
import { DEMO_PROJECTS, isPlaceholderEnv } from "@/lib/demo-data";
import type { Project, SiteSettings } from "@/types";

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteAdi: "kruv.",
  tagline: "Seçilmiş projeler & çalışmalar",
  footerYazi: "estd 2025",
  instagramUrl: "https://www.instagram.com/kruvsocial/",
  xUrl: "",
  linkedinUrl: "https://www.linkedin.com/company/kruv/?viewAsMember=true",
  behanceUrl: "https://www.behance.net/kruv",
  dribbbleUrl: "https://dribbble.com/Kruvcom",
  youtubeUrl: "https://www.youtube.com/@KruvDesignAgency",
  pinterestUrl: "https://www.pinterest.com/kruvdesign/",
  githubUrl: "",
  homeVideoPoster: "",
  homeVideo: "",
  homeVideoPosterMobile: "",
  homeVideoMobile: "",
};

function pickSettingsUrl(value: unknown, fallback: string): string {
  const v = typeof value === "string" ? value.trim() : "";
  return v || fallback;
}

const LEGACY_FOOTER_YAZI = new Set([
  "kruv. — portfolyo",
  "kruv.-portfolyo",
  "kruv. - portfolyo",
]);

function normalizeFooterYazi(value: unknown): string {
  const v = typeof value === "string" ? value.trim() : "";
  if (!v || LEGACY_FOOTER_YAZI.has(v)) return DEFAULT_SITE_SETTINGS.footerYazi;
  return v;
}

/**
 * Map a Supabase row (snake/flat) to our Project type. Keeps JSONB shapes tidy.
 */
function rowToProject(row: Record<string, unknown>): Project {
  return mapProjectRow(row);
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

/**
 * Yalnızca admin paneli — demo projeleri **asla** listelemez.
 * Boş DB’de demo satırları göstermek, `demo-*` id’leri ile düzenleme (uuid) uyuşmazlığına
 * ve “kayıt olmuyor / görsel eklenmiyor” izlenimine yol açıyordu.
 */
export async function getProjectsAdmin(): Promise<Project[]> {
  if (isPlaceholderEnv()) return [];

  try {
    const sb = supabasePublic();
    const { data, error } = await sb
      .from("projects")
      .select("*")
      .order("sira", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(rowToProject);
  } catch {
    return [];
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
      footerYazi: normalizeFooterYazi(row?.footerYazi),
      instagramUrl: pickSettingsUrl(row?.instagramUrl, DEFAULT_SITE_SETTINGS.instagramUrl),
      xUrl: pickSettingsUrl(row?.xUrl, DEFAULT_SITE_SETTINGS.xUrl),
      linkedinUrl: pickSettingsUrl(row?.linkedinUrl, DEFAULT_SITE_SETTINGS.linkedinUrl),
      behanceUrl: pickSettingsUrl(row?.behanceUrl, DEFAULT_SITE_SETTINGS.behanceUrl),
      dribbbleUrl: pickSettingsUrl(row?.dribbbleUrl, DEFAULT_SITE_SETTINGS.dribbbleUrl),
      youtubeUrl: pickSettingsUrl(row?.youtubeUrl, DEFAULT_SITE_SETTINGS.youtubeUrl),
      pinterestUrl: pickSettingsUrl(row?.pinterestUrl, DEFAULT_SITE_SETTINGS.pinterestUrl),
      githubUrl: pickSettingsUrl(row?.githubUrl, DEFAULT_SITE_SETTINGS.githubUrl),
      homeVideoPoster:
        typeof row?.homeVideoPoster === "string" ? row.homeVideoPoster.trim() : "",
      homeVideo: typeof row?.homeVideo === "string" ? row.homeVideo.trim() : "",
      homeVideoPosterMobile:
        typeof row?.homeVideoPosterMobile === "string"
          ? row.homeVideoPosterMobile.trim()
          : "",
      homeVideoMobile:
        typeof row?.homeVideoMobile === "string" ? row.homeVideoMobile.trim() : "",
    };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

/** `sira` sırasına göre önceki / sonraki; son proje → ilk (döngü). */
export async function getAdjacentProjects(
  currentSlug: string,
): Promise<{ prev: Project | null; next: Project | null }> {
  const all = await getProjects();
  const ordered = sortProjectsBySira(all);
  const current = ordered.find((p) => p.slug === currentSlug) ?? null;
  if (!current || ordered.length <= 1) {
    return { prev: null, next: null };
  }

  return {
    prev: getSequentialPrev(current, ordered),
    next: getSequentialNext(current, ordered),
  };
}

export async function getAdjacentSlugs(
  currentSlug: string,
): Promise<{ prev: string | null; next: string | null }> {
  const { prev, next } = await getAdjacentProjects(currentSlug);
  return {
    prev: prev?.slug ?? null,
    next: next?.slug ?? null,
  };
}

/** Proje detay sonu banner — akıllı sonraki proje seçimi. */
export async function getNextProjectForDetail(
  currentSlug: string,
): Promise<Project | null> {
  const all = await getProjects();
  const current = all.find((p) => p.slug === currentSlug);
  if (!current) return null;
  return resolveNextProject(current, all);
}
