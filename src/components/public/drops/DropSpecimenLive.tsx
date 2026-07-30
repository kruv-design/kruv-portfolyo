import { resolveDropImageSrcSet, resolveDropImageUrl } from "@/lib/drops-specimen-assets";
import { DROP_LIVE_PHOTOS, DROP_LIVE_VECTORS } from "@/lib/drops-live-assets";
import {
  DROP_ALPHABET_COVE,
  DROP_ALPHABET_COVE_NUMBERS,
  DROP_ALPHABET_NUMBERS,
  DROP_ALPHABET_UPPER,
} from "@/lib/drops-alphabet";
import { normalizeDropFontText } from "@/lib/drops-font-assets";
import { DropSpecimenOverlay } from "./DropSpecimenOverlay";
import { MarzanoPhoneMockup } from "./MarzanoPhoneMockup";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  slug: string;
  locale?: Locale;
};

function LivePhoto({
  publicId,
  alt,
  className,
}: {
  publicId: string;
  alt: string;
  className?: string;
}) {
  return (
    <figure className={`drops-live-photo ${className ?? ""}`.trim()}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resolveDropImageUrl(publicId)}
        srcSet={resolveDropImageSrcSet(publicId) || undefined}
        alt={alt}
        loading="lazy"
        decoding="async"
      />
    </figure>
  );
}

function MarzanoHeroLive({ locale = "tr" }: { locale?: Locale }) {
  const alphabet = normalizeDropFontText(DROP_ALPHABET_UPPER, "marzano", locale);

  return (
    <DropSpecimenOverlay
      photoId={DROP_LIVE_PHOTOS.marzano.pizzaHero}
      alt="Marzano pizza specimen"
      className="drops-live-overlay--marzano-hero"
      scrim="dark"
      beforeContent={
        <p className="drops-live-marzano-hero__numbers">{DROP_ALPHABET_NUMBERS}</p>
      }
    >
      <p className="drops-live-marzano-hero__title">
        {normalizeDropFontText("TOMATO", "marzano", locale)}
      </p>
      <p className="drops-live-marzano-hero__alphabet">{alphabet}</p>
    </DropSpecimenOverlay>
  );
}

function LocalHeroLive({ locale = "tr" }: { locale?: Locale }) {
  return (
    <DropSpecimenOverlay
      photoId={DROP_LIVE_PHOTOS.local.hero}
      alt="Local — cool without effort"
      className="drops-live-overlay--local-hero"
    >
      <div className="drops-live-local-hero__stack">
        {["cool", "without", "effort"].map((line) => (
          <p key={line}>{normalizeDropFontText(line, "local", locale)}</p>
        ))}
      </div>
    </DropSpecimenOverlay>
  );
}

function CoveHeroLive() {
  return (
    <DropSpecimenOverlay
      photoId={DROP_LIVE_PHOTOS.cove.heroWater}
      alt="Cove — water ripple"
      className="drops-live-overlay--cove-hero"
    />
  );
}

function MarzanoFluidBlock() {
  return (
    <article className="drops-live-block drops-live-block--fluid">
      <div className="drops-live-block__copy">
        <div className="drops-live-display drops-live-display--marzano" aria-label="fluid moments">
          <p className="drops-live-display__line">fluid </p>
          <p className="drops-live-display__line drops-live-display__line--tight">moments.</p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={DROP_LIVE_VECTORS.marzano.ampersand}
          alt=""
          aria-hidden
          className="drops-live-ampersand"
          decoding="async"
        />
      </div>
      <LivePhoto
        publicId={DROP_LIVE_PHOTOS.marzano.pastaPortrait}
        alt="Pasta portrait"
        className="drops-live-block__photo drops-live-block__photo--portrait"
      />
    </article>
  );
}

function MarzanoPhoneLive({ locale = "tr" }: { locale?: Locale }) {
  return <MarzanoPhoneMockup locale={locale} />;
}

function MarzanoBagLive() {
  return (
    <LivePhoto
      publicId={DROP_LIVE_PHOTOS.marzano.bag}
      alt="Marzano — Something Saucy bag mockup"
      className="drops-live-photo drops-live-photo--bag"
    />
  );
}

