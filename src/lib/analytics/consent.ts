export const ANALYTICS_CONSENT_KEY = "kruv-analytics-consent";

/** granted = tüm analitik; necessary = birinci taraf analitik; rejected = takip yok */
export type AnalyticsConsent = "granted" | "necessary" | "rejected";

export function parseStoredConsent(
  stored: string | null,
): AnalyticsConsent | null {
  if (stored === "granted") return "granted";
  if (stored === "necessary") return "necessary";
  if (stored === "rejected" || stored === "denied") return "rejected";
  return null;
}

/** Birinci taraf site_events (page_view, tıklama, form) */
export function canTrackFirstParty(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const consent = parseStoredConsent(
      window.localStorage.getItem(ANALYTICS_CONSENT_KEY),
    );
    return consent === "granted" || consent === "necessary";
  } catch {
    return false;
  }
}

/** GA4 / Clarity gibi üçüncü taraf scriptler */
export function canTrackThirdParty(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return (
      parseStoredConsent(
        window.localStorage.getItem(ANALYTICS_CONSENT_KEY),
      ) === "granted"
    );
  } catch {
    return false;
  }
}

/** @deprecated canTrackFirstParty kullanın */
export function hasAnalyticsConsent(): boolean {
  return canTrackFirstParty();
}
