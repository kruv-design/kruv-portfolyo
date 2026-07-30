import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import { DEFAULT_SITE_SETTINGS, getSettings } from "@/lib/queries";
import { MarketingPageShell } from "@/components/public/MarketingPageShell";
import { MarketingSiteNav } from "@/components/public/MarketingSiteNav";
import { MarketingHero } from "@/components/public/MarketingHero";
import { MarketingHomeSpotlight } from "@/components/public/MarketingHomeSpotlight";
import { MarketingHomeIdealClients } from "@/components/public/MarketingHomeIdealClients";
import { MarketingHomeValues } from "@/components/public/MarketingHomeValues";
import { MarketingHomeKayanYazi } from "@/components/public/MarketingHomeKayanYazi";
import { MarketingHomeSocialClients } from "@/components/public/MarketingHomeSocialClients";
import { MarketingHomeFeatured } from "@/components/public/MarketingHomeFeatured";
import { MarketingHomeBody } from "@/components/public/MarketingHomeBody";
import { resolveHomeShowreelSlots } from "@/lib/home-showreel";
import { getMessages } from "@/lib/i18n/get-messages";
import { t } from "@/lib/i18n/t";
import { withLocale } from "@/lib/i18n/path";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildLocaleAlternates } from "@/lib/seo/locale-alternates";
import { BRAND_NAME } from "@/lib/brand";
import {
  buildLocalBusinessSchema,
  buildWebSiteSchema,
} from "@/lib/seo/structured-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = getMessages(locale);
  const title = t(messages, "home.metaTitle");
  const description = t(messages, "home.metaDescription");

  const alternates = buildLocaleAlternates("", locale);

  return {
    title: { absolute: title },
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      locale: locale === "tr" ? "tr_TR" : "en_US",
      siteName: BRAND_NAME,
      type: "website",
      images: [
        {
          url: `/og/og-home-${locale}.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/og/og-home-${locale}.png`],
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
  const homeDescription = t(messages, "home.metaDescription");
  const homeImage =
    showreelPosterWeb || showreelPosterMobile || settings.homeVideoPoster || undefined;

  return (
    <MarketingPageShell className="marketing-home-figma flex min-h-screen flex-col">
      <JsonLd
        data={[
          buildWebSiteSchema({ locale, description: homeDescription }),
          buildLocalBusinessSchema({
            locale,
            description: homeDescription,
            image: homeImage,
          }),
        ]}
      />
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
      <MarketingHomeFeatured locale={locale} messages={messages} />
      <MarketingHomeKayanYazi locale={locale} messages={messages} />
      <MarketingHomeSocialClients locale={locale} messages={messages} />
      <MarketingHomeValues locale={locale} messages={messages} />
      <MarketingHomeBody locale={locale} messages={messages} />
    </MarketingPageShell>
  );
}
