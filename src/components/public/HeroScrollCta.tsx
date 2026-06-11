"use client";

/** Hero oku — showreel üst kenarını viewport üstüne hizalar (çift scroll-padding offset yok). */
export function HeroScrollCta({
  href = "#hero-showreel",
  ariaLabel,
}: {
  href?: string;
  ariaLabel: string;
}) {
  function onClick(event: React.MouseEvent<HTMLAnchorElement>) {
    const id = href.startsWith("#") ? href.slice(1) : href;
    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();

    const top =
      target.getBoundingClientRect().top +
      (window.scrollY || document.documentElement.scrollTop);

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top,
      left: 0,
      behavior: reducedMotion ? "auto" : "smooth",
    });

    if (typeof history.replaceState === "function") {
      history.replaceState(null, "", href);
    }
  }

  return (
    <a
      className="hero-v2-scroll-cta"
      href={href}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <img
        className="hero-v2-scroll-cta__icon"
        src="/assets/hero-scroll-arrow.svg"
        width={66}
        height={66}
        alt=""
        aria-hidden
        decoding="async"
      />
    </a>
  );
}
