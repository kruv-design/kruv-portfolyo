/**
 * Canonical project category labels — CMS dropdown, works filters, Supabase `project_categories`.
 * Keep in sync with `supabase/migrations/*project_categories*` seed rows.
 */
export const PROJECT_CATEGORY_LABELS = [
  "Social media",
  "Branding",
  "Editorial",
  "Web design",
  "Packaging",
  "Motion",
] as const;

export type ProjectCategoryLabel = (typeof PROJECT_CATEGORY_LABELS)[number];

/** Works page filter strip (`/works`). */
export const WORK_PAGE_FILTER_LABELS = [
  "Social media",
  "Branding",
  "Editorial",
  "Web design",
  "Packaging",
] as const satisfies readonly ProjectCategoryLabel[];

export type WorkPageFilterLabel = (typeof WORK_PAGE_FILTER_LABELS)[number];

/** Admin-only categories (not on works filter bar). */
export const ADMIN_ONLY_CATEGORY_LABELS = ["Motion"] as const;
