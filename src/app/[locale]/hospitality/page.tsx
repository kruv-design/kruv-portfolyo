import type { Metadata } from "next";
import { DEFAULT_SITE_SETTINGS, getSettings } from "@/lib/queries";
import { MarketingPageShell } from "@/components/public/MarketingPageShell";
import { MarketingSiteNav } from "@/components/public/MarketingSiteNav";
import { MarketingKruvStyles } from "@/components/public/MarketingKruvStyles";
import { SiteFooter } from "@/components/public/SiteFooter";
import { HospitalityPage } from "@/components/hospitality/HospitalityPage";
import { getMessages } from "@/lib/i18n/get-messages";
import { t } from "@/lib/i18n/t";
import type { Locale } from "@/lib/i18n/config";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildLocaleAlternates } from "@/lib/seo/locale-alternates";
import { buildBreadcrumbSchema } from "@/lib/seo/structured-data";
import { withLocale } from "@/lib/i18n/path";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = getMessages(locale);
  const title = t(messages, "hospitality.metaTitle");
  const description = t(messages, "hospitality.metaDescription");
  const alternates = buildLocaleAlternates("/hospitality", locale);

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      locale: locale === "tr" ? "tr_TR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function LocaleHospitalityPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const settings = await getSettings().catch(() => DEFAULT_SITE_SETTINGS);
  const messages = getMessages(locale);
  const title = t(messages, "hospitality.metaTitle");

  return (
    <MarketingPageShell className="flex min-h-screen flex-col">
      <MarketingKruvStyles />
      <link rel="stylesheet" href="/hospitality-page.css" precedence="hospitality" />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "kruv", path: withLocale("/", locale) },
          { name: title, path: withLocale("/hospitality", locale) },
        ])}
      />
      <MarketingSiteNav settings={settings} locale={locale} messages={messages} />
      <main>
        <HospitalityPage locale={locale} messages={messages} settings={settings} />
      </main>
      <SiteFooter settings={settings} locale={locale} messages={messages} />
    </MarketingPageShell>
  );
}
