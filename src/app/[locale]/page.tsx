import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import { DEFAULT_SITE_SETTINGS, getSettings } from "@/lib/queries";
import { MarketingPageShell } from "@/components/public/MarketingPageShell";
import { MarketingSiteNav } from "@/components/public/MarketingSiteNav";
import { MarketingHero } from "@/components/public/MarketingHero";
import { MarketingHomeShowreel } from "@/components/public/MarketingHomeShowreel";
import { MarketingHomeValues } from "@/components/public/MarketingHomeValues";
import { MarketingScrollMarquee } from "@/components/public/MarketingScrollMarquee";
import { MarketingHomeBody } from "@/components/public/MarketingHomeBody";
import { ENABLE_CIFT_KAYAN_YAZI } from "@/lib/marketing-flags";
import { getMessages } from "@/lib/i18n/get-messages";
import { withLocale } from "@/lib/i18n/path";
import { env } from "@/lib/env";
import { resolveShowreelPosterUrl } from "@/lib/project-images";

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

  const showreelPosterMobile = resolveShowreelPosterUrl(
    settings.homeVideoPosterMobile ?? "",
    "portrait",
  );
  const showreelPosterWeb = resolveShowreelPosterUrl(
    settings.homeVideoPoster ?? "",
    "landscape",
  );
  return (
    <MarketingPageShell className="flex min-h-screen flex-col">
      {showreelPosterMobile ? (
        <link
          rel="preload"
          as="image"
          href={showreelPosterMobile}
          media="(max-width: 899px)"
          fetchPriority="high"
        />
      ) : showreelPosterWeb ? (
        <link
          rel="preload"
          as="image"
          href={showreelPosterWeb}
          fetchPriority="high"
        />
      ) : null}
      {showreelPosterWeb && showreelPosterMobile ? (
        <link
          rel="preload"
          as="image"
          href={showreelPosterWeb}
          media="(min-width: 900px)"
          fetchPriority="high"
        />
      ) : null}
      <MarketingSiteNav settings={settings} locale={locale} messages={messages} />
      <MarketingHero
        locale={locale}
        messages={messages}
        ctaHref={withLocale("/works", locale)}
        scrollHref="#works"
      />
      <MarketingHomeShowreel
        settings={settings}
        locale={locale}
        messages={messages}
      />
      <MarketingHomeValues locale={locale} messages={messages} />
      {ENABLE_CIFT_KAYAN_YAZI ? (
        <MarketingScrollMarquee locale={locale} messages={messages} />
      ) : null}
      <MarketingHomeBody locale={locale} messages={messages} />
    </MarketingPageShell>
  );
}
