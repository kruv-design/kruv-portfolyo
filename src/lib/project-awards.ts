import {
  HOME_SPOTLIGHT_BADGES,
  type HomeSpotlightBadgeVariant,
} from "@/lib/home-spotlight-badges";

export type ProjectAward = {
  key: HomeSpotlightBadgeVariant;
  badgeSrc: string;
  tooltip: string;
};

const DEFAULT_TOOLTIP =
  "Bu proje Adobe Behance'de grafik tasarım alanında seçkin projelerde sergilenmiştir.";

/**
 * Proje kartlarında gösterilecek Behance rozetleri.
 * Not: Tooltip metinleri burada merkezi tutulur; sonradan kolayca değiştirilebilir.
 */
const PROJECT_AWARD_RULES: Array<{
  test: (slug: string) => boolean;
  awards: ProjectAward[];
}> = [
  {
    test: (slug) => slug.includes("levantenler"),
    awards: [
      { key: "gr", badgeSrc: HOME_SPOTLIGHT_BADGES.gr, tooltip: DEFAULT_TOOLTIP },
      { key: "id", badgeSrc: HOME_SPOTLIGHT_BADGES.id, tooltip: DEFAULT_TOOLTIP },
    ],
  },
  {
    test: (slug) => slug.includes("marker"),
    awards: [{ key: "gr", badgeSrc: HOME_SPOTLIGHT_BADGES.gr, tooltip: DEFAULT_TOOLTIP }],
  },
];

export function projectAwardsBySlug(slug: string): ProjectAward[] {
  const key = slug.trim().toLowerCase();
  const rule = PROJECT_AWARD_RULES.find((item) => item.test(key));
  return rule?.awards ?? [];
}

