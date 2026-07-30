/** Summer Pack kart hero — Cloudinary kruv-drops/heroes/ */
export const DROP_HERO_IMAGES = {
  marzano: "kruv-drops/heroes/marzano",
  local: "kruv-drops/heroes/local",
  cove: "kruv-drops/heroes/cove",
} as const;

export function dropHeroImage(slug: string): string {
  return DROP_HERO_IMAGES[slug as keyof typeof DROP_HERO_IMAGES] ?? "";
}
