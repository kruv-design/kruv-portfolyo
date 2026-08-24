import type { Locale } from "@/lib/i18n/config";

export function dropFontFamily(slug: string): string {
  return `"DropFont-${slug}"`;
}

/** Marzano / Cove yalnızca majuskül glif — minuskül girişi majusküle map et.
 *  Marzano İngilizce brand metinleri: tr-TR uppercase "i"→"İ" yapar (FLUİD);
 *  bu yüzden Marzano her zaman en-US ile büyütülür. Cove TR pangram için locale kullanır. */
export function normalizeDropFontText(
  text: string,
  slug: string,
  locale: Locale = "tr",
): string {
  if (!text) return text;
  const loc = locale === "tr" ? "tr-TR" : "en-US";
  if (slug === "marzano") return text.toLocaleUpperCase("en-US");
  if (slug === "cove") return text.toLocaleUpperCase(loc);
  if (slug === "local") return text.toLocaleLowerCase(loc);
  return text;
}

/** Summer Pack — siteden indirilen / önizlenen TTF’ler (`public/drops/fonts`). */
export const DROP_FONT_FILES = {
  marzano: "/drops/fonts/MARZANO-Regular.ttf",
  local: "/drops/fonts/Local-Regular.ttf",
  cove: "/drops/fonts/Cove-Regular.ttf",
} as const;

export function bundledDropFontUrl(slug: string): string | undefined {
  if (slug === "marzano" || slug === "local" || slug === "cove") {
    return DROP_FONT_FILES[slug];
  }
  return undefined;
}

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
