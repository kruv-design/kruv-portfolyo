/** Summer Pack kart hero görselleri — Figma tasarımından, `/public/drops/heroes/` */
export const DROP_HERO_IMAGES = {
  marzano: "/drops/heroes/marzano.jpg",
  local: "/drops/heroes/local.jpg",
  cove: "/drops/heroes/cove.jpg",
} as const;

export function dropHeroImage(slug: string): string {
  return DROP_HERO_IMAGES[slug as keyof typeof DROP_HERO_IMAGES] ?? "";
}
