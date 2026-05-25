import type { Project, ProjectSection } from "@/types";
import {
  galeriFieldsFromRow,
  galeriVideoFieldsFromRow,
  kapakFromRow,
  kapakVideoFromRow,
} from "@/lib/project-images";

/** Supabase `projects` satırı → uygulama `Project` tipi (admin + API yanıtı). */
export function mapProjectRow(data: Record<string, unknown>): Project {
  return {
    id: String(data.id),
    slug: String(data.slug),
    baslik: String(data.baslik ?? ""),
    kategori: String(data.kategori ?? ""),
    aciklama: String(data.aciklama ?? ""),
    kapak: kapakFromRow(data),
    kapak_video: kapakVideoFromRow(data),
    ...galeriFieldsFromRow(data),
    ...galeriVideoFieldsFromRow(data),
    bolumler: Array.isArray(data.bolumler)
      ? (data.bolumler as ProjectSection[])
      : [],
    etiketler: Array.isArray(data.etiketler) ? (data.etiketler as string[]) : [],
    link: String(data.link ?? ""),
    featured: Boolean(data.featured),
    next_project_override: String(data.next_project_override ?? ""),
    renk: String(data.renk ?? "#C8B8A8"),
    sira: Number(data.sira ?? 0),
    created_at: String(data.created_at ?? ""),
    updated_at: String(data.updated_at ?? ""),
  };
}
