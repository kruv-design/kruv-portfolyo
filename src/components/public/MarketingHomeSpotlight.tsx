import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";
import { withLocale } from "@/lib/i18n/path";
import {
  HOME_SPOTLIGHT_BADGES,
  type HomeSpotlightBadgeVariant,
} from "@/lib/home-spotlight-badges";
import { MarketingHomeSectionTag } from "./MarketingHomeSectionTag";

/** Anasayfa showreel sonrası — Behance öne çıkanlar kartı (Figma). */
export function MarketingHomeSpotlight({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  const copy = messages.home.spotlight;

  return (
    <section
      className="home-spotlight"
      id="platform-spotlight"
      lang={locale}
      aria-label={copy.ariaLabel}
    >
      <div className="home-spotlight__inner">
        <article className="home-spotlight__card">
          <div className="home-spotlight__content">
            <MarketingHomeSectionTag>{copy.tagLabel}</MarketingHomeSectionTag>
            <h2 className="home-spotlight__title">
              {copy.titleLines.map((line, lineIndex) => (
                <span key={lineIndex} className="home-spotlight__title-line">
                  {line.map((segment, index) =>
                    segment.type === "accent" ? (
                      <span key={index} className="home-spotlight__accent">
                        {segment.value}
                      </span>
                    ) : (
                      <span key={index}>{segment.value}</span>
                    ),
                  )}
                </span>
              ))}
            </h2>
            <Link
              href={withLocale(copy.ctaHref, locale)}
              className="home-spotlight__cta"
            >
              <span>{copy.ctaLabel}</span>
              <span className="home-spotlight__cta-icon" aria-hidden="true" />
            </Link>
          </div>
          <div className="home-spotlight__badges" aria-hidden="true">
            {copy.ribbons.map((ribbon) => {
              const variant = ribbon.variant as HomeSpotlightBadgeVariant;
              return (
                <img
                  key={variant}
                  className="home-spotlight__badge"
                  src={HOME_SPOTLIGHT_BADGES[variant]}
                  width={78}
                  height={134}
                  alt=""
                  decoding="async"
                />
              );
            })}
          </div>
        </article>
      </div>
    </section>
  );
}
