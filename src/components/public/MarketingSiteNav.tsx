"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import type { SiteSettings } from "@/types";
import { ThemeToggle } from "./ThemeToggle";

/**
 * kruv.html `nav.navbar` ile aynı yapı — Work sayfası ve homepage hissi.
 */
export function MarketingSiteNav({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname();
  const router = useRouter();
  const menuTitleId = useId();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("marketing-nav-sentinel");
    if (!sentinel || !("IntersectionObserver" in window)) {
      setScrolled(window.scrollY > 0);
      const onScroll = () => setScrolled(window.scrollY > 0);
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }
    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e) setScrolled(!e.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px" },
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, []);

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
      <div id="marketing-nav-sentinel" className="marketing-nav-sentinel" aria-hidden="true" />
      <nav
        className={`marketing-navbar${scrolled ? " is-scrolled" : ""}`}
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
                    aria-current={
                      pathname === "/works" || pathname?.startsWith("/projects/")
                        ? "page"
                        : undefined
                    }
                  >
                    Work
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="marketing-navbar-item"
                    aria-current={pathname === "/contact" ? "page" : undefined}
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="marketing-navbar-col marketing-navbar-col--cta">
              <div className="marketing-navbar-actions">
                <ThemeToggle className="marketing-navbar-theme-toggle marketing-navbar-theme-toggle--dock" />
                <Link href="/contact" className="marketing-navbar-cta">
                  Start a project
                </Link>
                <button
                  type="button"
                  className="marketing-navbar-menu-btn"
                  aria-expanded={mobileMenuOpen}
                  aria-controls="marketing-mobile-menu"
                  aria-haspopup="dialog"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <span className="sr-only">Open menu</span>
                  <span className="marketing-navbar-menu-btn__bars" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {mobileMenuOpen ? (
        <div
          id="marketing-mobile-menu"
          className="marketing-nav-mobile-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby={menuTitleId}
        >
          <div className="marketing-nav-mobile-overlay__top">
            <button
              type="button"
              className="marketing-nav-mobile-close"
              aria-label="Close menu"
              onClick={closeMobileMenu}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <h2 id={menuTitleId} className="sr-only">
            Menu
          </h2>

          <div className="marketing-nav-mobile-body">
            <ThemeToggle className="marketing-nav-mobile-theme-toggle" />

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
              <ul className="marketing-nav-mobile-links">
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
          </div>
        </div>
      ) : null}
    </>
  );
}
