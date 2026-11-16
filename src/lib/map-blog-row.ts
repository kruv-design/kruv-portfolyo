import type { BlogPost, BlogSection } from "@/types";

function normalizeSectionImages(raw: unknown) {
  if (!Array.isArray(raw)) return undefined;
  const items = raw
    .map((item) => {
      const row =
        item && typeof item === "object"
          ? (item as Record<string, unknown>)
          : {};
      const src = String(row.src ?? "").trim();
      if (!src) return null;
      const caption = String(row.caption ?? "").trim();
      const captionEn = String(row.captionEn ?? "").trim();
      return {
        src,
        ...(caption ? { caption } : {}),
        ...(captionEn ? { captionEn } : {}),
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  return items.length > 0 ? items : undefined;
}

function normalizeSection(raw: unknown): BlogSection {
  const s = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const title = String(s.title ?? "").trim();
  const text = String(s.text ?? "").trim();
  const gorsel = String(s.gorsel ?? "").trim();
  const gorselNot = String(s.gorselNot ?? "").trim();
  const note = String(s.note ?? "").trim();
  const gorseller = normalizeSectionImages(s.gorseller);
  return {
    baslik: String(s.baslik ?? ""),
    metin: String(s.metin ?? ""),
    ...(title ? { title } : {}),
    ...(text ? { text } : {}),
    ...(gorsel ? { gorsel } : {}),
    ...(gorselNot ? { gorselNot } : {}),
    ...(note ? { note } : {}),
    ...(gorseller ? { gorseller } : {}),
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
