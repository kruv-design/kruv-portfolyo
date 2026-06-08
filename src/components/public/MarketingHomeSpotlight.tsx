import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";
import {
  HOME_SPOTLIGHT_BADGES,
  type HomeSpotlightBadgeVariant,
} from "@/lib/home-spotlight-badges";

/** Anasayfa showreel sonrası — platform öne çıkanları kartı. */
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
            <ul className="home-spotlight__tags" aria-label={copy.tagsAriaLabel}>
              {copy.tags.map((tag) => (
                <li key={tag} className="b2">
                  {tag}
                </li>
              ))}
            </ul>
            <h2 className="h3 home-spotlight__title">
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
          </div>
          <div className="home-spotlight__badges" aria-hidden="true">
            {copy.ribbons.map((ribbon) => {
              const variant = ribbon.variant as HomeSpotlightBadgeVariant;
              return (
                <img
                  key={variant}
                  className="home-spotlight__badge"
                  src={HOME_SPOTLIGHT_BADGES[variant]}
                  width={58}
                  height={99}
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
