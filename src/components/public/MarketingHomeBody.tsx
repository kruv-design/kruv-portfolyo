import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";
import { getProjects } from "@/lib/queries";
import { loadMarketingHomeContent } from "@/lib/marketing-home";
import { MarketingFeaturedWorks } from "./MarketingFeaturedWorks";
import { MarketingHomeScripts } from "./MarketingHomeScripts";
import { ENABLE_KAYAN_IKONLU_YAZI } from "@/lib/marketing-flags";
import { MarketingTicker } from "./MarketingTicker";

/** `kruv.html` ideal-section → lets-talk arası — anasayfa marketing bölümleri. */
export async function MarketingHomeBody({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  const [content, projects] = await Promise.all([
    loadMarketingHomeContent(locale),
    getProjects().catch(() => []),
  ]);

  const { bodyBeforeScene, bodyAfterScene, footerHtml, scripts } = content;

  return (
    <>
      {ENABLE_KAYAN_IKONLU_YAZI ? (
        <MarketingTicker locale={locale} messages={messages} />
      ) : (
        <section className="home-ticker-placeholder" aria-label="kayanikonluyazı">
          <h2 className="b2 home-ticker-placeholder__title">kayanikonluyazı</h2>
        </section>
      )}
      <div
        className="marketing-home-body"
        data-locale={locale}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: bodyBeforeScene }}
      />
      <MarketingFeaturedWorks
        projects={projects}
        locale={locale}
        messages={messages}
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
