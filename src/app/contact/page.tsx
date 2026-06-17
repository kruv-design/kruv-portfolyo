import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DEFAULT_SITE_SETTINGS, getSettings } from "@/lib/queries";
import { ENABLE_PUBLIC_CONTACT } from "@/lib/marketing-flags";
import { withLocale } from "@/lib/i18n/path";
import { MarketingSiteNav } from "@/components/public/MarketingSiteNav";
import { MarketingPageShell } from "@/components/public/MarketingPageShell";
import { ContactForm } from "@/components/public/ContactForm";
import { ContactDetails } from "@/components/public/ContactDetails";
import { ContactAddresses } from "@/components/public/ContactAddresses";
import { ContactSocials } from "@/components/public/ContactSocials";
import { SiteFooter } from "@/components/public/SiteFooter";
import { getMessages } from "@/lib/i18n/get-messages";

const messages = getMessages("tr");

export const metadata: Metadata = ENABLE_PUBLIC_CONTACT
  ? {
      title: messages.contact.metaTitle,
      description: messages.contact.metaDescription,
      openGraph: {
        title: messages.contact.metaTitle,
        description: messages.contact.metaDescription,
        images: [{ url: "/og/og-contact-tr.png", width: 1200, height: 630 }],
      },
      twitter: {
        card: "summary_large_image",
        title: messages.contact.metaTitle,
        description: messages.contact.metaDescription,
        images: ["/og/og-contact-tr.png"],
      },
    }
  : {};

export const revalidate = 60;

export default async function ContactPage() {
  const locale = "tr";

  if (!ENABLE_PUBLIC_CONTACT) {
    redirect(withLocale("/works", locale));
  }
  const messages = getMessages(locale);
  const settings = await getSettings().catch(() => DEFAULT_SITE_SETTINGS);

  return (
    <MarketingPageShell className="flex min-h-screen flex-col" style={{ background: "var(--bg)" }}>
      <MarketingSiteNav settings={settings} locale={locale} messages={messages} />
      <main className="contact-page-main">
        <ContactForm locale={locale} messages={messages} />
        <ContactDetails locale={locale} messages={messages} />
        <ContactAddresses locale={locale} messages={messages} />
        <ContactSocials settings={settings} messages={messages} />
      </main>
      <SiteFooter settings={settings} locale={locale} messages={messages} />
    </MarketingPageShell>
  );
}
