import type { Metadata } from "next";
import { DEFAULT_SITE_SETTINGS, getSettings } from "@/lib/queries";
import { MarketingSiteNav } from "@/components/public/MarketingSiteNav";
import { MarketingPageShell } from "@/components/public/MarketingPageShell";
import { ContactForm } from "@/components/public/ContactForm";
import { SiteFooter } from "@/components/public/SiteFooter";
import { getMessages } from "@/lib/i18n/get-messages";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Proje teklifi ve iş birliği talepleri için iletişim formu.",
};

export const revalidate = 60;

export default async function ContactPage() {
  const locale = "tr";
  const messages = getMessages(locale);
  const settings = await getSettings().catch(() => DEFAULT_SITE_SETTINGS);

  return (
    <MarketingPageShell className="flex min-h-screen flex-col" style={{ background: "var(--bg)" }}>
      <MarketingSiteNav settings={settings} locale={locale} messages={messages} />
      <main className="contact-page-main">
        <ContactForm locale={locale} messages={messages} />
      </main>
      <SiteFooter settings={settings} locale={locale} messages={messages} />
    </MarketingPageShell>
  );
}
