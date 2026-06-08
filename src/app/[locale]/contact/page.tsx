import type { Metadata } from "next";
import { DEFAULT_SITE_SETTINGS, getSettings } from "@/lib/queries";
import { MarketingSiteNav } from "@/components/public/MarketingSiteNav";
import { MarketingPageShell } from "@/components/public/MarketingPageShell";
import { ContactForm } from "@/components/public/ContactForm";
import { SiteFooter } from "@/components/public/SiteFooter";
import { getMessages } from "@/lib/i18n/get-messages";
import { t } from "@/lib/i18n/t";
import type { Locale } from "@/lib/i18n/config";
import { env } from "@/lib/env";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = getMessages(locale);
  return {
    title: t(messages, "contact.metaTitle"),
    description: t(messages, "contact.metaDescription"),
    alternates: {
      canonical: `${env.SITE_URL}/${locale}/contact`,
      languages: {
        "tr-TR": `${env.SITE_URL}/tr/contact`,
        en: `${env.SITE_URL}/en/contact`,
      },
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const settings = await getSettings().catch(() => DEFAULT_SITE_SETTINGS);
  const messages = getMessages(locale);

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
