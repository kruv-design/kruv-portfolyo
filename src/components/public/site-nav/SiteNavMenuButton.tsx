"use client";

type SiteNavMenuButtonProps = {
  open: boolean;
  controlsId: string;
  onClick: () => void;
  className?: string;
};

/** Mobil hamburger / X — navbar şeridinde sabit konum. */
export function SiteNavMenuButton({
  open,
  controlsId,
  onClick,
  className = "marketing-navbar-menu-btn",
}: SiteNavMenuButtonProps) {
  return (
    <button
      type="button"
      className={className}
      aria-expanded={open}
      aria-controls={controlsId}
      aria-haspopup="dialog"
      aria-label={open ? "Close menu" : "Open menu"}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <span className="marketing-navbar-menu-btn__bars site-nav-menu-btn__bars" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    </button>
  );
}
