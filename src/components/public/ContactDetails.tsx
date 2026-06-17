import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";

/** “Başlayalım” bölümü — e-posta, telefon ve WhatsApp CTA. */
export function ContactDetails({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  const d = messages.contact.details;
  return (
    <section className="contact-section" aria-labelledby="contact-details-title" lang={locale}>
      <h2 id="contact-details-title" className="contact-section-title">
        {d.title}
      </h2>
      <div className="contact-section-body">
        <p className="contact-section-line">
          <a href={`mailto:${d.email}`} className="contact-section-link">
            {d.email}
          </a>
        </p>
        <p className="contact-section-line">
          <a href={`tel:${d.phoneTel}`} className="contact-section-link">
            {d.phone}
          </a>
        </p>
      </div>
      <a
        href={d.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="contact-whatsapp-btn"
      >
        {d.whatsappCta}
      </a>
    </section>
  );
}
