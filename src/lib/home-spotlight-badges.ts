/** Anasayfa spotlight kartı — Adobe uygulama rozetleri */
export const HOME_SPOTLIGHT_BADGES = {
  gr: "/assets/home-spotlight/gr.svg",
  id: "/assets/home-spotlight/id.svg",
} as const;

export type HomeSpotlightBadgeVariant = keyof typeof HOME_SPOTLIGHT_BADGES;
