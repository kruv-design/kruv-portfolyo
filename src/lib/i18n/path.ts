import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";

export function withLocale(path: string, locale: Locale): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return `/${locale}`;
  return `/${locale}${normalized}`;
}

export function extractLocale(pathname: string): Locale {
  const first = pathname.split("/").filter(Boolean)[0];
  if (first === "en") return "en";
  return DEFAULT_LOCALE;
}
