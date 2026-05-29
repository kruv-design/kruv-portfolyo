import type { Project } from "@/types";

const SERVICE_SLUGS: Record<string, true> = {
  "brand-identity": true,
  packaging: true,
  editorial: true,
  "ui-ux": true,
  illustration: true,
};

function mapFragmentToServiceSlug(frag: string): string {
  const s = frag.trim().toLowerCase();
  if (!s) return "";
  if (/ui\s*\/?\s*ux/.test(s)) return "ui-ux";
  if (/illustrat/.test(s)) return "illustration";
  if (/ambalaj/.test(s)) return "packaging";
  if (/packag/.test(s)) return "packaging";
  if (/editorial/.test(s)) return "editorial";
  if (/\bidentity\b/.test(s) || /^brand\s+identity/.test(s)) return "brand-identity";
  return "";
}

/** Footer filtreleri ile hizalı `data-work-tags` (kruv.html bindCMS ile aynı). */
export function featuredWorkTagsFromProject(project: Project): string {
  const out: string[] = [];
  const add = (slug: string) => {
    if (slug && SERVICE_SLUGS[slug] && !out.includes(slug)) out.push(slug);
  };

  for (const t of project.etiketler ?? []) {
    const raw = String(t || "")
      .trim()
      .toLowerCase()
      .replace(/\s*\/\s*/g, "-")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    add(raw === "uiux" ? "ui-ux" : raw);
  }

  for (const frag of String(project.kategori || "").split(/[·,|]/)) {
    add(mapFragmentToServiceSlug(frag.trim()));
  }

  return out.join(" ");
}

export function sortProjectsForFeatured(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return (a.sira || 0) - (b.sira || 0);
  });
}
