import type { Project, ProjectSection } from "@/types";

/** Supabase `projects` satırı → uygulama `Project` tipi (admin + API yanıtı). */
export function mapProjectRow(data: Record<string, unknown>): Project {
  return {
    id: String(data.id),
    slug: String(data.slug),
    baslik: String(data.baslik ?? ""),
    kategori: String(data.kategori ?? ""),
    aciklama: String(data.aciklama ?? ""),
    gorsel: (data.gorsel as string) || null,
    gorseller: Array.isArray(data.gorseller) ? (data.gorseller as string[]) : [],
    bolumler: Array.isArray(data.bolumler)
      ? (data.bolumler as ProjectSection[])
      : [],
    etiketler: Array.isArray(data.etiketler) ? (data.etiketler as string[]) : [],
    yil: String(data.yil ?? ""),
    musteri: String(data.musteri ?? ""),
    sure: String(data.sure ?? ""),
    link: String(data.link ?? ""),
    featured: Boolean(data.featured),
    renk: String(data.renk ?? "#C8B8A8"),
    sira: Number(data.sira ?? 0),
    created_at: String(data.created_at ?? ""),
    updated_at: String(data.updated_at ?? ""),
  };
}
