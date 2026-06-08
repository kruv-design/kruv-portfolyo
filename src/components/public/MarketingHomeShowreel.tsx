import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";
import { resolveHomeShowreelSlots } from "@/lib/home-showreel";
import { t } from "@/lib/i18n/t";
import type { SiteSettings } from "@/types";
import { MarketingHomeShowreelResponsive } from "./MarketingHomeShowreelResponsive";

/** @deprecated Ayrı bant — anasayfada `MarketingHomeHero` içinde kullanılıyor. */
export function MarketingHomeShowreel({
  settings,
  locale,
  messages,
}: {
  settings: SiteSettings;
  locale: Locale;
  messages: Messages;
}) {
  const { web, mobile, webOnly } = resolveHomeShowreelSlots(settings);

  if (!web && !mobile) return null;

  const playLabel = t(messages, "home.showreel.play", "Play showreel");
  const playCtaLabel = t(messages, "home.showreel.playCta", "play showreel");
  const errorLabel = t(
    messages,
    "home.showreel.playError",
    "Video failed to load — check the URL.",
  );
  const openVideoLabel = t(messages, "home.showreel.openVideo", "Open video");
  const muteLabel = t(messages, "home.showreel.mute", "Mute sound");
  const unmuteLabel = t(messages, "home.showreel.unmute", "Unmute sound");

  return (
    <section
      className="home-showreel"
      lang={locale}
      aria-label={t(messages, "home.showreel.ariaLabel", "Showreel video")}
    >
      <MarketingHomeShowreelResponsive
        web={web}
        mobile={mobile}
        webOnly={webOnly}
        playLabel={playLabel}
        playCtaLabel={playCtaLabel}
        errorLabel={errorLabel}
        openVideoLabel={openVideoLabel}
        muteLabel={muteLabel}
        unmuteLabel={unmuteLabel}
      />
    </section>
  );
}
