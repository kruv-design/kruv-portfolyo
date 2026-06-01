/** Tüm scroll köklerini sıfırla (window + html/body). */
export function scrollToTop(): void {
  if (typeof window === "undefined") return;

  try {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  } catch {
    window.scrollTo(0, 0);
  }

  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

/** Next.js client navigasyonundan sonra scroll geri yüklemesini yenmek için. */
export function scheduleScrollToTop(): void {
  scrollToTop();
  requestAnimationFrame(() => {
    scrollToTop();
    requestAnimationFrame(scrollToTop);
  });
  window.setTimeout(scrollToTop, 0);
  window.setTimeout(scrollToTop, 50);
  window.setTimeout(scrollToTop, 150);
}

export function enableManualScrollRestoration(): void {
  if (typeof history !== "undefined" && "scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
}
