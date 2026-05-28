"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import type { SiteSettings } from "@/types";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";
import { withLocale } from "@/lib/i18n/path";
import { t } from "@/lib/i18n/t";
import { ThemeToggle } from "./ThemeToggle";
import {
  SiteNavMenuButton,
  SiteNavMobileOverlay,
  SITE_NAV_MOBILE_MENU_ID,
  SITE_NAV_SENTINEL_ID,
  useSiteNavScroll,
} from "./site-nav";

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

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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

  const brandLabel = (settings.siteAdi || "kruv.").replace(/\.$/, "").toLowerCase() || "kruv";

  const isProjectsActive = pathname?.includes("/works") || (pathname?.includes("/projects/") ?? false);
  const isContactActive = pathname?.includes("/contact");

  function closeMobileMenu() {
    setMobileMenuOpen(false);
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
    router.push(withLocale(base === "/" ? "/works" : base, nextLocale));
  }

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
                href={withLocale("/works", locale)}
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
                <div className="flex items-center gap-1 rounded-full border px-2 py-1" style={{ borderColor: "var(--border)" }}>
                  <button
                    type="button"
                    className="b3 px-2 py-0.5"
                    aria-pressed={locale === "tr"}
                    onClick={() => switchLocale("tr")}
                  >
                    TR
                  </button>
                  <button
                    type="button"
                    className="b3 px-2 py-0.5"
                    aria-pressed={locale === "en"}
                    onClick={() => switchLocale("en")}
                  >
                    EN
                  </button>
                </div>
                <ThemeToggle className="marketing-navbar-theme-toggle marketing-navbar-theme-toggle--dock nav-theme-toggle" />
                <Link href={withLocale("/contact", locale)} className="marketing-navbar-cta">
                  {t(messages, "nav.startProject", "Start a project")}
                </Link>
                <SiteNavMenuButton
                  open={mobileMenuOpen}
                  controlsId={SITE_NAV_MOBILE_MENU_ID}
                  onClick={() => setMobileMenuOpen((open) => !open)}
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
      >
        <ThemeToggle className="marketing-nav-mobile-theme-toggle site-nav-mobile-theme-toggle nav-theme-toggle" />

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
