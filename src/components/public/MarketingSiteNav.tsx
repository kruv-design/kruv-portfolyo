"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { SiteSettings } from "@/types";
import { ThemeToggle } from "./ThemeToggle";

/**
 * kruv.html `nav.navbar` ile aynı yapı — Work sayfası ve homepage hissi.
 */
export function MarketingSiteNav({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

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

  const wordmark = (settings.siteAdi || "kruv.").split(".")[0]?.toUpperCase() || "KRUV";

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
              <Link href="/" className="marketing-navbar-logo brand" aria-label={`Home — ${wordmark}`}>
                <span className="marketing-navbar-logo-stack">
                  <span className="marketing-navbar-wordmark" aria-hidden="true">
                    {wordmark}
                  </span>
                </span>
              </Link>
            </div>
            <div className="marketing-navbar-col marketing-navbar-col--links">
              <ul className="marketing-navbar-links">
                <li>
                  <Link
                    href="/works"
                    className="marketing-navbar-item"
                    aria-current={pathname === "/works" ? "page" : undefined}
                  >
                    Work
                  </Link>
                </li>
                <li>
                  <Link href="/works#about" className="marketing-navbar-item">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="marketing-navbar-item">
                    Process
                  </Link>
                </li>
              </ul>
            </div>
            <div className="marketing-navbar-col marketing-navbar-col--cta">
              <div className="marketing-navbar-actions">
                <ThemeToggle />
                <Link href="/works#contact" className="marketing-navbar-cta">
                  Start a project
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
