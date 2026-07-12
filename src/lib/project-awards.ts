import type { Locale } from "@/lib/i18n/config";
import {
  HOME_SPOTLIGHT_BADGES,
  type HomeSpotlightBadgeVariant,
} from "@/lib/home-spotlight-badges";

export type ProjectAward = {
  key: HomeSpotlightBadgeVariant;
  badgeSrc: string;
  tooltip: string;
};

const DEFAULT_TOOLTIP: Record<Locale, string> = {
  tr: "Bu proje Adobe Behance'de grafik tasarım alanında seçkin projelerde sergilenmiştir.",
  en: "This project was featured among Adobe Behance's curated graphic design projects.",
};

export const AWARD_STACK_ARIA: Record<Locale, string> = {
  tr: "Behance ödülleri",
  en: "Behance awards",
};

export function awardBadgeAlt(key: string, locale: Locale): string {
  return locale === "tr"
    ? `${key.toUpperCase()} ödül rozeti`
    : `${key.toUpperCase()} award badge`;
}

/**
 * Proje kartlarında gösterilecek Behance rozetleri.
 * Not: Tooltip metinleri burada merkezi tutulur; sonradan kolayca değiştirilebilir.
 */
const PROJECT_AWARD_RULES: Array<{
  test: (slug: string) => boolean;
  badges: HomeSpotlightBadgeVariant[];
}> = [
  {
    test: (slug) => slug.includes("levantenler"),
    badges: ["gr", "id"],
  },
  {
    test: (slug) => slug.includes("marker"),
    badges: ["gr"],
  },
];

export function projectAwardsBySlug(slug: string, locale: Locale): ProjectAward[] {
  const key = slug.trim().toLowerCase();
  const rule = PROJECT_AWARD_RULES.find((item) => item.test(key));
  if (!rule) return [];
  return rule.badges.map((badge) => ({
    key: badge,
    badgeSrc: HOME_SPOTLIGHT_BADGES[badge],
    tooltip: DEFAULT_TOOLTIP[locale],
  }));
}
