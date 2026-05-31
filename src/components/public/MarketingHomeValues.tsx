import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";

type ValueIcon = "focus" | "dialog" | "layers" | "motion";

const VALUE_ICONS: ValueIcon[] = ["focus", "dialog", "layers", "motion"];

function ValueIconSvg({ name }: { name: ValueIcon }) {
  const common = {
    width: 48,
    height: 48,
    viewBox: "0 0 48 48",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true as const,
  };

  switch (name) {
    case "focus":
      return (
        <svg {...common}>
          <path
            d="M24 8L38 36H10L24 8Z"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
          <circle cx="24" cy="28" r="4.5" stroke="currentColor" strokeWidth="1.25" />
        </svg>
      );
    case "dialog":
      return (
        <svg {...common}>
          <path
            d="M12 18C12 14.6863 14.6863 12 18 12H30C33.3137 12 36 14.6863 36 18V26C36 29.3137 33.3137 32 30 32H22L14 38V32H18C14.6863 32 12 29.3137 12 26V18Z"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
          <path d="M18 20H30" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
          <path d="M18 24H26" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        </svg>
      );
    case "layers":
      return (
        <svg {...common}>
          <circle cx="20" cy="22" r="10" stroke="currentColor" strokeWidth="1.25" />
          <circle cx="28" cy="26" r="10" stroke="currentColor" strokeWidth="1.25" />
        </svg>
      );
    case "motion":
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="1.25" />
          <circle cx="24" cy="24" r="12" stroke="currentColor" strokeWidth="1.25" />
          <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1.25" />
        </svg>
      );
  }
}

/** Anasayfa showreel sonrası — hedef müşteri tipleri (journey focus-list: sıfır, ölçek, görünürlük, yenileme). */
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
              <span className="home-values__index">({item.index})</span>
              <span className="home-values__icon">
                <ValueIconSvg name={VALUE_ICONS[index] ?? "focus"} />
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
