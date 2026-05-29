import { Fragment } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";

const TICKER_HAND_COUNT = 7;

/** Hero altı kayan bant — metinler locale mesajlarından. */
export function MarketingTicker({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  const items = messages.home.ticker.items;

  const sequence = items.map((item, index) => {
    const asset = Math.min(index + 1, TICKER_HAND_COUNT);
    return (
      <Fragment key={`${item.label}-${index}`}>
        <span className="ticker-item">{item.label}</span>
        <span className="ticker-hand" aria-hidden="true">
          <img
            src={`/assets/ticker-hands/asset-${asset}.svg`}
            width={96}
            height={51}
            alt=""
          />
        </span>
      </Fragment>
    );
  });

  return (
    <div className="ticker">
      <div className="ticker-track" lang={locale}>
        {sequence}
        {sequence}
      </div>
    </div>
  );
}
