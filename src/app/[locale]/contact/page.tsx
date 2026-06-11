import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DEFAULT_SITE_SETTINGS, getSettings } from "@/lib/queries";
import { ENABLE_PUBLIC_CONTACT } from "@/lib/marketing-flags";
import { withLocale } from "@/lib/i18n/path";
import { MarketingSiteNav } from "@/components/public/MarketingSiteNav";
import { MarketingPageShell } from "@/components/public/MarketingPageShell";
import { ContactForm } from "@/components/public/ContactForm";
import { SiteFooter } from "@/components/public/SiteFooter";
import { getMessages } from "@/lib/i18n/get-messages";
import { t } from "@/lib/i18n/t";
import type { Locale } from "@/lib/i18n/config";
import { JsonLd } from "@/components/seo/JsonLd";
import { env } from "@/lib/env";
import { buildBreadcrumbSchema, buildContactPointSchema } from "@/lib/seo/structured-data";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  if (!ENABLE_PUBLIC_CONTACT) return {};

  const { locale } = await params;
  const messages = getMessages(locale);
  const title = t(messages, "contact.metaTitle");
  const description = t(messages, "contact.metaDescription");

  return {
    title,
    description,
    alternates: {
      canonical: `${env.SITE_URL}/${locale}/contact`,
      languages: {
        "tr-TR": `${env.SITE_URL}/tr/contact`,
        en: `${env.SITE_URL}/en/contact`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${env.SITE_URL}/${locale}/contact`,
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  if (!ENABLE_PUBLIC_CONTACT) {
    redirect(withLocale("/works", locale));
  }

  const settings = await getSettings().catch(() => DEFAULT_SITE_SETTINGS);
  const messages = getMessages(locale);

  const contactTitle = t(messages, "contact.metaTitle");

  return (
    <MarketingPageShell className="flex min-h-screen flex-col" style={{ background: "var(--bg)" }}>
      <JsonLd
        data={[
          buildBreadcrumbSchema([
            { name: messages.footer.home, path: withLocale("/", locale) },
            { name: contactTitle, path: withLocale("/contact", locale) },
          ]),
          buildContactPointSchema({ locale }),
        ]}
      />
      <MarketingSiteNav settings={settings} locale={locale} messages={messages} />
      <main className="contact-page-main">
        <ContactForm locale={locale} messages={messages} />
      </main>
      <SiteFooter settings={settings} locale={locale} messages={messages} />
    </MarketingPageShell>
  );
}
