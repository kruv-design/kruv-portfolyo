import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import { DEFAULT_SITE_SETTINGS, getSettings } from "@/lib/queries";
import { MarketingPageShell } from "@/components/public/MarketingPageShell";
import { MarketingSiteNav } from "@/components/public/MarketingSiteNav";
import { MarketingHero } from "@/components/public/MarketingHero";
import { MarketingHomeSpotlight } from "@/components/public/MarketingHomeSpotlight";
import { MarketingHomeIdealClients } from "@/components/public/MarketingHomeIdealClients";
import { MarketingHomeValues } from "@/components/public/MarketingHomeValues";
import { MarketingScrollMarquee } from "@/components/public/MarketingScrollMarquee";
import { MarketingHomeBody } from "@/components/public/MarketingHomeBody";
import { ENABLE_CIFT_KAYAN_YAZI } from "@/lib/marketing-flags";
import { resolveHomeShowreelSlots } from "@/lib/home-showreel";
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

  const { web: showreelWeb, mobile: showreelMobile } =
    resolveHomeShowreelSlots(settings);
  const showreelPosterMobile = showreelMobile?.posterSrc ?? "";
  const showreelPosterWeb = showreelWeb?.posterSrc ?? "";
  const showreelVideoMobile = showreelMobile?.videoSrc ?? "";
  const showreelVideoWeb = showreelWeb?.videoSrc ?? "";
  return (
    <MarketingPageShell className="flex min-h-screen flex-col">
      <link
        rel="preconnect"
        href="https://res.cloudinary.com"
        crossOrigin="anonymous"
      />
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
      {showreelVideoMobile ? (
        <link
          rel="preload"
          as="video"
          href={showreelVideoMobile}
          media="(max-width: 899px)"
          fetchPriority="high"
        />
      ) : null}
      {showreelVideoWeb && showreelVideoMobile ? (
        <link
          rel="preload"
          as="video"
          href={showreelVideoWeb}
          media="(min-width: 900px)"
          fetchPriority="high"
        />
      ) : showreelVideoWeb && !showreelVideoMobile ? (
        <link
          rel="preload"
          as="video"
          href={showreelVideoWeb}
          fetchPriority="high"
        />
      ) : null}
      <MarketingSiteNav settings={settings} locale={locale} messages={messages} />
      <MarketingHero
        settings={settings}
        locale={locale}
        messages={messages}
        ctaHref={withLocale("/works", locale)}
        scrollHref="#works"
      />
      <MarketingHomeSpotlight locale={locale} messages={messages} />
      <MarketingHomeIdealClients locale={locale} />
      <MarketingHomeValues locale={locale} messages={messages} />
      {ENABLE_CIFT_KAYAN_YAZI ? (
        <MarketingScrollMarquee locale={locale} messages={messages} />
      ) : null}
      <MarketingHomeBody locale={locale} messages={messages} />
    </MarketingPageShell>
  );
}
