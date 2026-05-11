import type { ReactElement } from "react";
import type { SiteSettings } from "@/types";

type Entry = {
  href: string;
  label: string;
  Icon: () => ReactElement;
};

/** Mor (#5D5DFF) squircle + siyah önplan — statik footer ile aynı dil */
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

function IconX() {
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
      <path
        d="M14 14 L34 34 M34 14 L14 34"
        stroke="var(--black-fixed)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconGithub() {
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
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </g>
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
  const entries: Entry[] = [
    { href: settings.linkedinUrl.trim(), label: "LinkedIn", Icon: IconLinkedIn },
    { href: settings.behanceUrl.trim(), label: "Behance", Icon: IconBehance },
    { href: settings.instagramUrl.trim(), label: "Instagram", Icon: IconInstagram },
    { href: settings.dribbbleUrl.trim(), label: "Dribbble", Icon: IconDribbble },
    { href: settings.pinterestUrl.trim(), label: "Pinterest", Icon: IconPinterest },
    { href: settings.youtubeUrl.trim(), label: "YouTube", Icon: IconYoutube },
    { href: settings.xUrl.trim(), label: "X", Icon: IconX },
    { href: settings.githubUrl.trim(), label: "GitHub", Icon: IconGithub },
  ].filter((e): e is Entry => Boolean(e.href));

  if (entries.length === 0) return null;

  const tileClass =
    "inline-flex h-[3.25rem] w-[3.25rem] flex-shrink-0 items-center justify-center overflow-hidden rounded-[length:var(--radius-lg)] bg-transparent p-0 text-ink transition-all duration-200 hover:-translate-y-px hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)]";

  return (
    <nav
      className={`grid w-full max-w-[11.25rem] grid-cols-3 gap-3 ${className ?? ""}`}
      aria-label="Social links"
    >
      {entries.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${label} — yeni sekmede aç`}
          className={tileClass}
        >
          <Icon />
        </a>
      ))}
    </nav>
  );
}
