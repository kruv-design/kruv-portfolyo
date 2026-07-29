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
import { projectCtaHref } from "@/lib/contact-cta";
import { ENABLE_PUBLIC_CONTACT } from "@/lib/marketing-flags";
import { ENABLE_THEME_TOGGLE } from "@/lib/theme/flags";
import { ProjectCtaLink } from "./ProjectCtaLink";
import { ThemeToggle } from "./ThemeToggle";
import {
  SiteNavLangSwitch,
  SiteNavMenuButton,
  SiteNavMobileOverlay,
  SITE_NAV_MOBILE_MENU_ID,
  SITE_NAV_MOBILE_MQ,
  SITE_NAV_SENTINEL_ID,
  useMobileMenuScrollLock,
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
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const headerLangRef = useRef<HTMLDivElement>(null);
  const mobileLangRef = useRef<HTMLDivElement>(null);

  useMobileMenuScrollLock(mobileMenuOpen);

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
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!languageMenuOpen) return;
    const onPointerDown = (ev: MouseEvent) => {
      const target = ev.target as Node;
      const inHeader = headerLangRef.current?.contains(target);
      const inMobile = mobileLangRef.current?.contains(target);
      if (!inHeader && !inMobile) setLanguageMenuOpen(false);
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
  const isBlogActive = pathname?.includes("/blog") ?? false;
  const isDropsActive = pathname?.includes("/drops") ?? false;
  const isContactActive = pathname?.includes("/contact");
  const projectCtaUrl = projectCtaHref(locale);

  function closeMobileMenu() {
    setLanguageMenuOpen(false);
    setMobileMenuOpen(false);
  }

  function toggleMobileMenu() {
    if (typeof window !== "undefined" && !window.matchMedia(SITE_NAV_MOBILE_MQ).matches) return;
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
            {/* Mobil: navbar ortasında dil seçici */}
            <div className="marketing-navbar-col marketing-navbar-col--mobile-lang">
              <SiteNavLangSwitch
                locale={locale}
                open={languageMenuOpen}
                onToggle={() => setLanguageMenuOpen((prev) => !prev)}
                onSelect={switchLocale}
                menuRef={mobileLangRef}
                className="lang-switch marketing-navbar-lang--mobile-center"
              />
            </div>

            <div className="marketing-navbar-col marketing-navbar-col--links">
              <ul className="marketing-navbar-links">
                <li>
                  <Link
                    href={withLocale("/works", locale)}
                    className="marketing-navbar-item"
                    aria-current={isProjectsActive ? "page" : undefined}
                  >
                    {t(messages, "nav.projects", locale === "tr" ? "Projeler" : "Projects")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={withLocale("/blog", locale)}
                    className="marketing-navbar-item"
                    aria-current={isBlogActive ? "page" : undefined}
                  >
                    {t(messages, "nav.blog", "Blog")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={withLocale("/drops", locale)}
                    className="marketing-navbar-item"
                    aria-current={isDropsActive ? "page" : undefined}
                  >
                    {t(messages, "nav.drops", "Drops")}
                  </Link>
                </li>
                {ENABLE_PUBLIC_CONTACT ? (
                  <li>
                    <Link
                      href={withLocale("/contact", locale)}
                      className="marketing-navbar-item"
                      aria-current={isContactActive ? "page" : undefined}
                    >
                      {t(messages, "nav.contact", locale === "tr" ? "İletişim" : "Contact")}
                    </Link>
                  </li>
                ) : null}
              </ul>
            </div>
            <div className="marketing-navbar-col marketing-navbar-col--cta">
              <div className="marketing-navbar-actions">
                <SiteNavLangSwitch
                  locale={locale}
                  open={languageMenuOpen}
                  onToggle={() => setLanguageMenuOpen((prev) => !prev)}
                  onSelect={switchLocale}
                  menuRef={headerLangRef}
                  className="lang-switch marketing-navbar-lang--header"
                />
                {ENABLE_THEME_TOGGLE ? (
                  <ThemeToggle className="marketing-navbar-theme-toggle marketing-navbar-theme-toggle--dock nav-theme-toggle" />
                ) : null}
                {ENABLE_PUBLIC_CONTACT ? (
                  <Link href={withLocale("/contact", locale)} className="marketing-navbar-cta">
                    {t(messages, "nav.startProject", locale === "tr" ? "Projeye başla" : "Start a project")}
                  </Link>
                ) : null}
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
            {t(messages, "nav.search", locale === "tr" ? "Ara" : "Search")}
          </label>
          <input
            id="marketing-nav-mobile-q"
            name="q"
            type="search"
            placeholder={t(messages, "nav.searchPlaceholder", locale === "tr" ? "Ara" : "Search")}
            autoComplete="off"
            enterKeyHint="search"
          />
        </form>

        <nav aria-label="Mobile">
          <ul className="marketing-nav-mobile-links site-nav-mobile-links">
            <li>
              <Link href={withLocale("/works", locale)} onClick={closeMobileMenu}>
                {t(messages, "nav.projects", locale === "tr" ? "Projeler" : "Projects")}
              </Link>
            </li>
            <li>
              <Link href={withLocale("/blog", locale)} onClick={closeMobileMenu}>
                {t(messages, "nav.blog", "Blog")}
              </Link>
            </li>
            <li>
              <Link href={withLocale("/drops", locale)} onClick={closeMobileMenu}>
                {t(messages, "nav.drops", "Drops")}
              </Link>
            </li>
            {ENABLE_PUBLIC_CONTACT ? (
              <li>
                <Link href={withLocale("/contact", locale)} onClick={closeMobileMenu}>
                  {t(messages, "nav.contact", locale === "tr" ? "İletişim" : "Contact")}
                </Link>
              </li>
            ) : null}
          </ul>
        </nav>

        <div className="marketing-nav-mobile-footer site-nav-mobile-footer">
          <ProjectCtaLink
            href={projectCtaUrl}
            className="marketing-navbar-cta marketing-nav-mobile-cta"
            onClick={closeMobileMenu}
          >
            {t(messages, "nav.startProject", locale === "tr" ? "Projeye başla" : "Start a project")}
          </ProjectCtaLink>
        </div>
      </SiteNavMobileOverlay>
    </>
  );
}
