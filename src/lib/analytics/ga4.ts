declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function isValidGaMeasurementId(
  id: string | undefined,
): id is string {
  return Boolean(id && /^G-[A-Z0-9]+$/.test(id) && !/X{2,}/i.test(id));
}

/** App Router SPA geçişlerinde GA4 page_view (gtag yüklüyse). */
export function sendGaPageView(pagePath: string) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  const path = pagePath || window.location.pathname;
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}
