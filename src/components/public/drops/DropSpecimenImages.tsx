import {
  resolveDropSpecimenGallery,
  resolveDropSpecimenHero,
} from "@/lib/drops-specimen-assets";

type Props = {
  slug: string;
  variant: "hero" | "gallery";
  /** CMS specimen_blocks — boşsa Figma fallback */
  blocks?: { type: string; gorsel?: string; alt?: string; style?: string }[];
};

function SpecimenImage({ src, alt, priority }: { src: string; alt: string; priority?: boolean }) {
  return (
    <figure className="drops-specimen-figure">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} decoding="async" />
    </figure>
  );
}

export function DropSpecimenImages({ slug, variant, blocks = [] }: Props) {
  if (variant === "hero") {
    const hero = resolveDropSpecimenHero(slug, blocks);
    if (!hero) return null;
    return (
      <section className="drops-specimen-hero" aria-label="Specimen hero">
        <SpecimenImage src={hero.src} alt={hero.alt} priority />
      </section>
    );
  }

  const gallery = resolveDropSpecimenGallery(slug, blocks);
  if (gallery.length === 0) return null;

  return (
    <section className="drops-specimen-gallery" aria-label="Specimen gallery">
      {gallery.map((item) => (
        <SpecimenImage key={item.src} src={item.src} alt={item.alt} />
      ))}
    </section>
  );
}
