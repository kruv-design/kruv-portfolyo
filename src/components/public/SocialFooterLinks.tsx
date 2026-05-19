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
      className="overflow-hidden rounded-[length:var(--radius-lg)]"
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
      className="overflow-hidden rounded-[length:var(--radius-lg)]"
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
      className="overflow-hidden rounded-[length:var(--radius-lg)]"
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
      className="overflow-hidden rounded-[length:var(--radius-lg)]"
    >
      <rect width="48" height="48" rx="12" fill="var(--color-accent)" />
      <circle cx="24" cy="24" r="12.5" fill="var(--black-fixed)" />
      <path
        d="M14 19c4 2 8 3 12 3M16 29c3-4 7-7 12-8M32 17c-2 5-6 9-11 11"
        stroke="var(--color-accent)"
        strokeWidth="2.2"
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
      className="overflow-hidden rounded-[length:var(--radius-lg)]"
    >
      <rect width="48" height="48" rx="12" fill="var(--color-accent)" />
      <g transform="translate(12 12) scale(2)" fill="var(--black-fixed)">
        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.994-.283 1.194.599 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
      </g>
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
      className="overflow-hidden rounded-[length:var(--radius-lg)]"
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
    "inline-flex h-[3.25rem] w-[3.25rem] flex-shrink-0 items-center justify-center overflow-hidden rounded-[length:var(--radius-lg)] bg-transparent p-0 text-ink transition-all duration-200 hover:-translate-y-px hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)]";

  const tileMuted =
    "pointer-events-none cursor-default opacity-70 hover:translate-y-0 hover:opacity-70";

  return (
    <nav
      className={`grid w-full max-w-[11.25rem] grid-cols-3 gap-3 ${className ?? ""}`}
      aria-label="Social links"
    >
      {entries.map(({ href, label, Icon, hasUrl }) => (
        <a
          key={label}
          href={hasUrl ? href : "#"}
          {...(hasUrl
            ? { target: "_blank", rel: "noopener noreferrer" }
            : { "aria-disabled": true, tabIndex: -1 })}
          aria-label={
            hasUrl ? `${label} — yeni sekmede aç` : `${label} — bağlantı henüz eklenmedi`
          }
          className={`${tileClass}${hasUrl ? "" : ` ${tileMuted}`}`}
          onClick={
            hasUrl
              ? undefined
              : (e) => {
                  e.preventDefault();
                }
          }
        >
          <Icon />
        </a>
      ))}
    </nav>
  );
}
