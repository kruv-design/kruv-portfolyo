import { canTrackFirstParty } from "@/lib/analytics/consent";
import { getSessionId } from "@/lib/analytics/session";

export const PRESENCE_HEARTBEAT_MS = 5_000;

export function pingPresence(page?: string) {
  if (!canTrackFirstParty()) return;

  try {
    const payload = {
      session_id: getSessionId(),
      page: page ?? window.location.pathname,
    };
    navigator.sendBeacon(
      "/api/presence",
      new Blob([JSON.stringify(payload)], { type: "application/json" }),
    );
  } catch {
    /* yoksay */
  }
}
