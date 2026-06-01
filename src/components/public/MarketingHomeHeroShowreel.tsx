import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";
import { resolveHomeShowreelSlots } from "@/lib/home-showreel";
import { t } from "@/lib/i18n/t";
import type { SiteSettings } from "@/types";
import { MarketingHomeShowreelPlayer } from "./MarketingHomeShowreelPlayer";

function ShowreelVariant({
  slot,
  className,
  playLabel,
  playCtaLabel,
  errorLabel,
  openVideoLabel,
}: {
  slot: { posterSrc: string; videoSrc: string | null };
  className: string;
  playLabel: string;
  playCtaLabel: string;
  errorLabel: string;
  openVideoLabel: string;
}) {
  return (
    <div className={className}>
      <MarketingHomeShowreelPlayer
        posterSrc={slot.posterSrc}
        videoSrc={slot.videoSrc}
        playLabel={playLabel}
        playCtaLabel={playCtaLabel}
        errorLabel={errorLabel}
        openVideoLabel={openVideoLabel}
      />
    </div>
  );
}

/** Hero arka planı — web / mobil showreel (site_settings). */
export function MarketingHomeHeroShowreel({
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

  return (
    <div className="hero-v2__showreel home-showreel" lang={locale}>
      {web ? (
        <ShowreelVariant
          slot={web}
          className={`home-showreel__variant home-showreel__variant--web${
            webOnly ? " home-showreel__variant--solo" : ""
          }`}
          playLabel={playLabel}
          playCtaLabel={playCtaLabel}
          errorLabel={errorLabel}
          openVideoLabel={openVideoLabel}
        />
      ) : null}
      {mobile ? (
        <ShowreelVariant
          slot={mobile}
          className="home-showreel__variant home-showreel__variant--mobile"
          playLabel={playLabel}
          playCtaLabel={playCtaLabel}
          errorLabel={errorLabel}
          openVideoLabel={openVideoLabel}
        />
      ) : null}
    </div>
  );
}
