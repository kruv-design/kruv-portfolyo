import type { Locale } from "@/lib/i18n/config";
import type { DropFont, DropPack } from "@/types";

export function resolveDropPackForLocale(pack: DropPack, locale: Locale): DropPack {
  if (locale === "en") {
    return {
      ...pack,
      baslik: pack.title.trim() || pack.baslik,
      aciklama: pack.description.trim() || pack.aciklama,
    };
  }
  return pack;
}

export function resolveDropFontForLocale(font: DropFont, locale: Locale): DropFont {
  if (locale === "en") {
    return {
      ...font,
      aciklama: font.description.trim() || font.aciklama,
    };
  }
  return font;
}
