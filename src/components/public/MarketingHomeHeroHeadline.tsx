import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";

/** Figma Hero — başlık + scroll oku; showreel üstünde. */
export function MarketingHomeHeroHeadline({
  messages,
  scrollHref = "#works",
}: {
  locale: Locale;
  messages: Messages;
  scrollHref?: string;
}) {
  const hero = messages.home.hero;

  return (
    <div className="hero-v2-head hero-v2-head--figma">
      <h1 id="hero-v2-headline" className="hero-v2-headline hero-v2-headline--figma">
        <span className="hero-v2-headline__accent">{hero.line1}</span>{" "}
        <span className="hero-v2-headline__main">{hero.line2}</span>
      </h1>
      <a
        className="hero-v2-scroll-cta"
        href={scrollHref}
        aria-label={hero.cursorLabel}
      >
        <span className="hero-v2-scroll-cta__icon" aria-hidden="true" />
      </a>
    </div>
  );
}
