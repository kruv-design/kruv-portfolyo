import type { BlogPost, BlogSection } from "@/types";

function normalizeSection(raw: unknown): BlogSection {
  const s = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const title = String(s.title ?? "").trim();
  const text = String(s.text ?? "").trim();
  const gorsel = String(s.gorsel ?? "").trim();
  return {
    baslik: String(s.baslik ?? ""),
    metin: String(s.metin ?? ""),
    ...(title ? { title } : {}),
    ...(text ? { text } : {}),
    ...(gorsel ? { gorsel } : {}),
  };
}

/** Supabase `blog_posts` satırı → uygulama `BlogPost` tipi (admin + API yanıtı). */
export function mapBlogRow(data: Record<string, unknown>): BlogPost {
  return {
    id: String(data.id),
    slug: String(data.slug),
    baslik: String(data.baslik ?? ""),
    title: String(data.title ?? ""),
    aciklama: String(data.aciklama ?? ""),
    description: String(data.description ?? ""),
    kapak: String(data.kapak ?? ""),
    bolumler: Array.isArray(data.bolumler)
      ? data.bolumler.map(normalizeSection)
      : [],
    yayinda: data.yayinda !== false,
    created_at: String(data.created_at ?? ""),
    updated_at: String(data.updated_at ?? ""),
  };
}
