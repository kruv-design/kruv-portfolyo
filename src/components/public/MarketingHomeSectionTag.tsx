import type { ReactNode } from "react";

/** Figma section label — ikon + uppercase tagline (H4). */
export function MarketingHomeSectionTag({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={["section-tag", "home-section-tag", className].filter(Boolean).join(" ")}>
      <span className="home-section-tag__icon" aria-hidden="true" />
      <span className="home-section-tag__text">{children}</span>
    </p>
  );
}
