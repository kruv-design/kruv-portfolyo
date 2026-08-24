import { bundledDropFontUrl } from "@/lib/drops-font-assets";
import type { DropFont, DropPack, DropSpecimenBlock } from "@/types";

function normalizeSpecimenBlock(raw: unknown): DropSpecimenBlock | null {
  if (!raw || typeof raw !== "object") return null;
  const b = raw as Record<string, unknown>;
  const type = String(b.type ?? "");
  if (type === "text") {
    return {
      type: "text",
      text: String(b.text ?? ""),
      ...(b.style ? { style: String(b.style) } : {}),
    };
  }
  if (type === "alphabet") {
    return {
      type: "alphabet",
      includeNumbers: b.includeNumbers === true,
    };
  }
  if (type === "image") {
    const gorsel = String(b.gorsel ?? "").trim();
    if (!gorsel) return null;
    return {
      type: "image",
      gorsel,
      ...(b.alt ? { alt: String(b.alt) } : {}),
    };
  }
  if (type === "split") {
    const left = normalizeSpecimenBlock(b.left);
    const right = normalizeSpecimenBlock(b.right);
    if (!left || !right) return null;
    return { type: "split", left, right };
  }
  return null;
}

export function mapDropPackRow(data: Record<string, unknown>): DropPack {
  return {
    id: String(data.id),
    slug: String(data.slug),
    baslik: String(data.baslik ?? ""),
    title: String(data.title ?? ""),
    aciklama: String(data.aciklama ?? ""),
    description: String(data.description ?? ""),
    kapak: String(data.kapak ?? ""),
    pack_zip_url: String(data.pack_zip_url ?? ""),
    sort_order: Number(data.sort_order ?? 0),
    yayinda: data.yayinda !== false,
    created_at: String(data.created_at ?? ""),
    updated_at: String(data.updated_at ?? ""),
  };
}

export function mapDropFontRow(data: Record<string, unknown>): DropFont {
  const blocks = Array.isArray(data.specimen_blocks)
    ? data.specimen_blocks
        .map(normalizeSpecimenBlock)
        .filter((b): b is DropSpecimenBlock => b !== null)
    : [];
  return {
    id: String(data.id),
    pack_id: String(data.pack_id),
    slug: String(data.slug),
    name: String(data.name ?? ""),
    aciklama: String(data.aciklama ?? ""),
    description: String(data.description ?? ""),
    preview_text: String(data.preview_text ?? ""),
    tester_default_text: String(data.tester_default_text ?? ""),
    tester_placeholder: String(data.tester_placeholder ?? ""),
    hero_image: String(data.hero_image ?? ""),
    font_file_url: bundledDropFontUrl(String(data.slug ?? "")) || String(data.font_file_url ?? ""),
    font_preview_url:
      bundledDropFontUrl(String(data.slug ?? "")) || String(data.font_preview_url ?? ""),
    specimen_blocks: blocks,
    sort_order: Number(data.sort_order ?? 0),
    yayinda: data.yayinda !== false,
    created_at: String(data.created_at ?? ""),
    updated_at: String(data.updated_at ?? ""),
  };
}
