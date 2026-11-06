import type { Project, ProjectSection } from "@/types";
import {
  galeriFieldsFromRow,
  galeriVideoFieldsFromRow,
  kapakFromRow,
} from "@/lib/project-images";

function normalizeSection(raw: unknown): ProjectSection {
  const s = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const title = String(s.title ?? "").trim();
  const text = String(s.text ?? "").trim();
  return {
    baslik: String(s.baslik ?? ""),
    metin: String(s.metin ?? ""),
    ...(title ? { title } : {}),
    ...(text ? { text } : {}),
  };
}

function dropHospitality(value: string): string {
  return value
    .split(/[,·|]/)
    .map((part) => part.trim())
    .filter((part) => part.toLowerCase() !== "hospitality")
    .join(", ");
}

/** Supabase `projects` satırı → uygulama `Project` tipi (admin + API yanıtı). */
export function mapProjectRow(data: Record<string, unknown>): Project {
  const slug = String(data.slug);
  const renamed = slug === "musterek";
  const withName = (value: string) =>
    renamed ? value.replace(/Müşterek(?! Hizalanma)/g, "Müşterek Hizalanma") : value;
  const tags = Array.isArray(data.etiketler) ? (data.etiketler as string[]) : [];
  return {
    id: String(data.id),
    slug,
    baslik: renamed ? "Müşterek Hizalanma" : String(data.baslik ?? ""),
    title: renamed ? "Müşterek Hizalanma" : String(data.title ?? ""),
    kategori: renamed ? dropHospitality(String(data.kategori ?? "")) : String(data.kategori ?? ""),
    category: renamed ? dropHospitality(String(data.category ?? "")) : String(data.category ?? ""),
    aciklama: withName(String(data.aciklama ?? "")),
    description: withName(String(data.description ?? "")),
    kapak: kapakFromRow(data),
    ...galeriFieldsFromRow(data),
    ...galeriVideoFieldsFromRow(data),
    bolumler: Array.isArray(data.bolumler)
      ? data.bolumler.map(normalizeSection)
      : [],
    etiketler: renamed
      ? tags.filter((tag) => tag.trim().toLowerCase() !== "hospitality")
      : tags,
    featured: Boolean(data.featured),
    yayinda: data.yayinda !== false,
    next_project_override: String(data.next_project_override ?? ""),
    renk: String(data.renk ?? "#C8B8A8"),
    sira: Number(data.sira ?? 0),
    created_at: String(data.created_at ?? ""),
    updated_at: String(data.updated_at ?? ""),
  };
}
