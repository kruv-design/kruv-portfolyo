import type { Locale } from "@/lib/i18n/config";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { SITE_CANONICAL_URL } from "@/lib/site";

/** `/works`, `/contact`, `/projects/slug` veya `` (anasayfa). */
export function localePathForAlternates(pathSuffix: string): string {
  const raw = pathSuffix.trim();
  if (!raw || raw === "/") return "";
  return raw.startsWith("/") ? raw : `/${raw}`;
}

function absoluteLocaleUrl(locale: Locale, pathSuffix: string): string {
  const suffix = localePathForAlternates(pathSuffix);
  return `${SITE_CANONICAL_URL}/${locale}${suffix}`;
}

/** hreflang + x-default (varsayılan: Türkçe). */
export function buildLocaleAlternates(pathSuffix: string, locale: Locale) {
  const suffix = localePathForAlternates(pathSuffix);
  return {
    canonical: absoluteLocaleUrl(locale, suffix),
    languages: {
      "tr-TR": absoluteLocaleUrl("tr", suffix),
      en: absoluteLocaleUrl("en", suffix),
      "x-default": absoluteLocaleUrl(DEFAULT_LOCALE, suffix),
    },
  };
}
