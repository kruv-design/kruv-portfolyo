import type { Page, Request } from "@playwright/test";

export const ANALYTICS_CONSENT_KEY = "kruv-analytics-consent";

export type TrackPayload = {
  session_id: string;
  event_name: string;
  page: string;
  referrer: string | null;
  props: Record<string, unknown> | null;
};

export async function setAnalyticsConsent(
  page: Page,
  value: "granted" | "necessary" | "rejected" | "denied" | null,
) {
  await page.addInitScript(
    ([consentKey, val]) => {
      if (val) localStorage.setItem(consentKey, val);
      else localStorage.removeItem(consentKey);
    },
    [ANALYTICS_CONSENT_KEY, value] as const,
  );
}

export function watchTrackRequests(page: Page) {
  const payloads: TrackPayload[] = [];

  const onRequest = (req: Request) => {
    if (!req.url().includes("/api/track") || req.method() !== "POST") return;
    const body = req.postData();
    if (!body) return;
    try {
      payloads.push(JSON.parse(body) as TrackPayload);
    } catch {
      /* yoksay */
    }
  };

  page.on("request", onRequest);

  return {
    payloads,
    stop: () => page.off("request", onRequest),
    waitForEvent: async (eventName: string, timeout = 8000) => {
      const start = Date.now();
      while (Date.now() - start < timeout) {
        if (payloads.some((p) => p.event_name === eventName)) {
          return payloads.filter((p) => p.event_name === eventName);
        }
        await page.waitForTimeout(200);
      }
      throw new Error(`track event "${eventName}" gelmedi (${timeout}ms)`);
    },
  };
}

export async function waitQuiet(ms = 1500) {
  await new Promise((r) => setTimeout(r, ms));
}
