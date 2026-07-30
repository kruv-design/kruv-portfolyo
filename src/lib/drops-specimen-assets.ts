/** Figma specimen export — hero + galeri blokları (public/drops/specimens/) */

export type DropSpecimenSet = {
  hero: string;
  heroAlt: string;
  gallery: { src: string; alt: string }[];
};

export const DROP_SPECIMEN_ASSETS: Record<string, DropSpecimenSet> = {
  marzano: {
    hero: "/drops/specimens/marzano/hero.png",
    heroAlt: "Marzano — TOMATO specimen",
    gallery: [
      { src: "/drops/specimens/marzano/01-fluid-pasta.png", alt: "Marzano — fluid moments" },
      { src: "/drops/specimens/marzano/02-phone.png", alt: "Marzano — Designed, baked, and served" },
      { src: "/drops/specimens/marzano/03-bag.png", alt: "Marzano — Something Saucy mockup" },
      { src: "/drops/specimens/marzano/04-homemade.png", alt: "Marzano — homemade pasta" },
    ],
  },
  local: {
    hero: "/drops/specimens/local/hero.png",
    heroAlt: "Local — cool without effort",
    gallery: [
      { src: "/drops/specimens/local/01-grid.png", alt: "Local — signature of soil and time" },
      { src: "/drops/specimens/local/02-alphabet.png", alt: "Local — alphabet specimen" },
      { src: "/drops/specimens/local/03-cards.png", alt: "Local — story of roots" },
      { src: "/drops/specimens/local/04-wine.png", alt: "Local — wine box mockup" },
    ],
  },
  cove: {
    hero: "/drops/specimens/cove/hero.png",
    heroAlt: "Cove — water ripple hero",
    gallery: [
      { src: "/drops/specimens/cove/01-pebbles-text.png", alt: "Cove — Born from pebbles, simple and cool" },
      { src: "/drops/specimens/cove/02-collage.png", alt: "Cove — softest form of nature" },
      { src: "/drops/specimens/cove/03-cap-alphabet.png", alt: "Cove — cap mockup and alphabet" },
    ],
  },
};

export function getDropSpecimenAssets(slug: string): DropSpecimenSet | null {
  return DROP_SPECIMEN_ASSETS[slug] ?? null;
}

/** CMS specimen_blocks varsa galeri olarak kullan; yoksa Figma export fallback */
export function resolveDropSpecimenGallery(
  slug: string,
  blocks: { type: string; gorsel?: string; alt?: string }[],
): { src: string; alt: string }[] {
  const fromBlocks = blocks
    .filter((b) => b.type === "image" && b.gorsel)
    .map((b) => ({
      src: b.gorsel!.startsWith("http") || b.gorsel!.startsWith("/")
        ? b.gorsel!
        : `/drops/specimens/${slug}/${b.gorsel}`,
      alt: b.alt ?? "",
    }));

  if (fromBlocks.length > 0) return fromBlocks;

  return getDropSpecimenAssets(slug)?.gallery ?? [];
}

export function resolveDropSpecimenHero(
  slug: string,
  blocks: { type: string; gorsel?: string; alt?: string; style?: string }[],
): { src: string; alt: string } | null {
  const heroBlock = blocks.find(
    (b) => b.type === "image" && (b.style === "hero" || b.style === "specimen-hero"),
  );
  if (heroBlock?.gorsel) {
    const src =
      heroBlock.gorsel.startsWith("http") || heroBlock.gorsel.startsWith("/")
        ? heroBlock.gorsel
        : `/drops/specimens/${slug}/${heroBlock.gorsel}`;
    return { src, alt: heroBlock.alt ?? "" };
  }

  const assets = getDropSpecimenAssets(slug);
  if (!assets) return null;
  return { src: assets.hero, alt: assets.heroAlt };
}
