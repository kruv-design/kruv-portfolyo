"use client";

import type { RefObject } from "react";
import type { Locale } from "@/lib/i18n/config";

export const SITE_NAV_LANGUAGE_OPTIONS: Array<{ locale: Locale; label: string }> = [
  { locale: "tr", label: "TR" },
  { locale: "en", label: "EN" },
];

type SiteNavLangSwitchProps = {
  locale: Locale;
  open: boolean;
  onToggle: () => void;
  onSelect: (locale: Locale) => void;
  menuRef: RefObject<HTMLDivElement | null>;
  className?: string;
};

export function SiteNavLangSwitch({
  locale,
  open,
  onToggle,
  onSelect,
  menuRef,
  className = "lang-switch",
}: SiteNavLangSwitchProps) {
  const active = SITE_NAV_LANGUAGE_OPTIONS.find((item) => item.locale === locale) ?? SITE_NAV_LANGUAGE_OPTIONS[0];

  return (
    <div className={className} ref={menuRef}>
      <button
        type="button"
        className="lang-switch__trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>{active.label}</span>
        <span aria-hidden="true">▾</span>
      </button>
      {open ? (
        <div role="menu" className="lang-switch__menu">
          {SITE_NAV_LANGUAGE_OPTIONS.map((item) => (
            <button
              key={item.locale}
              type="button"
              role="menuitemradio"
              aria-checked={locale === item.locale}
              className="lang-switch__item"
              onClick={() => onSelect(item.locale)}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
