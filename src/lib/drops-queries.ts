import "server-only";
import { supabasePublic, supabaseAdmin } from "@/lib/supabase/server";
import { mapDropFontRow, mapDropPackRow } from "@/lib/map-drop-row";
import { isPlaceholderEnv } from "@/lib/demo-data";
import {
  getDemoDropFont,
  getDemoDropPacks,
} from "@/lib/drops-demo-data";
import type {
  DropDownloadRow,
  DropFont,
  DropFontEventRow,
  DropPack,
  DropPackWithFonts,
} from "@/types";

function downloadFilename(slug: string, url: string, fallbackExt: string): string {
  const path = url.split("?")[0]?.toLowerCase() ?? "";
  const match = path.match(/\.(ttf|otf|woff2|zip)$/);
  return `${slug}.${match?.[1] ?? fallbackExt}`;
}

function nestedName(
  value: unknown,
): { name: string; slug: string } {
  const row = Array.isArray(value) ? value[0] : value;
  if (!row || typeof row !== "object") return { name: "", slug: "" };
  const rec = row as { name?: unknown; slug?: unknown; baslik?: unknown };
  return {
    name: String(rec.name ?? rec.baslik ?? ""),
    slug: String(rec.slug ?? ""),
  };
}

function attachFonts(
  packs: DropPack[],
  fonts: DropFont[],
): DropPackWithFonts[] {
  return packs.map((pack) => ({
    ...pack,
    fonts: fonts
      .filter((f) => f.pack_id === pack.id && f.yayinda)
      .sort((a, b) => a.sort_order - b.sort_order),
  }));
}

/** Public — yalnızca yayında paketler + fontlar */
export async function getDropPacksPublic(): Promise<DropPackWithFonts[]> {
  if (isPlaceholderEnv()) return getDemoDropPacks();

  try {
    const sb = supabasePublic();
    const [{ data: packs, error: packErr }, { data: fonts, error: fontErr }] =
      await Promise.all([
        sb
          .from("drop_packs")
          .select("*")
          .eq("yayinda", true)
          .order("sort_order", { ascending: true }),
        sb.from("drop_fonts").select("*").eq("yayinda", true),
      ]);
    if (packErr) throw packErr;
    if (fontErr) throw fontErr;
    const mappedPacks = (packs ?? []).map((r) =>
      mapDropPackRow(r as Record<string, unknown>),
    );
    const mappedFonts = (fonts ?? []).map((r) =>
      mapDropFontRow(r as Record<string, unknown>),
    );
    if (mappedPacks.length === 0) return getDemoDropPacks();
    return attachFonts(mappedPacks, mappedFonts).filter((p) => p.fonts.length > 0);
  } catch {
    return getDemoDropPacks();
  }
}

export async function getDropPackBySlugPublic(
  slug: string,
): Promise<DropPackWithFonts | null> {
  const packs = await getDropPacksPublic();
  return packs.find((p) => p.slug === slug) ?? null;
}

export async function getDropFontPublic(
  packSlug: string,
  fontSlug: string,
): Promise<{ pack: DropPackWithFonts; font: DropFont } | null> {
  const pack = await getDropPackBySlugPublic(packSlug);
  if (pack) {
    const font = pack.fonts.find((f) => f.slug === fontSlug);
    if (font) return { pack, font };
  }
  if (isPlaceholderEnv()) return getDemoDropFont(packSlug, fontSlug);
  return getDemoDropFont(packSlug, fontSlug);
}

/** Admin — tüm paketler */
export async function getDropPacksAdmin(): Promise<DropPackWithFonts[]> {
  if (isPlaceholderEnv()) return getDemoDropPacks();

  try {
    const sb = supabasePublic();
    const [{ data: packs }, { data: fonts }] = await Promise.all([
      sb.from("drop_packs").select("*").order("sort_order", { ascending: true }),
      sb.from("drop_fonts").select("*").order("sort_order", { ascending: true }),
    ]);
    return attachFonts(
      (packs ?? []).map((r) => mapDropPackRow(r as Record<string, unknown>)),
      (fonts ?? []).map((r) => mapDropFontRow(r as Record<string, unknown>)),
    );
  } catch {
    return getDemoDropPacks();
  }
}

