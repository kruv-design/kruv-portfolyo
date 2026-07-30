import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";
import { getProtelPitch } from "@/lib/protel-queries";
import { MarketingHomeSocialClientsPanel } from "./MarketingHomeSocialClientsPanel";

/** Protel pitch — sosyal medya yönetimi bölümü (marka sekmeleri + video önizlemeler). */
export async function MarketingHomeSocialClients({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  const { brands } = await getProtelPitch();
  if (brands.length === 0) return null;

  return (
    <div
      className="home-social-clients"
      id="social-clients"
      lang={locale}
      aria-label={messages.home.socialClients.ariaLabel}
    >
      <div className="home-social-clients__inner">
        <MarketingHomeSocialClientsPanel brands={brands} messages={messages} />
      </div>
    </div>
  );
}
