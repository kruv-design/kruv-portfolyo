import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";

/** “Adres” bölümü — iki ofis (İstanbul + İzmir). */
export function ContactAddresses({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  const a = messages.contact.address;
  return (
    <section className="contact-section" aria-labelledby="contact-address-title" lang={locale}>
      <h2 id="contact-address-title" className="contact-section-title">
        {a.title}
      </h2>
      <address className="contact-section-body contact-address-body">
        {a.entries.map((entry) => (
          <p key={entry.highlight} className="contact-section-line">
            {entry.line}
            <span className="contact-address-highlight">{entry.highlight}</span>
          </p>
        ))}
      </address>
    </section>
  );
}
