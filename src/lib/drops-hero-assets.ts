import { DROP_LIVE_PHOTOS } from "@/lib/drops-live-assets";

/** Kart hero — yalnızca foto (metin/buton baked değil) */
export const DROP_HERO_IMAGES = {
  marzano: DROP_LIVE_PHOTOS.marzano.cardBg,
  local: DROP_LIVE_PHOTOS.local.cardBg,
  cove: DROP_LIVE_PHOTOS.cove.cardBg,
} as const;

export function dropHeroImage(slug: string): string {
  return DROP_HERO_IMAGES[slug as keyof typeof DROP_HERO_IMAGES] ?? "";
}
