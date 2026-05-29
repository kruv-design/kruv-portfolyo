/** Work sayfası filtre şeridi — sabit etiketler; proje `kategori` alanı bunlara eşlenir. */

import {
  WORK_PAGE_FILTER_LABELS,
  type WorkPageFilterLabel,
} from "@/lib/project-categories";

export { WORK_PAGE_FILTER_LABELS, type WorkPageFilterLabel };

const FILTER_SLUGS: Record<WorkPageFilterLabel, string> = {
  "Social media": "social-media",
  Branding: "branding",
  Editorial: "editorial",
  "Web design": "web-design",
  Packaging: "packaging",
};

const SLUG_TO_FILTER: Record<string, WorkPageFilterLabel> = {
  "social-media": "Social media",
  branding: "Branding",
  editorial: "Editorial",
  "web-design": "Web design",
  packaging: "Packaging",
};

/** Footer Services → `/works` filtresi */
export const FOOTER_SERVICE_LINKS = [
  { label: "Brand identity", filter: "Branding" as const },
  { label: "Packaging", filter: "Packaging" as const },
  { label: "Editorial", filter: "Editorial" as const },
  { label: "UI/UX", filter: "Web design" as const },
  { label: "Illustration", filter: "Branding" as const },
] as const;

export const HOME_HERO_HREF = "/#hero";

export function worksPageHref(filter?: WorkPageFilterLabel): string {
  if (!filter) return "/works";
  return `/works?filter=${FILTER_SLUGS[filter]}`;
}

export function parseWorksFilterParam(
  raw: string | null | undefined,
): WorkPageFilterLabel | null {
  if (!raw) return null;
  return SLUG_TO_FILTER[raw.trim().toLowerCase()] ?? null;
}

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
        k.includes("kimlik")
      );
    case "Packaging":
      return k.includes("packaging") || k.includes("ambalaj");
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
