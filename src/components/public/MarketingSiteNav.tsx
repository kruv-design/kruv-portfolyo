"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import type { SiteSettings } from "@/types";
import { ThemeToggle } from "./ThemeToggle";
import {
  SiteNavMenuButton,
  SiteNavMobileOverlay,
  SITE_NAV_MOBILE_MENU_ID,
  SITE_NAV_SENTINEL_ID,
  useSiteNavScroll,
} from "./site-nav";

/**
 * Ortak site header — anasayfa (kruv.html) ile aynı markup + sınıflar.
 */
export function MarketingSiteNav({ settings }: { settings: SiteSettings }) {
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

  const isProjectsActive =
    pathname === "/works" || (pathname?.startsWith("/projects/") ?? false);
  const isContactActive = pathname === "/contact";

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  function onMobileSearch(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    const q = String(fd.get("q") ?? "").trim();
    closeMobileMenu();
    if (q) router.push(`/works?q=${encodeURIComponent(q)}`);
    else router.push("/works");
  }

  return (
    <>
      <div id={SITE_NAV_SENTINEL_ID} className="marketing-nav-sentinel" aria-hidden="true" />
      <nav
        id="site-nav"
        className={`marketing-navbar${scrolled ? " is-scrolled" : ""}${mobileMenuOpen ? " is-menu-open" : ""}`}
        aria-label="Primary"
        lang="en"
      >
        <div className="marketing-navbar-inner">
          <div className="marketing-navbar-cols">
            <div className="marketing-navbar-col marketing-navbar-col--brand">
              <Link href="/" className="marketing-navbar-logo brand" aria-label={`Home — ${brandLabel}`}>
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
                    href="/works"
                    className="marketing-navbar-item"
                    aria-current={isProjectsActive ? "page" : undefined}
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="marketing-navbar-item"
                    aria-current={isContactActive ? "page" : undefined}
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="marketing-navbar-col marketing-navbar-col--cta">
              <div className="marketing-navbar-actions">
                <ThemeToggle className="marketing-navbar-theme-toggle marketing-navbar-theme-toggle--dock nav-theme-toggle" />
                <Link href="/contact" className="marketing-navbar-cta">
                  Start a project
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
            Search
          </label>
          <input
            id="marketing-nav-mobile-q"
            name="q"
            type="search"
            placeholder="Search"
            autoComplete="off"
            enterKeyHint="search"
          />
        </form>

        <nav aria-label="Mobile">
          <ul className="marketing-nav-mobile-links site-nav-mobile-links">
            <li>
              <Link href="/works" onClick={closeMobileMenu}>
                Projects
              </Link>
            </li>
            <li>
              <Link href="/contact" onClick={closeMobileMenu}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </SiteNavMobileOverlay>
    </>
  );
}
