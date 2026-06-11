import type { Locale } from "@/lib/i18n/config";
import { withLocale } from "@/lib/i18n/path";
import { ENABLE_PUBLIC_CONTACT } from "@/lib/marketing-flags";

/** Geçici iletişim — iletişim sayfası kapalıyken CTA buraya gider. */
export const WHATSAPP_CONTACT_URL = "https://wa.me/905323673866";

export function isExternalCtaHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

/** İletişim sayfası açıksa /contact, değilse WhatsApp. */
export function projectCtaHref(locale: Locale): string {
  return ENABLE_PUBLIC_CONTACT
    ? withLocale("/contact", locale)
    : WHATSAPP_CONTACT_URL;
}
