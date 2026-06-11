import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";

const REPEAT = 2;

/** Figma “Kayan yazı” — tek satır sonsuz marquee + ikon ayırıcı. */
export function MarketingHomeKayanYazi({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  const copy = messages.home.kayanYazi;

  return (
    <section
      className="home-kayan-yazi"
      lang={locale}
      aria-label={copy.ariaLabel}
    >
      <div className="home-kayan-yazi__bleed">
        <div className="home-kayan-yazi__track">
          {Array.from({ length: REPEAT }, (_, seq) => (
            <div key={seq} className="home-kayan-yazi__sequence" aria-hidden={seq > 0}>
              {copy.phrases.map((phrase) => (
                <span key={`${seq}-${phrase}`} className="home-kayan-yazi__piece">
                  <span className="home-kayan-yazi__phrase">{phrase}</span>
                  <span className="home-kayan-yazi__sep" aria-hidden="true" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