export async function getDropPackAdminById(
  id: string,
): Promise<DropPackWithFonts | null> {
  const packs = await getDropPacksAdmin();
  return packs.find((p) => p.id === id) ?? null;
}

export async function getDropDownloadsAdmin(): Promise<DropDownloadRow[]> {
  if (isPlaceholderEnv()) return [];

  try {
    const sb = supabaseAdmin();
    const withJoin = await sb
      .from("drop_downloads")
      .select("*, drop_fonts(name, slug), drop_packs(baslik, slug)")
      .order("created_at", { ascending: false })
      .limit(2000);
    const result = withJoin.error
      ? await sb
          .from("drop_downloads")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(2000)
      : withJoin;
    if (result.error) throw result.error;
    return (result.data ?? []).map((row) => {
      const font = nestedName(row.drop_fonts);
      const pack = nestedName(row.drop_packs);
      return {
        id: String(row.id),
        name: String(row.name ?? ""),
        email: String(row.email ?? ""),
        pack_id: row.pack_id ? String(row.pack_id) : null,
        font_id: row.font_id ? String(row.font_id) : null,
        download_type: row.download_type as "font" | "pack",
        ip_hash: String(row.ip_hash ?? ""),
        user_agent: String(row.user_agent ?? ""),
        locale: String(row.locale ?? "tr"),
        created_at: String(row.created_at ?? ""),
        referrer: String(row.referrer ?? ""),
        page: String(row.page ?? ""),
        source: String(row.source ?? ""),
        country: String(row.country ?? ""),
        session_id: String(row.session_id ?? ""),
        font_name: font.name,
        font_slug: font.slug,
        pack_name: pack.name,
        pack_slug: pack.slug,
      };
    });
  } catch {
    return [];
  }
}

export async function getDropFontEventsAdmin(): Promise<DropFontEventRow[]> {
  if (isPlaceholderEnv()) return [];

  try {
    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from("site_events")
      .select("id, event_name, page, props, referrer, created_at")
      .in("event_name", [
        "drop_font_click",
        "drop_font_view",
        "drop_download_open",
        "drop_download",
      ])
      .order("created_at", { ascending: false })
      .limit(2000);
    if (error) throw error;
    return (data ?? []).map((row) => {
      const props =
        row.props && typeof row.props === "object"
          ? (row.props as Record<string, unknown>)
          : {};
      return {
        id: Number(row.id),
        event_name: String(row.event_name ?? ""),
        page: String(row.page ?? ""),
        referrer: String(row.referrer ?? ""),
        font: String(props.font ?? ""),
        pack: String(props.pack ?? ""),
        action: String(props.action ?? props.source ?? ""),
        created_at: String(row.created_at ?? ""),
      };
    });
  } catch {
    return [];
  }
}

export async function resolveDownloadTarget(
  packSlug: string,
  fontSlug: string | undefined,
  type: "font" | "pack",
): Promise<{
  pack: DropPack;
  font: DropFont | null;
  downloadUrl: string;
  filename: string;
} | null> {
  const ctx =
    type === "font" && fontSlug
      ? await getDropFontPublic(packSlug, fontSlug)
      : null;
  const pack = ctx?.pack ?? (await getDropPackBySlugPublic(packSlug));
  if (!pack) return null;

  if (type === "pack") {
    const url = pack.pack_zip_url.trim();
    if (!url) return null;
    return {
      pack,
      font: null,
      downloadUrl: url,
      filename: `${pack.slug}.zip`,
    };
  }

  const font = ctx?.font ?? pack.fonts[0] ?? null;
  if (!font) return null;
  const url = font.font_file_url.trim();
  if (!url) return null;
  return {
    pack,
    font,
    downloadUrl: url,
    filename: downloadFilename(font.slug, url, "ttf"),
  };
}
