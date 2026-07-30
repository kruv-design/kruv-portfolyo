import type { Locale } from "@/lib/i18n/config";

export function dropFontFamily(slug: string): string {
  return `"DropFont-${slug}"`;
}

/** Marzano / Cove yalnızca majuskül glif — minuskül girişi majusküle map et */
export function normalizeDropFontText(
  text: string,
  slug: string,
  locale: Locale = "tr",
): string {
  if (!text) return text;
  const loc = locale === "tr" ? "tr-TR" : "en-US";
  if (slug === "marzano" || slug === "cove") return text.toLocaleUpperCase(loc);
  if (slug === "local") return text.toLocaleLowerCase(loc);
  return text;
}

/** Summer Pack — Cloudinary raw font dosyaları */
export const DROP_FONT_FILES = {
  marzano:
    "https://res.cloudinary.com/di0qbhh46/raw/upload/v1785337257/MARZANO-Regular_ogmtz8.ttf",
  local:
    "https://res.cloudinary.com/di0qbhh46/raw/upload/v1785337240/Local-Regular_ce75fi.ttf",
  cove:
    "https://res.cloudinary.com/di0qbhh46/raw/upload/v1785337238/Cove-Regular_a7jne9.ttf",
} as const;

export function dropFontFormat(url: string): {
  cssFormat: "woff2" | "truetype" | "opentype";
  mimeType: string;
} {
  const lower = url.split("?")[0]?.toLowerCase() ?? "";
  if (lower.endsWith(".woff2")) {
    return { cssFormat: "woff2", mimeType: "font/woff2" };
  }
  if (lower.endsWith(".otf")) {
    return { cssFormat: "opentype", mimeType: "font/otf" };
  }
  return { cssFormat: "truetype", mimeType: "font/ttf" };
}
