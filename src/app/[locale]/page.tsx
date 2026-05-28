import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import { DEFAULT_SITE_SETTINGS, getSettings } from "@/lib/queries";
import { MarketingPageShell } from "@/components/public/MarketingPageShell";
import { MarketingSiteNav } from "@/components/public/MarketingSiteNav";
import { MarketingHero } from "@/components/public/MarketingHero";
import { MarketingHomeBody } from "@/components/public/MarketingHomeBody";
import { getMessages } from "@/lib/i18n/get-messages";
import { withLocale } from "@/lib/i18n/path";
import { env } from "@/lib/env";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: {
      canonical: `${env.SITE_URL}/${locale}`,
      languages: {
        "tr-TR": `${env.SITE_URL}/tr`,
        en: `${env.SITE_URL}/en`,
      },
    },
  };
}

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = getMessages(locale);
  const settings = await getSettings().catch(() => DEFAULT_SITE_SETTINGS);

  return (
    <MarketingPageShell className="flex min-h-screen flex-col">
      <MarketingSiteNav settings={settings} locale={locale} messages={messages} />
      <MarketingHero
        ctaHref={withLocale("/works", locale)}
        scrollHref="#works"
      />
      <MarketingHomeBody locale={locale} />
    </MarketingPageShell>
  );
}
