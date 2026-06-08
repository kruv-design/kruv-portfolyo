import Link from "next/link";
import type { SiteSettings } from "@/types";
import {
  FOOTER_SERVICE_LINKS,
  HOME_HERO_HREF,
  worksPageHref,
} from "@/lib/work-filters";
import { SocialFooterLinks } from "./SocialFooterLinks";

export function SiteFooter({
  settings,
  count,
  total,
}: {
  settings: SiteSettings;
  count?: number;
  total?: number;
}) {
  const showCount =
    typeof count === "number" && typeof total === "number";

  return (
    <footer className="site-footer" id="contact" lang="en">
      <div className="site-footer-inner">
        <div className="site-footer-grid">
          <div className="site-footer-col">
            <h3 className="site-footer-heading">Services</h3>
            <ul className="site-footer-list site-footer-services">
              {FOOTER_SERVICE_LINKS.map(({ label, filter }) => (
                <li key={label}>
                  <Link
                    href={worksPageHref(filter)}
                    className="site-footer-service-link"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <nav className="site-footer-col" aria-label="Sitemap">
            <h3 className="site-footer-heading">Sitemap</h3>
            <ul className="site-footer-list site-footer-links">
              <li>
                <Link href={HOME_HERO_HREF}>Home</Link>
              </li>
              <li>
                <Link href={worksPageHref()}>Projects</Link>
              </li>
              <li>
                <Link href="/contact">Contact us</Link>
              </li>
            </ul>
          </nav>

          <div className="site-footer-col site-footer-col--follow">
            <h3 className="site-footer-heading">Follow</h3>
            <SocialFooterLinks settings={settings} />
          </div>
        </div>

        <div
          className={`site-footer-bar${
            showCount ? " site-footer-bar--split" : ""
          }`}
        >
          {showCount ? (
            <p className="b2 site-footer-count">
              {count} / {total} projects
            </p>
          ) : null}
          <p className="b2 site-footer-legal">{settings.footerYazi}</p>
        </div>
      </div>
    </footer>
  );
}
