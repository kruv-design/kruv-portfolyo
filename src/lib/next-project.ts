import type { Project } from "@/types";

function sortBySira(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    if (a.sira !== b.sira) return a.sira - b.sira;
    return (
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  });
}

function categoryTokens(kategori: string): Set<string> {
  return new Set(
    kategori
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
}

function sharesCategory(a: Project, b: Project): boolean {
  const A = categoryTokens(a.kategori);
  for (const t of categoryTokens(b.kategori)) {
    if (A.has(t)) return true;
  }
  return false;
}

/** Sıralı listede current'tan sonra gelen ilk aday (döngüsel). */
function nextInOrderedPool(
  current: Project,
  ordered: Project[],
  pool: Project[],
): Project | null {
  if (pool.length === 0) return null;
  const poolSlugs = new Set(pool.map((p) => p.slug));
  const idx = ordered.findIndex((p) => p.slug === current.slug);
  if (idx === -1) return pool[0] ?? null;

  for (let step = 1; step <= ordered.length; step++) {
    const candidate = ordered[(idx + step) % ordered.length];
    if (poolSlugs.has(candidate.slug) && candidate.slug !== current.slug) {
      return candidate;
    }
  }
  return null;
}

/**
 * Proje detay sonu banner — öncelik:
 * 1) next_project_override
 * 2) Aynı kategori (sira sırası, döngü)
 * 3) Aynı müşteri
 * 4) Featured havuz
 * 5) Genel sira döngüsü
 */
export function resolveNextProject(
  current: Project,
  all: Project[],
): Project | null {
  if (all.length <= 1) return null;

  const ordered = sortBySira(all);
  const others = ordered.filter((p) => p.slug !== current.slug);
  if (others.length === 0) return null;

  const override = current.next_project_override?.trim();
  if (override && override !== current.slug) {
    const manual = ordered.find((p) => p.slug === override);
    if (manual) return manual;
  }

  const sameCategory = others.filter((p) => sharesCategory(current, p));
  const fromCategory = nextInOrderedPool(current, ordered, sameCategory);
  if (fromCategory) return fromCategory;

  const client = current.musteri?.trim();
  if (client) {
    const sameClient = others.filter((p) => p.musteri?.trim() === client);
    const fromClient = nextInOrderedPool(current, ordered, sameClient);
    if (fromClient) return fromClient;
  }

  const featured = others.filter((p) => p.featured);
  const fromFeatured = nextInOrderedPool(current, ordered, featured);
  if (fromFeatured) return fromFeatured;

  const idx = ordered.findIndex((p) => p.slug === current.slug);
  if (idx === -1) return others[0] ?? null;
  return ordered[(idx + 1) % ordered.length] ?? null;
}

export function projectListPosition(
  current: Project,
  all: Project[],
): { index: number; total: number } {
  const ordered = sortBySira(all);
  const idx = ordered.findIndex((p) => p.slug === current.slug);
  return {
    index: idx === -1 ? 1 : idx + 1,
    total: ordered.length,
  };
}

export function projectMetaSubtitle(project: Project): string {
  const parts: string[] = [];
  if (project.kategori?.trim()) parts.push(project.kategori.trim());
  if (project.etiketler?.length) {
    parts.push(project.etiketler.slice(0, 2).join(", "));
  } else if (project.musteri?.trim()) {
    parts.push(project.musteri.trim());
  }
  if (project.yil?.trim()) parts.push(project.yil.trim());
  return parts.join(" · ");
}
