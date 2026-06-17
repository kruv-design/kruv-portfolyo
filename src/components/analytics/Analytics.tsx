"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ANALYTICS_CONSENT_KEY,
  type AnalyticsConsent,
} from "@/lib/analytics/consent";
import { track } from "@/lib/analytics/track";

/**
 * GA4 + Microsoft Clarity yükleyici + birinci taraf olay takibi.
 *
 * - `gaId` / `clarityId` ayarlı değilse üçüncü taraf script yüklenmez;
 *   onay banner'ı ve Supabase `site_events` takibi yine çalışır.
 * - KVKK/GDPR uyumu için basit bir onay (consent) banner'ı gösterir;
 *   scriptler yalnızca kullanıcı "Kabul et" dedikten sonra yüklenir.
 * - Tercih `localStorage` (kruv-analytics-consent) içinde saklanır.
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

  useEffect(() => {
    setHydrated(true);
    try {
      const stored = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
      if (stored === "granted" || stored === "denied") {
        setConsent(stored);
      }
    } catch {
      // localStorage erişilemiyor (gizli mod vb.) - banner gösterilmez,
      // analytics yüklenmez.
    }
  }, []);

  useEffect(() => {
    if (!hydrated || consent !== "granted") return;
    track("page_view");
  }, [hydrated, consent, pathname]);

  function choose(value: AnalyticsConsent) {
    try {
      window.localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
    } catch {
      /* yoksay */
    }
    setConsent(value);
  }

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

      {hydrated && consent === null ? (
        <div
          role="dialog"
          aria-label="Çerez ve analiz izni"
          aria-live="polite"
          style={{
            position: "fixed",
            bottom: 16,
            left: 16,
            right: 16,
            zIndex: 9999,
            maxWidth: 480,
            margin: "0 auto",
            background: "#111827",
            color: "#F9FAFB",
            borderRadius: 12,
            padding: "16px 18px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            fontSize: 13,
            lineHeight: 1.5,
            fontFamily: "inherit",
          }}
        >
          <p style={{ margin: "0 0 12px" }}>
            Siteyi nasıl kullandığınızı anlamak için Google Analytics ve
            Microsoft Clarity ile anonim kullanım verisi topluyoruz. Kabul
            ediyor musunuz?
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => choose("denied")}
              style={{
                background: "transparent",
                color: "#F9FAFB",
                border: "1px solid #4B5563",
                borderRadius: 8,
                padding: "6px 14px",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Reddet
            </button>
            <button
              type="button"
              onClick={() => choose("granted")}
              style={{
                background: "#F9FAFB",
                color: "#111827",
                border: "none",
                borderRadius: 8,
                padding: "6px 14px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Kabul et
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
