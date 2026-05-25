import type { Project } from "@/types";

/** Tüm gezinme: `sira` artan — aynı sira’da en yeni önce. */
export function sortProjectsBySira(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    if (a.sira !== b.sira) return a.sira - b.sira;
    return (
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  });
}

/** Sonraki proje: sıradaki; listedeki son → ilk (sira 1 / en düşük sira). */
export function getSequentialNext(
  current: Project,
  ordered: Project[],
): Project | null {
  if (ordered.length <= 1) return null;
  const idx = ordered.findIndex((p) => p.slug === current.slug);
  if (idx === -1) return ordered[0] ?? null;
  return ordered[(idx + 1) % ordered.length] ?? null;
}

/** Önceki proje: sıradaki geri; ilk → son. */
export function getSequentialPrev(
  current: Project,
  ordered: Project[],
): Project | null {
  if (ordered.length <= 1) return null;
  const idx = ordered.findIndex((p) => p.slug === current.slug);
  if (idx === -1) return ordered[ordered.length - 1] ?? null;
  return ordered[(idx - 1 + ordered.length) % ordered.length] ?? null;
}

/**
 * Proje detay sonu banner + genel “sonraki”:
 * 1) `next_project_override` (manuel)
 * 2) `sira` sırası — son projeden sonra her zaman ilk projeye dön
 */
export function resolveNextProject(
  current: Project,
  all: Project[],
): Project | null {
  if (all.length <= 1) return null;

  const ordered = sortProjectsBySira(all);

  const override = current.next_project_override?.trim();
  if (override && override !== current.slug) {
    const manual = ordered.find((p) => p.slug === override);
    if (manual) return manual;
  }

  return getSequentialNext(current, ordered);
}

export function projectListPosition(
  current: Project,
  all: Project[],
): { index: number; total: number } {
  const ordered = sortProjectsBySira(all);
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
