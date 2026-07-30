import {
  resolveDropSpecimenGallery,
  resolveDropSpecimenHero,
} from "@/lib/drops-specimen-assets";
import {
  DropSpecimenLiveBlock,
  DropSpecimenLiveHero,
  hasDropSpecimenLive,
  hasDropSpecimenLiveHero,
  isLiveGalleryIndex,
} from "./DropSpecimenLive";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  slug: string;
  variant: "hero" | "gallery";
  locale?: Locale;
  /** CMS specimen_blocks — boşsa Cloudinary fallback */
  blocks?: { type: string; gorsel?: string; alt?: string; style?: string }[];
  /** false ise yalnızca statik görseller */
  live?: boolean;
};

function SpecimenImage({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <figure className="drops-specimen-figure">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
      />
    </figure>
  );
}

function hasCmsSpecimenBlocks(blocks: Props["blocks"]): boolean {
  return (blocks ?? []).some((b) => b.type === "image" && b.gorsel);
}

export function DropSpecimenImages({
  slug,
  variant,
  blocks = [],
  locale = "tr",
  live = true,
}: Props) {
  const cmsBlocks = hasCmsSpecimenBlocks(blocks);
  const useLive = live && !cmsBlocks && hasDropSpecimenLive(slug);

  if (variant === "hero") {
    if (useLive && hasDropSpecimenLiveHero(slug)) {
      return (
        <section className="drops-specimen-hero" aria-label="Specimen hero">
          <DropSpecimenLiveHero slug={slug} locale={locale} />
        </section>
      );
    }

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
      {gallery.map((item, index) =>
        useLive && isLiveGalleryIndex(slug, index) ? (
          <DropSpecimenLiveBlock
            key={`live-${slug}-${index}`}
            slug={slug}
            index={index}
            locale={locale}
          />
        ) : (
          <SpecimenImage key={item.src} src={item.src} alt={item.alt} />
        ),
      )}
    </section>
  );
}
