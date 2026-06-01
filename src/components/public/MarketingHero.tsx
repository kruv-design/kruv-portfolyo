import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";
import { DEFAULT_SITE_SETTINGS } from "@/lib/queries";
import type { HeroV2Options } from "@/lib/marketing-hero";
import type { SiteSettings } from "@/types";
import { MarketingHomeHero } from "./MarketingHomeHero";

/** Anasayfa hero — video arka plan + tipografi (`MarketingHomeHero`). */
export function MarketingHero({
  settings = DEFAULT_SITE_SETTINGS,
  locale,
  messages,
  ...options
}: HeroV2Options & {
  settings?: SiteSettings;
  locale: Locale;
  messages: Messages;
}) {
  return (
    <MarketingHomeHero
      settings={settings}
      locale={locale}
      messages={messages}
      {...options}
    />
  );
}
