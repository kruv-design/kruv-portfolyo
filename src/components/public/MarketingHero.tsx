import Script from "next/script";
import { loadHeroV2Html, type HeroV2Options } from "@/lib/marketing-hero";

/** `public/partials/hero-v2.html` — anasayfa ile birebir aynı hero. */
export async function MarketingHero(options: HeroV2Options = {}) {
  const html = await loadHeroV2Html({ ctaHref: "/works", ...options });

  return (
    <>
      <div
        className="marketing-hero-mount"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <Script src="/hero-v2-rotator.js" strategy="afterInteractive" />
      <Script src="/hero-v2-cursor.js" strategy="afterInteractive" />
    </>
  );
}
