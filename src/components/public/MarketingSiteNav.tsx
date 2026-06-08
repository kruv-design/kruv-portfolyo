"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { SiteSettings } from "@/types";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";
import { withLocale } from "@/lib/i18n/path";
import { t } from "@/lib/i18n/t";
import { normalizeBrandName } from "@/lib/brand";
import { ENABLE_THEME_TOGGLE } from "@/lib/theme/flags";
import { ThemeToggle } from "./ThemeToggle";
import {
  SiteNavMenuButton,
  SiteNavMobileOverlay,
  SITE_NAV_MOBILE_MENU_ID,
  SITE_NAV_SENTINEL_ID,
  useSiteNavScroll,
} from "./site-nav";

const LANGUAGE_OPTIONS: Array<{ locale: Locale; label: string; flag: string }> = [
  { locale: "tr", label: "TR", flag: "🇹🇷" },
  { locale: "en", label: "EN", flag: "🇬🇧" },
];

/**
 * Site header — anasayfa (kruv.html) ile aynı markup + iki varyasyon:
 * üstte geniş (wordmark), scroll’da compact pill (`is-scrolled`).
 */
export function MarketingSiteNav({
  settings,
  locale,
  messages,
}: {
  settings: SiteSettings;
  locale: Locale;
  messages: Messages;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const menuTitleId = useId();
  const scrolled = useSiteNavScroll(SITE_NAV_SENTINEL_ID);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const onMqChange = () => {
      if (!mq.matches) {
        setLanguageMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };
    mq.addEventListener("change", onMqChange);
    return () => mq.removeEventListener("change", onMqChange);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!languageMenuOpen) return;
    const onPointerDown = (ev: MouseEvent) => {
      const root = languageMenuRef.current;
      if (!root) return;
      if (!root.contains(ev.target as Node)) setLanguageMenuOpen(false);
    };
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") setLanguageMenuOpen(false);
    };
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [languageMenuOpen]);

  const brandLabel = normalizeBrandName(settings.siteAdi).toLowerCase();

  const isProjectsActive = pathname?.includes("/works") || (pathname?.includes("/projects/") ?? false);
  const isContactActive = pathname?.includes("/contact");

  function closeMobileMenu() {
    setLanguageMenuOpen(false);
    setMobileMenuOpen(false);
  }

  function toggleMobileMenu() {
    setLanguageMenuOpen(false);
    setMobileMenuOpen((open) => !open);
  }

  function onMobileSearch(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    const q = String(fd.get("q") ?? "").trim();
    closeMobileMenu();
    if (q) router.push(`${withLocale("/works", locale)}?q=${encodeURIComponent(q)}`);
    else router.push(withLocale("/works", locale));
  }

  function switchLocale(nextLocale: Locale) {
    const current = pathname || "/";
    const parts = current.split("/").filter(Boolean);
    if (parts[0] === "tr" || parts[0] === "en") parts.shift();
    const base = `/${parts.join("/")}`;
    document.cookie = `kruv-locale=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    setLanguageMenuOpen(false);
    router.push(withLocale(base, nextLocale));
  }

  const activeLanguage = LANGUAGE_OPTIONS.find((item) => item.locale === locale) ?? LANGUAGE_OPTIONS[0];

  return (
    <>
      <div id={SITE_NAV_SENTINEL_ID} className="marketing-nav-sentinel" aria-hidden="true" />
      <nav
        id="site-nav"
        className={`marketing-navbar${scrolled ? " is-scrolled" : ""}${mobileMenuOpen ? " is-menu-open" : ""}`}
        aria-label="Primary"
        lang={locale}
      >
        <div className="marketing-navbar-inner">
          <div className="marketing-navbar-cols">
            <div className="marketing-navbar-col marketing-navbar-col--brand">
              <Link
                href={withLocale("/", locale)}
                className="marketing-navbar-logo brand"
                aria-label={`Home — ${brandLabel}`}
              >
                <span className="marketing-navbar-logo-stack">
                  <span className="marketing-navbar-logo-wordmark" aria-hidden="true" />
                  <span className="marketing-navbar-logo-emblem" aria-hidden="true" />
                </span>
              </Link>
            </div>
            <div className="marketing-navbar-col marketing-navbar-col--links">
              <ul className="marketing-navbar-links">
                <li>
                  <Link
                    href={withLocale("/works", locale)}
                    className="marketing-navbar-item"
                    aria-current={isProjectsActive ? "page" : undefined}
                  >
                    {t(messages, "nav.projects", "Projects")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={withLocale("/contact", locale)}
                    className="marketing-navbar-item"
                    aria-current={isContactActive ? "page" : undefined}
                  >
                    {t(messages, "nav.contact", "Contact")}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="marketing-navbar-col marketing-navbar-col--cta">
              <div className="marketing-navbar-actions">
                <div className="lang-switch" ref={languageMenuRef}>
                  <button
                    type="button"
                    className="lang-switch__trigger"
                    aria-haspopup="menu"
                    aria-expanded={languageMenuOpen}
                    onClick={() => setLanguageMenuOpen((prev) => !prev)}
                  >
                    <span aria-hidden="true">{activeLanguage.flag}</span>
                    <span>{activeLanguage.label}</span>
                    <span aria-hidden="true">▾</span>
                  </button>
                  {languageMenuOpen ? (
                    <div role="menu" className="lang-switch__menu">
                      {LANGUAGE_OPTIONS.map((item) => (
                        <button
                          key={item.locale}
                          type="button"
                          role="menuitemradio"
                          aria-checked={locale === item.locale}
                          className="lang-switch__item"
                          onClick={() => switchLocale(item.locale)}
                        >
                          <span aria-hidden="true">{item.flag}</span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
                {ENABLE_THEME_TOGGLE ? (
                  <ThemeToggle className="marketing-navbar-theme-toggle marketing-navbar-theme-toggle--dock nav-theme-toggle" />
                ) : null}
                <Link href={withLocale("/contact", locale)} className="marketing-navbar-cta">
                  {t(messages, "nav.startProject", "Start a project")}
                </Link>
                <SiteNavMenuButton
                  open={mobileMenuOpen}
                  controlsId={SITE_NAV_MOBILE_MENU_ID}
                  onClick={toggleMobileMenu}
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <SiteNavMobileOverlay
        id={SITE_NAV_MOBILE_MENU_ID}
        titleId={menuTitleId}
        open={mobileMenuOpen}
        onClose={closeMobileMenu}
      >
        {ENABLE_THEME_TOGGLE ? (
          <ThemeToggle className="marketing-nav-mobile-theme-toggle site-nav-mobile-theme-toggle nav-theme-toggle" />
        ) : null}

        <form className="marketing-nav-mobile-search" role="search" onSubmit={onMobileSearch}>
          <label htmlFor="marketing-nav-mobile-q" className="sr-only">
            {t(messages, "nav.search", "Search")}
          </label>
          <input
            id="marketing-nav-mobile-q"
            name="q"
            type="search"
            placeholder={t(messages, "nav.searchPlaceholder", "Search")}
            autoComplete="off"
            enterKeyHint="search"
          />
        </form>

        <nav aria-label="Mobile">
          <ul className="marketing-nav-mobile-links site-nav-mobile-links">
            <li>
              <Link href={withLocale("/works", locale)} onClick={closeMobileMenu}>
                {t(messages, "nav.projects", "Projects")}
              </Link>
            </li>
            <li>
              <Link href={withLocale("/contact", locale)} onClick={closeMobileMenu}>
                {t(messages, "nav.contact", "Contact")}
              </Link>
            </li>
          </ul>
        </nav>
      </SiteNavMobileOverlay>
    </>
  );
}
