import type { Locale } from "@/lib/i18n/config";

/** Blog tarihi. İstanbul takvimi, gün kaymasın diye. */
export function formatBlogDate(iso: string, locale: Locale): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Istanbul",
  }).format(d);
}
