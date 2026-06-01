import type { ReactElement } from "react";
import type { SiteSettings } from "@/types";

type PlatformKey =
  | "linkedinUrl"
  | "behanceUrl"
  | "instagramUrl"
  | "dribbbleUrl"
  | "pinterestUrl"
  | "youtubeUrl";

type Entry = {
  href: string;
  label: string;
  Icon: () => ReactElement;
  hasUrl: boolean;
};

/** Statik kruv.html footer ile aynı 6 platform — URL yokken de ikonlar görünür */
const FOOTER_PLATFORMS: {
  key: PlatformKey;
  label: string;
  Icon: () => ReactElement;
}[] = [
  { key: "linkedinUrl", label: "LinkedIn", Icon: IconLinkedIn },
  { key: "behanceUrl", label: "Behance", Icon: IconBehance },
  { key: "instagramUrl", label: "Instagram", Icon: IconInstagram },
  { key: "dribbbleUrl", label: "Dribbble", Icon: IconDribbble },
  { key: "pinterestUrl", label: "Pinterest", Icon: IconPinterest },
  { key: "youtubeUrl", label: "YouTube", Icon: IconYoutube },
];

/** Aksan (indigo) squircle + siyah önplan — statik footer ile aynı dil */
function IconLinkedIn() {
  return (
    <svg
      viewBox="0 0 48 48"
      width="100%"
      height="100%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="overflow-hidden rounded-[var(--radius-lg)]"
    >
      <rect width="48" height="48" rx="12" fill="var(--color-accent)" />
      <text
        x="24"
        y="31"
        textAnchor="middle"
        fill="var(--black-fixed)"
        style={{
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          fontSize: "17px",
          fontWeight: 900,
        }}
      >
        in
      </text>
    </svg>
  );
}

function IconBehance() {
  return (
    <svg
      viewBox="0 0 48 48"
      width="100%"
      height="100%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="overflow-hidden rounded-[var(--radius-lg)]"
    >
      <rect width="48" height="48" rx="12" fill="var(--color-accent)" />
      <text
        x="24"
        y="31"
        textAnchor="middle"
        fill="var(--black-fixed)"
        style={{
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          fontSize: "15.5px",
          fontWeight: 800,
        }}
      >
        Bē
      </text>
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg
      viewBox="0 0 48 48"
      width="100%"
      height="100%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="overflow-hidden rounded-[var(--radius-lg)]"
    >
      <rect width="48" height="48" rx="12" fill="var(--color-accent)" />
      <circle cx="24" cy="26" r="7.5" stroke="var(--black-fixed)" strokeWidth="3" fill="none" />
      <circle cx="34.5" cy="14.5" r="2.4" fill="var(--black-fixed)" />
    </svg>
  );
}

function IconDribbble() {
  return (
    <svg
      viewBox="0 0 48 48"
      width="100%"
      height="100%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="overflow-hidden rounded-[var(--radius-lg)]"
    >
      <rect width="48" height="48" rx="12" fill="var(--color-accent)" />
      <circle cx="24" cy="24" r="10" fill="var(--black-fixed)" />
      <path
        d="M16.5 21.5c3 0.75 6 1 9 0.25M17.5 26c2.5-1 5-1.5 8-0.5M27.5 18.5c-0.75 2.75-2 5-4.5 6.5"
        stroke="var(--color-accent)"
        strokeWidth="1.85"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconPinterest() {
  return (
    <svg
      viewBox="0 0 48 48"
      width="100%"
      height="100%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="overflow-hidden rounded-[var(--radius-lg)]"
    >
      <rect width="48" height="48" rx="12" fill="var(--color-accent)" />
      <text
        x="24"
        y="31"
        textAnchor="middle"
        fill="var(--black-fixed)"
        style={{
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          fontSize: "22px",
          fontWeight: 900,
        }}
      >
        P
      </text>
    </svg>
  );
}

function IconYoutube() {
  return (
    <svg
      viewBox="0 0 48 48"
      width="100%"
      height="100%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="overflow-hidden rounded-[var(--radius-lg)]"
    >
      <rect width="48" height="48" rx="12" fill="var(--color-accent)" />
      <rect x="10" y="15.5" width="28" height="17" rx="7" fill="var(--black-fixed)" />
      <path d="M21 19.5v9l8-4.5-8-4.5z" fill="var(--color-accent)" />
    </svg>
  );
}

export function SocialFooterLinks({
  settings,
  className,
}: {
  settings: SiteSettings;
  className?: string;
}) {
  const entries: Entry[] = FOOTER_PLATFORMS.map(({ key, label, Icon }) => {
    const href = settings[key].trim();
    return { href, label, Icon, hasUrl: Boolean(href) };
  });

  const tileClass =
    "inline-flex h-[3.25rem] w-[3.25rem] flex-shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-lg)] bg-transparent p-0 text-ink transition-all duration-200 hover:-translate-y-px hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)]";

  const tileMuted =
    "pointer-events-none cursor-default opacity-70 hover:translate-y-0 hover:opacity-70";

  return (
    <nav
      className={`grid w-full max-w-[11.25rem] grid-cols-3 gap-3 ${className ?? ""}`}
      aria-label="Social links"
    >
      {entries.map(({ href, label, Icon, hasUrl }) => {
        const ariaLabel = hasUrl
          ? `${label} — yeni sekmede aç`
          : `${label} — bağlantı henüz eklenmedi`;
        const className = `${tileClass}${hasUrl ? "" : ` ${tileMuted}`}`;

        if (hasUrl) {
          return (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={ariaLabel}
              className={className}
            >
              <Icon />
            </a>
          );
        }

        return (
          <span key={label} aria-disabled="true" aria-label={ariaLabel} className={className}>
            <Icon />
          </span>
        );
      })}
    </nav>
  );
}
