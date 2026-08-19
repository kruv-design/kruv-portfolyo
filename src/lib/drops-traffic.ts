import { getSessionId } from "@/lib/analytics/session";

export type DropDownloadUiSource = "listing" | "detail";

export type DropTrafficContext = {
  page: string;
  referrer: string;
  source: DropDownloadUiSource;
  session_id: string;
};

export function getDropTrafficContext(
  uiSource: DropDownloadUiSource,
): DropTrafficContext {
  if (typeof window === "undefined") {
    return { page: "", referrer: "", source: uiSource, session_id: "" };
  }
  return {
    page: `${window.location.pathname}${window.location.search}`.slice(0, 512),
    referrer: (document.referrer || "").slice(0, 500),
    source: uiSource,
    session_id: getSessionId(),
  };
}

/** Referrer host veya UTM; yoksa “direkt”. */
export function inboundLabel(page: string, referrer: string): string {
  try {
    const utm = new URL(page, "https://kruv.com").searchParams.get("utm_source");
    if (utm?.trim()) return utm.trim();
  } catch {
    /* ignore */
  }
  const raw = referrer.trim();
  if (!raw) return "direkt";
  try {
    return new URL(raw).hostname.replace(/^www\./, "");
  } catch {
    return raw.slice(0, 48);
  }
}
