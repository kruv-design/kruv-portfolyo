import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";
import { t } from "@/lib/i18n/t";
import {
  resolveProjectImageUrl,
  resolveProjectVideoUrl,
} from "@/lib/project-images";
import type { SiteSettings } from "@/types";
import { ProjectDetailMedia } from "./ProjectDetailMedia";

/** Anasayfa hero altı — poster LCP; video lazy (site_settings). */
export function MarketingHomeShowreel({
  settings,
  locale,
  messages,
}: {
  settings: SiteSettings;
  locale: Locale;
  messages: Messages;
}) {
  const posterSrc = resolveProjectImageUrl(settings.homeVideoPoster ?? "");
  if (!posterSrc) return null;

  const videoRaw = settings.homeVideo?.trim() ?? "";
  const videoSrc = videoRaw ? resolveProjectVideoUrl(videoRaw) || null : null;

  return (
    <section
      className="home-showreel"
      lang={locale}
      aria-label={t(messages, "home.showreel.ariaLabel", "Showreel video")}
    >
      <div className="home-showreel__inner">
        <ProjectDetailMedia
          posterSrc={posterSrc}
          videoSrc={videoSrc}
          alt=""
          variant="gallery"
        />
      </div>
    </section>
  );
}
