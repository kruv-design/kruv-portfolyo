import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";
import { loadHeroV2Html, type HeroV2Options } from "@/lib/marketing-hero";
import { MarketingHeroMount } from "./MarketingHeroMount";

/** `public/partials/hero-v2.html` — anasayfa ile birebir aynı hero. */
export async function MarketingHero({
  locale,
  messages,
  ...options
}: HeroV2Options & {
  locale: Locale;
  messages: Messages;
}) {
  const hero = messages.home.hero;
  const html = await loadHeroV2Html({
    ...options,
    copy: {
      lang: locale,
      staticLine: hero.static,
      word: hero.word,
      suffix: hero.suffix,
      cursorLabel: hero.cursorLabel,
      mobileCta: hero.mobileCta,
      mobileCtaA11y: hero.mobileCtaA11y,
    },
  });

  return <MarketingHeroMount html={html} locale={locale} />;
}
