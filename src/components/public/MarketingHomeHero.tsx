import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";
import { resolveHomeShowreelSlots } from "@/lib/home-showreel";
import {
  loadHeroV2InnerHtml,
  type HeroV2Options,
} from "@/lib/marketing-hero";
import type { SiteSettings } from "@/types";
import { MarketingHomeHeroShowreel } from "./MarketingHomeHeroShowreel";
import { MarketingHeroMount } from "./MarketingHeroMount";

/** Üstte showreel, altta tipografi — tek `#hero` (üst üste bindirme yok). */
export async function MarketingHomeHero({
  settings,
  locale,
  messages,
  ...options
}: HeroV2Options & {
  settings: SiteSettings;
  locale: Locale;
  messages: Messages;
}) {
  const hero = messages.home.hero;
  const innerHtml = await loadHeroV2InnerHtml({
    ...options,
    copy: {
      lang: locale,
      line1: hero.line1,
      line2: hero.line2,
      line2Tail: hero.line2Tail,
      lineOrder:
        hero.lineOrder === "main-first" ? "main-first" : "accent-first",
    },
  });

  const { web, mobile } = resolveHomeShowreelSlots(settings);
  const hasShowreel = Boolean(web || mobile);

  return (
    <section
      id="hero"
      className={`hero-v2 hero-v2--static${hasShowreel ? " hero-v2--has-showreel" : ""}`}
      data-scroll-target="works"
      data-scroll-href={options.scrollHref ?? options.ctaHref ?? "#works"}
      data-cta-href={options.ctaHref ?? "/works"}
      lang={locale}
      aria-labelledby="hero-v2-headline"
    >
      {hasShowreel ? (
        <MarketingHomeHeroShowreel
          settings={settings}
          locale={locale}
          messages={messages}
        />
      ) : null}
      <div className={hasShowreel ? "hero-v2-copy" : undefined}>
        <MarketingHeroMount innerHtml={innerHtml} locale={locale} />
      </div>
    </section>
  );
}
