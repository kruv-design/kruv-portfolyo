import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";
import { homeIllustrationSrc } from "@/lib/home-illustrations";

/** Anasayfa hero sonrası — hedef müşteri tipleri (journey focus-list: sıfır, ölçek, görünürlük, yenileme). */
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
          <h2 id="home-values-heading" className="home-values__title">
            {copy.title}
          </h2>
          <p className="home-values__lead">{copy.lead}</p>
        </header>

        <ul className="home-values__grid" aria-label={copy.ariaLabel}>
          {copy.items.map((item, index) => (
            <li key={item.index} className="home-values__card">
              <span className="home-values__icon">
                <img
                  src={homeIllustrationSrc(index)}
                  width={80}
                  height={120}
                  alt=""
                  aria-hidden
                />
              </span>
              <h3 className="home-values__card-title">{item.title}</h3>
              <p className="home-values__card-body">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
