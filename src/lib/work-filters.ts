/** Work sayfası filtre şeridi — sabit etiketler; proje `kategori` alanı bunlara eşlenir. */

export const WORK_PAGE_FILTER_LABELS = [
  "Social media",
  "Branding",
  "Editorial",
  "Web design",
] as const;

export type WorkPageFilterLabel = (typeof WORK_PAGE_FILTER_LABELS)[number];

function norm(s: string): string {
  return s.trim().toLowerCase();
}

/**
 * CMS’deki serbest metin kategoriyi work filtresine bağlar (TR/EN varyasyonları).
 */
export function projectMatchesWorkFilter(
  kategori: string,
  filterLabel: WorkPageFilterLabel,
): boolean {
  const k = norm(kategori);
  if (!k) return false;

  switch (filterLabel) {
    case "Social media":
      return (
        k.includes("social") ||
        k.includes("sosyal") ||
        k.includes("feed") ||
        k.includes("native") ||
        k.includes("motion")
      );
    case "Branding":
      return (
        k.includes("brand") ||
        k.includes("marka") ||
        k.includes("identity") ||
        k.includes("kimlik") ||
        k.includes("packaging") ||
        k.includes("ambalaj")
      );
    case "Editorial":
      return (
        k.includes("editorial") ||
        k.includes("journal") ||
        k.includes("print") ||
        k.includes("yayın") ||
        k.includes("magazine")
      );
    case "Web design":
      return (
        /\bweb\b/.test(k) ||
        k.includes("ui/ux") ||
        k.includes("ui ux") ||
        (k.includes("ui") && k.includes("ux")) ||
        k.includes("website") ||
        k.includes("web site") ||
        k.includes("dijital") ||
        k.includes("digital product")
      );
    default:
      return false;
  }
}
