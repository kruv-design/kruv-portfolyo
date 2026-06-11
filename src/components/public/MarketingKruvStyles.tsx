import { MARKETING_CRITICAL_CSS } from "@/lib/marketing-critical-css";

/** Ana site (`kruv.html`) — kritik CSS inline + tam stil dosyası (senkron). */
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
      <link rel="preload" href="/kruv.css" as="style" />
      <link rel="stylesheet" href="/kruv.css" />
      <link rel="stylesheet" href="/home-figma.css" />
    </>
  );
}
