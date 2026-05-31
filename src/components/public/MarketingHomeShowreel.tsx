import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";
import { t } from "@/lib/i18n/t";
import {
  resolveShowreelPosterUrl,
  resolveShowreelVideoUrl,
  type ShowreelLayout,
} from "@/lib/project-images";
import type { SiteSettings } from "@/types";
import { MarketingHomeShowreelPlayer } from "./MarketingHomeShowreelPlayer";

type ShowreelSlot = {
  posterSrc: string;
  videoSrc: string | null;
};

function buildShowreelSlot(
  posterRaw: string,
  videoRaw: string,
  layout: ShowreelLayout,
): ShowreelSlot | null {
  const posterSrc = resolveShowreelPosterUrl(posterRaw.trim(), layout);
  if (!posterSrc) return null;
  const video = videoRaw.trim();
  const videoSrc = video
    ? resolveShowreelVideoUrl(video, layout) || null
    : null;
  return { posterSrc, videoSrc };
}

function ShowreelVariant({
  slot,
  className,
  playLabel,
  errorLabel,
  openVideoLabel,
  layout,
}: {
  slot: ShowreelSlot;
  className: string;
  playLabel: string;
  errorLabel: string;
  openVideoLabel: string;
  layout: ShowreelLayout;
}) {
  return (
    <div className={className} data-showreel-layout={layout}>
      <div className="home-showreel__inner">
        <MarketingHomeShowreelPlayer
          posterSrc={slot.posterSrc}
          videoSrc={slot.videoSrc}
          playLabel={playLabel}
          errorLabel={errorLabel}
          openVideoLabel={openVideoLabel}
        />
      </div>
    </div>
  );
}

/** Anasayfa hero altı — poster LCP; tıklayınca sessiz loop (site_settings). */
export function MarketingHomeShowreel({
  settings,
  locale,
  messages,
}: {
  settings: SiteSettings;
  locale: Locale;
  messages: Messages;
}) {
  const web = buildShowreelSlot(
    settings.homeVideoPoster ?? "",
    settings.homeVideo ?? "",
    "landscape",
  );

  const mobile = buildShowreelSlot(
    settings.homeVideoPosterMobile ?? "",
    settings.homeVideoMobile ?? "",
    "portrait",
  );

  if (!web && !mobile) return null;

  const playLabel = t(messages, "home.showreel.play", "Play video");
  const errorLabel = t(
    messages,
    "home.showreel.playError",
    "Video failed to load — check the URL.",
  );
  const openVideoLabel = t(messages, "home.showreel.openVideo", "Open video");

  return (
    <section
      className="home-showreel"
      lang={locale}
      aria-label={t(messages, "home.showreel.ariaLabel", "Showreel video")}
    >
      {web ? (
        <ShowreelVariant
          slot={web}
          className="home-showreel__variant home-showreel__variant--web"
          playLabel={playLabel}
          errorLabel={errorLabel}
          openVideoLabel={openVideoLabel}
          layout="landscape"
        />
      ) : null}
      {mobile ? (
        <ShowreelVariant
          slot={mobile}
          className="home-showreel__variant home-showreel__variant--mobile"
          playLabel={playLabel}
          errorLabel={errorLabel}
          openVideoLabel={openVideoLabel}
          layout="portrait"
        />
      ) : null}
    </section>
  );
}
