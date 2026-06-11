import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";
import { homeIllustrationSrc } from "@/lib/home-illustrations";
import { MarketingHomeSectionTag } from "./MarketingHomeSectionTag";

/** Figma “Kime hitap ediyoruz” — 2×2 bordered grid (mobil: stack). */
export function MarketingHomeValues({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  const copy = messages.home.values;

  return (
    <section
      className="home-values"
      id="audience"
      lang={locale}
      aria-labelledby="home-values-heading"
    >
      <div className="home-values__inner">
        <header className="home-values__header">
          <MarketingHomeSectionTag>
            <span id="home-values-heading">{copy.tagLabel}</span>
          </MarketingHomeSectionTag>
        </header>

        <ul className="home-values__grid" aria-label={copy.ariaLabel}>
          {copy.items.map((item, index) => (
            <li key={item.index} className="home-values__card">
              <span className="home-values__icon">
                <img
                  src={homeIllustrationSrc(index)}
                  width={99}
                  height={154}
                  alt=""
                  aria-hidden
                />
              </span>
              <div className="home-values__card-copy">
                <h3 className="home-values__card-title">{item.title}</h3>
                <p className="home-values__card-body">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
