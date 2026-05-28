import type { Locale } from "@/lib/i18n/config";
import { loadMarketingHomeContent } from "@/lib/marketing-home";
import { MarketingHomeScripts } from "./MarketingHomeScripts";

/** `kruv.html` ticker → lets-talk arası — anasayfa marketing bölümleri. */
export async function MarketingHomeBody({ locale }: { locale: Locale }) {
  const { bodyHtml, footerHtml, scripts } = await loadMarketingHomeContent(locale);

  return (
    <>
      <div
        className="marketing-home-body"
        data-locale={locale}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      />
      <div
        className="marketing-home-footer"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: footerHtml }}
      />
      <MarketingHomeScripts scripts={scripts} />
    </>
  );
}
