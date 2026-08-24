import type { Locale } from "@/lib/i18n/config";
import type { DropFont, DropPack } from "@/types";

const LOCAL_INTRO = "yapmacıksız. olduğu gibi. ham. premium.";

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
  const resolved =
    font.slug === "local"
      ? { ...font, aciklama: LOCAL_INTRO, description: LOCAL_INTRO }
      : font;
  if (locale === "en") {
    return {
      ...resolved,
      aciklama: resolved.description.trim() || resolved.aciklama,
    };
  }
  return resolved;
}
