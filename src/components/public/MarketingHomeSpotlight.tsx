import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";

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
              {copy.titleSegments.map((segment, index) =>
                segment.type === "accent" ? (
                  <span key={index} className="home-spotlight__accent">
                    {segment.value}
                  </span>
                ) : (
                  <span key={index}>{segment.value}</span>
                ),
              )}
            </h2>
          </div>
          <div className="home-spotlight__ribbons" aria-hidden="true">
            {copy.ribbons.map((ribbon) => (
              <span
                key={ribbon.variant}
                className={`home-spotlight__ribbon home-spotlight__ribbon--${ribbon.variant}`}
              >
                {ribbon.label}
              </span>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
