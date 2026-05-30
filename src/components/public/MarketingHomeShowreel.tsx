import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";
import { t } from "@/lib/i18n/t";
import {
  resolveProjectImageUrl,
  resolveProjectVideoUrl,
} from "@/lib/project-images";
import type { SiteSettings } from "@/types";
import { ProjectDetailMedia } from "./ProjectDetailMedia";

type ShowreelSlot = {
  posterSrc: string;
  videoSrc: string | null;
};

function buildShowreelSlot(posterRaw: string, videoRaw: string): ShowreelSlot | null {
  const posterSrc = resolveProjectImageUrl(posterRaw.trim());
  if (!posterSrc) return null;
  const video = videoRaw.trim();
  const videoSrc = video ? resolveProjectVideoUrl(video) || null : null;
  return { posterSrc, videoSrc };
}

function ShowreelVariant({
  slot,
  className,
  playLabel,
}: {
  slot: ShowreelSlot;
  className: string;
  playLabel: string;
}) {
  return (
    <div className={className}>
      <div className="home-showreel__inner">
        <ProjectDetailMedia
          posterSrc={slot.posterSrc}
          videoSrc={slot.videoSrc}
          alt=""
          variant="gallery"
          playback="click"
          playLabel={playLabel}
        />
      </div>
    </div>
  );
}

/** Anasayfa hero altı — web / mobil ayrı poster+video (site_settings). */
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
  );

  const mobile = buildShowreelSlot(
    settings.homeVideoPosterMobile ?? "",
    settings.homeVideoMobile ?? "",
  );

  if (!web && !mobile) return null;

  const playLabel = t(messages, "home.showreel.play", "Play video");

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
        />
      ) : null}
      {mobile ? (
        <ShowreelVariant
          slot={mobile}
          className="home-showreel__variant home-showreel__variant--mobile"
          playLabel={playLabel}
        />
      ) : null}
    </section>
  );
}
