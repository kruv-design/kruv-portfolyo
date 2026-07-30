/** Cloudinary kruv-drops/ — Figma @2x export (1316–1321px genişlik) */
import { publicCldImageUrlBest } from "@/lib/cld-public";

export type DropSpecimenSet = {
  hero: string;
  heroAlt: string;
  gallery: { src: string; alt: string }[];
};

export const DROP_SPECIMEN_ASSETS: Record<string, DropSpecimenSet> = {
  marzano: {
    hero: "kruv-drops/specimens/marzano/hero",
    heroAlt: "Marzano — TOMATO specimen",
    gallery: [
      { src: "kruv-drops/specimens/marzano/01-fluid-pasta", alt: "Marzano — fluid moments" },
      { src: "kruv-drops/specimens/marzano/02-phone", alt: "Marzano — Designed, baked, and served" },
      { src: "kruv-drops/specimens/marzano/03-bag", alt: "Marzano — Something Saucy mockup" },
      { src: "kruv-drops/specimens/marzano/04-homemade", alt: "Marzano — homemade pasta" },
    ],
  },
  local: {
    hero: "kruv-drops/specimens/local/hero",
    heroAlt: "Local — cool without effort",
    gallery: [
      { src: "kruv-drops/specimens/local/01-grid", alt: "Local — signature of soil and time" },
      { src: "kruv-drops/specimens/local/02-alphabet", alt: "Local — alphabet specimen" },
      { src: "kruv-drops/specimens/local/03-cards", alt: "Local — story of roots" },
      { src: "kruv-drops/specimens/local/04-wine", alt: "Local — wine box mockup" },
    ],
  },
  cove: {
    hero: "kruv-drops/specimens/cove/hero",
    heroAlt: "Cove — water ripple hero",
    gallery: [
      { src: "kruv-drops/specimens/cove/01-pebbles-text", alt: "Cove — Born from pebbles, simple and cool" },
      { src: "kruv-drops/specimens/cove/02-collage", alt: "Cove — softest form of nature" },
      { src: "kruv-drops/specimens/cove/03-cap-alphabet", alt: "Cove — cap mockup and alphabet" },
    ],
  },
};

export function resolveDropImageUrl(src: string): string {
  return publicCldImageUrlBest(src);
}

export function getDropSpecimenAssets(slug: string): DropSpecimenSet | null {
  return DROP_SPECIMEN_ASSETS[slug] ?? null;
}

/** CMS specimen_blocks varsa galeri olarak kullan; yoksa Cloudinary fallback */
export function resolveDropSpecimenGallery(
  slug: string,
  blocks: { type: string; gorsel?: string; alt?: string }[],
): { src: string; alt: string }[] {
  const fromBlocks = blocks
    .filter((b) => b.type === "image" && b.gorsel)
    .map((b) => ({
      src: resolveDropImageUrl(b.gorsel!),
      alt: b.alt ?? "",
    }));

  if (fromBlocks.length > 0) return fromBlocks;

  const assets = getDropSpecimenAssets(slug)?.gallery ?? [];
  return assets.map((item) => ({
    src: resolveDropImageUrl(item.src),
    alt: item.alt,
  }));
}

export function resolveDropSpecimenHero(
  slug: string,
  blocks: { type: string; gorsel?: string; alt?: string; style?: string }[],
): { src: string; alt: string } | null {
  const heroBlock = blocks.find(
    (b) => b.type === "image" && (b.style === "hero" || b.style === "specimen-hero"),
  );
  if (heroBlock?.gorsel) {
    return {
      src: resolveDropImageUrl(heroBlock.gorsel),
      alt: heroBlock.alt ?? "",
    };
  }

  const assets = getDropSpecimenAssets(slug);
  if (!assets) return null;
  return { src: resolveDropImageUrl(assets.hero), alt: assets.heroAlt };
}
