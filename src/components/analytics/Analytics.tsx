"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ANALYTICS_CONSENT_KEY,
  CONSENT_AUTO_GRANT_MS,
  parseStoredConsent,
  type AnalyticsConsent,
} from "@/lib/analytics/consent";
import { track } from "@/lib/analytics/track";
import { pingPresence, PRESENCE_HEARTBEAT_MS } from "@/lib/analytics/presence";

/**
 * GA4 + Microsoft Clarity yükleyici + birinci taraf olay takibi.
 *
 * Çerez tercihleri (KVKK / GDPR):
 * - evet → birinci taraf + üçüncü taraf (GA/Clarity)
 * - sadece zorunlu olanları → birinci taraf analitik (site_events)
 * - hayır → takip yok
 * - Seçim yapılmazsa 6 sn sonra otomatik evet (granted)
 */

type Consent = AnalyticsConsent | null;

export function Analytics({
  gaId,
  clarityId,
}: {
  gaId?: string;
  clarityId?: string;
}) {
  const pathname = usePathname();
  const [consent, setConsent] = useState<Consent>(null);
  const [hydrated, setHydrated] = useState(false);

  function choose(value: AnalyticsConsent) {
    try {
      window.localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
    } catch {
      /* yoksay */
    }
    setConsent(value);
  }

  useEffect(() => {
    setHydrated(true);
    try {
      setConsent(
        parseStoredConsent(window.localStorage.getItem(ANALYTICS_CONSENT_KEY)),
      );
    } catch {
      // localStorage erişilemiyor — banner gösterilmez, takip yok.
    }
  }, []);

  useEffect(() => {
    if (!hydrated || consent !== null) return;
    const id = window.setTimeout(() => choose("granted"), CONSENT_AUTO_GRANT_MS);
    return () => window.clearTimeout(id);
  }, [hydrated, consent]);

  useEffect(() => {
    if (!hydrated || consent === null || consent === "rejected") return;
    track("page_view");
    pingPresence(pathname);
    const id = window.setInterval(
      () => pingPresence(pathname),
      PRESENCE_HEARTBEAT_MS,
    );
    return () => window.clearInterval(id);
  }, [hydrated, consent, pathname]);

  const showBanner = hydrated && consent === null;

  return (
    <>
      {consent === "granted" && gaId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}', { anonymize_ip: true });`}
          </Script>
        </>
      ) : null}

      {consent === "granted" && clarityId ? (
        <Script id="clarity-init" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${clarityId}");`}
        </Script>
      ) : null}

      {showBanner ? (
        <div
          className="cookie-consent"
          role="dialog"
          aria-label="Analitik izni"
          aria-live="polite"
        >
          <p className="cookie-consent__text">
            Siteyi iyileştirmek için analitik verisi toplayalım mı?
          </p>
          <div className="cookie-consent__actions">
            <button
              type="button"
              className="cookie-consent__yes"
              onClick={() => choose("granted")}
            >
              evet
            </button>
            <button
              type="button"
              className="cookie-consent__necessary"
              onClick={() => choose("necessary")}
            >
              sadece zorunlu olanları
            </button>
            <button
              type="button"
              className="cookie-consent__no"
              onClick={() => choose("rejected")}
            >
              hayır
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
