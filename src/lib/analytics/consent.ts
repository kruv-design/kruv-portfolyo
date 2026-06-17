export const ANALYTICS_CONSENT_KEY = "kruv-analytics-consent";

export type AnalyticsConsent = "granted" | "denied";

export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(ANALYTICS_CONSENT_KEY) === "granted";
  } catch {
    return false;
  }
}
