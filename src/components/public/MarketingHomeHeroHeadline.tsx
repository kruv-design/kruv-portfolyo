import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";

function HeroHeadlineLines({
  line1,
  line2,
  mainFirst,
  variant,
}: {
  line1: string;
  line2: string;
  mainFirst: boolean;
  variant: "desktop" | "mobile";
}) {
  return (
    <span className={`hero-v2-headline__set hero-v2-headline__set--${variant}`}>
      <span
        className={`hero-v2-headline__line ${mainFirst ? "hero-v2-headline__main" : "hero-v2-headline__accent"}`}
      >
        {line1}
      </span>
      <span
        className={`hero-v2-headline__line ${mainFirst ? "hero-v2-headline__accent" : "hero-v2-headline__main"}`}
      >
        {line2}
      </span>
    </span>
  );
}

/** Figma Hero — başlık + scroll oku; showreel üstünde. */
export function MarketingHomeHeroHeadline({
  messages,
  scrollHref = "#hero-showreel",
}: {
  locale: Locale;
  messages: Messages;
  scrollHref?: string;
}) {
  const hero = messages.home.hero;
  const mainFirst = hero.lineOrder === "main-first";
  const mobileLine1 = hero.mobileLine1;
  const mobileLine2 = hero.mobileLine2;
  const hasMobileCopy = Boolean(mobileLine1 && mobileLine2);

  return (
    <div className="hero-v2-head hero-v2-head--figma">
      <h1
        id="hero-v2-headline"
        className={[
          "hero-v2-headline",
          "hero-v2-headline--figma",
          hasMobileCopy ? "hero-v2-headline--has-mobile-copy" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <HeroHeadlineLines
          line1={hero.line1}
          line2={hero.line2}
          mainFirst={mainFirst}
          variant="desktop"
        />
        {hasMobileCopy ? (
          <HeroHeadlineLines
            line1={mobileLine1!}
            line2={mobileLine2!}
            mainFirst={mainFirst}
            variant="mobile"
          />
        ) : null}
      </h1>
      <a
        className="hero-v2-scroll-cta"
        href={scrollHref}
        aria-label={hero.cursorLabel}
      >
        <img
          className="hero-v2-scroll-cta__icon"
          src="/assets/hero-scroll-arrow.svg"
          width={66}
          height={66}
          alt=""
          aria-hidden
          decoding="async"
        />
      </a>
    </div>
  );
}
