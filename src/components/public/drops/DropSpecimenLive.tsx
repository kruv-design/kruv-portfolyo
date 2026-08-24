import {
  publicCldImageSrcSetKnockoutWhite,
  publicCldImageUrlKnockoutWhite,
} from "@/lib/cld-public";
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
    >
      <div className="drops-live-marzano-hero__top">
        <p className="drops-live-marzano-hero__title">
          {normalizeDropFontText("TOMATO", "marzano", locale)}
        </p>
        <p className="drops-live-marzano-hero__numbers">{DROP_ALPHABET_NUMBERS}</p>
      </div>
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

function CoveHeroLive({ locale = "tr" }: { locale?: Locale }) {
  void locale;
  const title = normalizeDropFontText(
    "Born from pebbles, simple and cool.",
    "cove",
    "en",
  );
  return (
    <DropSpecimenOverlay
      photoId={DROP_LIVE_PHOTOS.cove.heroWater}
      alt="Cove — water ripple"
      className="drops-live-overlay--cove-hero"
      scrim="dark"
    >
      <p className="drops-live-cove-hero__title drops-drop-type" lang="en">
        {title}
      </p>
    </DropSpecimenOverlay>
  );
}

function MarzanoFluidBlock() {
  return (
    <article className="drops-live-block drops-live-block--fluid" lang="en">
      <div className="drops-live-block__copy">
        <div className="drops-live-display drops-live-display--marzano" aria-label="fluid moments">
          <p className="drops-live-display__line">FLUID </p>
          <p className="drops-live-display__line drops-live-display__line--tight">MOMENTS.</p>
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
    <article className="drops-live-block drops-live-block--homemade" lang="en">
      <div className="drops-live-stagger drops-live-display drops-live-display--marzano drops-live-stagger--homemade" aria-label="homemade pasta with olive">
        <p>homemade</p>
        <p>pasta</p>
        <p>with</p>
        <p>olive</p>
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
  const row1 = normalizeDropFontText(
    "A B C Ç D E F G Ğ H I İ J K L M N",
    "local",
    locale,
  );
  const row2 = normalizeDropFontText(
    "O Ö P R S Ş T U Ü V Y Z",
    "local",
    locale,
  );
  return (
    <DropSpecimenOverlay
      photoId={DROP_LIVE_PHOTOS.local.alphabetBg}
      alt="Local alphabet specimen"
      className="drops-live-overlay--local-alphabet"
      scrim="dark"
    >
      <p className="drops-live-local-alphabet" aria-label={`${row1} ${row2}`}>
        <span className="drops-live-local-alphabet__row">{row1}</span>
        <span className="drops-live-local-alphabet__row">{row2}</span>
      </p>
    </DropSpecimenOverlay>
  );
}

function LocalWineLive({ locale = "tr" }: { locale?: Locale }) {
  const line1 = normalizeDropFontText("The silent melody", "local", locale);
  const line2 = normalizeDropFontText("of the earth", "local", locale);
  return (
    <DropSpecimenOverlay
      photoId={DROP_LIVE_PHOTOS.local.wineBox}
      alt="Local wine box mockup"
      className="drops-live-overlay--local-wine"
    >
      <p className="drops-live-wine-caption" aria-label={`${line1} ${line2}`}>
        <span>{line1}</span>
        <span>{line2}</span>
      </p>
    </DropSpecimenOverlay>
  );
}

function CoveCollageLive() {
  const publicId = "kruv-drops/specimens/cove/02-collage";
  return (
    <figure className="drops-live-photo drops-live-collage">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={publicCldImageUrlKnockoutWhite(publicId, 2)}
        srcSet={publicCldImageSrcSetKnockoutWhite(publicId) || undefined}
        alt="Cove — softest form of nature"
        loading="lazy"
        decoding="async"
      />
    </figure>
  );
}

function CovePebblesBlock({ locale = "tr" }: { locale?: Locale }) {
  const pangram = normalizeDropFontText(
    "Pijamalı hasta yağız şoföre çabucak güvendi.",
    "cove",
    locale,
  );
  return (
    <article className="drops-live-block drops-live-block--pebbles">
      <p className="drops-live-display drops-live-display--cove drops-live-pebbles">
        {pangram}
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
  /* Local alphabet: landscape canlı bloğu (portre bg kırpılır) */
  if (slug === "local") return index === 1 || index === 3;
  if (slug === "cove") return index === 0 || index === 1 || index === 2;
  return false;
}

export function DropSpecimenLiveHero({ slug, locale = "tr" }: Props) {
  if (slug === "marzano") return <MarzanoHeroLive locale={locale} />;
  if (slug === "local") return <LocalHeroLive locale={locale} />;
  if (slug === "cove") return <CoveHeroLive locale={locale} />;
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
    if (index === 0) return <CovePebblesBlock locale={locale} />;
    if (index === 1) return <CoveCollageLive />;
    if (index === 2) return <CoveCapAlphabetLive locale={locale} />;
  }
  return null;
}