function MarzanoHomemadeBlock() {
  return (
    <article className="drops-live-block drops-live-block--homemade">
      <div className="drops-live-block__row">
        <LivePhoto
          publicId={DROP_LIVE_PHOTOS.marzano.homemadePasta}
          alt="Homemade pasta"
          className="drops-live-block__photo"
        />
        <div className="drops-live-stagger drops-live-display drops-live-display--marzano drops-live-stagger--homemade" aria-label="homemade pasta with olive">
          <p>homemade</p>
          <p>pasta</p>
          <p>with</p>
          <p>olive</p>
        </div>
      </div>
      <div className="drops-live-block__row drops-live-block__row--bottom">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={DROP_LIVE_VECTORS.marzano.olives}
          alt=""
          aria-hidden
          className="drops-live-olives"
          decoding="async"
        />
        <LivePhoto
          publicId={DROP_LIVE_PHOTOS.marzano.olivePin}
          alt="Olive enamel pin on coat"
          className="drops-live-block__photo drops-live-block__photo--pin"
        />
      </div>
    </article>
  );
}

function LocalAlphabetLive({ locale = "tr" }: { locale?: Locale }) {
  const alphabet = normalizeDropFontText(DROP_ALPHABET_UPPER, "local", locale);
  return (
    <DropSpecimenOverlay
      photoId={DROP_LIVE_PHOTOS.local.alphabetBg}
      alt="Local alphabet specimen"
      className="drops-live-overlay--local-alphabet"
      scrim="dark"
    >
      <p className="drops-live-local-alphabet">{alphabet}</p>
    </DropSpecimenOverlay>
  );
}

function LocalWineLive({ locale = "tr" }: { locale?: Locale }) {
  return (
    <DropSpecimenOverlay
      photoId={DROP_LIVE_PHOTOS.local.wineBox}
      alt="Local wine box mockup"
      className="drops-live-overlay--local-wine"
    >
      <p className="drops-live-wine-caption">
        {normalizeDropFontText("The silent melody of the earth", "local", locale)}
      </p>
    </DropSpecimenOverlay>
  );
}

function CovePebblesBlock() {
  return (
    <article className="drops-live-block drops-live-block--pebbles">
      <p className="drops-live-display drops-live-display--cove drops-live-pebbles">
        Born from pebbles, simple and cool.
      </p>
    </article>
  );
}

function CoveCapAlphabetLive({ locale = "tr" }: { locale?: Locale }) {
  void locale;
  return (
    <article className="drops-live-block drops-live-block--cove-cap">
      <LivePhoto
        publicId={DROP_LIVE_PHOTOS.cove.cap}
        alt="Cove cap on beach"
        className="drops-live-block__photo drops-live-block__photo--cap"
      />
      <div className="drops-live-cove-alphabet drops-live-display drops-live-display--cove">
        <p>{DROP_ALPHABET_COVE}</p>
        <p>{DROP_ALPHABET_COVE_NUMBERS}</p>
      </div>
    </article>
  );
}

const LIVE_FONT_SLUGS = new Set(["marzano", "local", "cove"]);

/** Canlı tipografi + vektör kullanan font slug'ları */
export function hasDropSpecimenLive(slug: string): boolean {
  return LIVE_FONT_SLUGS.has(slug);
}

export function hasDropSpecimenLiveHero(slug: string): boolean {
  return LIVE_FONT_SLUGS.has(slug);
}

/** Galeri indeksine göre canlı blok mu, statik görsel mi */
export function isLiveGalleryIndex(slug: string, index: number): boolean {
  if (slug === "marzano") return index === 0 || index === 1 || index === 2 || index === 3;
  if (slug === "local") return index === 1 || index === 3;
  if (slug === "cove") return index === 0 || index === 2;
  return false;
}

export function DropSpecimenLiveHero({ slug, locale = "tr" }: Props) {
  if (slug === "marzano") return <MarzanoHeroLive locale={locale} />;
  if (slug === "local") return <LocalHeroLive locale={locale} />;
  if (slug === "cove") return <CoveHeroLive />;
  return null;
}

export function DropSpecimenLiveBlock({
  slug,
  index,
  locale = "tr",
}: Props & { index: number }) {
  if (slug === "marzano") {
    if (index === 0) return <MarzanoFluidBlock />;
    if (index === 1) return <MarzanoPhoneLive locale={locale} />;
    if (index === 2) return <MarzanoBagLive />;
    if (index === 3) return <MarzanoHomemadeBlock />;
  }
  if (slug === "local") {
    if (index === 1) return <LocalAlphabetLive locale={locale} />;
    if (index === 3) return <LocalWineLive locale={locale} />;
  }
  if (slug === "cove") {
    if (index === 0) return <CovePebblesBlock />;
    if (index === 2) return <CoveCapAlphabetLive locale={locale} />;
  }
  return null;
}
