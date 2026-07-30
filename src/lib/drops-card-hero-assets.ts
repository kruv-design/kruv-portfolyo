import { DROP_LIVE_PHOTOS } from "@/lib/drops-live-assets";

/** Kart hero — yalnızca foto (metin / buton baked değil) */
export const DROP_CARD_HERO_IMAGES = {
  marzano: DROP_LIVE_PHOTOS.marzano.phoneBg,
  local: DROP_LIVE_PHOTOS.local.hero,
  cove: DROP_LIVE_PHOTOS.cove.heroWater,
} as const;

const LEGACY_COMPOSITE_HERO = /kruv-drops\/heroes\//;

export function dropCardHeroImage(slug: string): string {
  return DROP_CARD_HERO_IMAGES[slug as keyof typeof DROP_CARD_HERO_IMAGES] ?? "";
}

function isLegacyCompositeHero(value: string): boolean {
  return LEGACY_COMPOSITE_HERO.test(value);
}

/** Index kartları — bilinen fontlarda her zaman photo-only; DB composite URL’lerini yok say */
export function resolveDropCardHeroPublicId(font: {
  slug: string;
  hero_image?: string;
}): string {
  const photoOnly = dropCardHeroImage(font.slug);
  if (photoOnly) return photoOnly;

  const fromDb = font.hero_image?.trim() ?? "";
  if (!fromDb || isLegacyCompositeHero(fromDb) || fromDb.includes("unsplash.com")) {
    return "";
  }

  return fromDb;
}
