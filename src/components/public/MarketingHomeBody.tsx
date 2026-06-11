import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";
import { loadMarketingHomeContent } from "@/lib/marketing-home";
import { MarketingHomeScripts } from "./MarketingHomeScripts";
import { ENABLE_KAYAN_IKONLU_YAZI } from "@/lib/marketing-flags";
import { MarketingTicker } from "./MarketingTicker";

/** `kruv.html` testimonials → lets-talk arası — ideal-section ayrı bileşende. */
export async function MarketingHomeBody({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  const content = await loadMarketingHomeContent(locale);

  const { bodyBeforeScene, bodyAfterScene, footerHtml, scripts } = content;

  return (
    <>
      {ENABLE_KAYAN_IKONLU_YAZI ? (
        <MarketingTicker locale={locale} messages={messages} />
      ) : null}
      <div
        className="marketing-home-body"
        data-locale={locale}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: bodyBeforeScene }}
      />
      <div
        className="marketing-home-body"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: bodyAfterScene }}
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
