import { canTrackFirstParty } from "@/lib/analytics/consent";

const SESSION_KEY = "kruv-session-id";

function getSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "unknown";
  }
}

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
