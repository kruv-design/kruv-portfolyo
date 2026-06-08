import type { Locale } from "@/lib/i18n/config";
import { loadMarketingHomeContent } from "@/lib/marketing-home";

/** `kruv.html` ideal-section — “Birlikte Çalıştıklarımız” logo bandı. */
export async function MarketingHomeIdealClients({
  locale,
}: {
  locale: Locale;
}) {
  const { idealSectionHtml } = await loadMarketingHomeContent(locale);

  return (
    <div
      className="marketing-home-body"
      data-locale={locale}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: idealSectionHtml }}
    />
  );
}
