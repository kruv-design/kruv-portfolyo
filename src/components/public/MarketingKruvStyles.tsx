import { MARKETING_CRITICAL_CSS } from "@/lib/marketing-critical-css";
import { AsyncStylesheet } from "./AsyncStylesheet";

/** Ana site (`kruv.html`) — kritik CSS inline, `kruv.css` async (render-blocking azaltır). */
export function MarketingKruvStyles() {
  return (
    <>
      <link
        rel="preload"
        href="/fonts/switzer/Switzer-Variable.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link rel="stylesheet" href="/fonts/switzer/switzer.css" />
      <style id="critical-marketing">{MARKETING_CRITICAL_CSS}</style>
      <AsyncStylesheet href="/kruv.css" />
    </>
  );
}
