"use client";

import { track } from "@/lib/analytics/track";

/** Anasayfa featured-work kartları için izlenen proje linki. */
export function FeaturedWorkClickLink({
  href,
  slug,
  ariaLabel,
}: {
  href: string;
  slug: string;
  ariaLabel: string;
}) {
  return (
    <a
      className="featured-work-hit"
      href={href}
      aria-label={ariaLabel}
      onClick={() => track("project_click", { slug })}
    />
  );
}
