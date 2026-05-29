import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";
import { loadHeroV2Html, type HeroV2Options } from "@/lib/marketing-hero";
import { MarketingHeroEffects } from "./MarketingHeroEffects";

/** `public/partials/hero-v2.html` — anasayfa ile birebir aynı hero. */
export async function MarketingHero({
  locale,
  messages,
  ...options
}: HeroV2Options & {
  locale: Locale;
  messages: Messages;
}) {
  const html = await loadHeroV2Html({
    ctaHref: "/tr/works",
    cursorLabel: messages.home.hero.cursorLabel,
    ...options,
  });

  return (
    <>
      <div
        className="marketing-hero-mount"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <MarketingHeroEffects locale={locale} />
    </>
  );
}
