import { canTrackFirstParty } from "@/lib/analytics/consent";
import { getSessionId } from "@/lib/analytics/session";

export function track(eventName: string, props?: Record<string, unknown>) {
  if (!canTrackFirstParty()) return;

  try {
    const payload = {
      session_id: getSessionId(),
      event_name: eventName,
      page: window.location.pathname,
      referrer: document.referrer || null,
      props: props ?? null,
    };
    const body = JSON.stringify(payload);
    navigator.sendBeacon(
      "/api/track",
      new Blob([body], { type: "application/json" }),
    );
  } catch {
    /* yoksay */
  }
}
