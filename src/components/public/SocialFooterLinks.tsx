import type { ReactElement } from "react";
import type { SiteSettings } from "@/types";

type Entry = {
  href: string;
  label: string;
  Icon: () => ReactElement;
};

function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 4l16 16M20 4L4 20"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 9h4v12H2z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function IconBehance() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 11h5a3 3 0 010 6H8V5h4a2.5 2.5 0 010 5M16 8h5M16 12h3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconDribbble() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M3 12h18M5 5c4 6 6 10 7 14M19 5c-3 5-7 9-11 11"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconYoutube() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="6" width="20" height="12" rx="3" stroke="currentColor" strokeWidth="1.75" />
      <path d="M10 10l5 2-5 2v-4z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconPinterest() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2C6.48 2 2 6.48 2 12c0 4.84 3.44 8.87 8 9.8-.11-.78-.2-2.05.05-2.94.21-.9 1.38-5.72 1.38-5.72s-.35-.7-.35-1.75c0-1.64.95-2.87 2.14-2.87 1 0 1.49.75 1.49 1.65 0 1-.64 2.5-.97 3.89-.28 1.16.6 2.11 1.78 2.11 2.14 0 3.78-2.26 3.78-5.52 0-2.89-2.08-4.91-5.04-4.91-3.43 0-5.44 2.58-5.44 5.24 0 1.04.4 2.16.9 2.76.1.12.11.22.08.34l-.33 1.36c-.05.22-.18.27-.41.16-1.54-.72-2.5-2.97-2.5-4.78 0-3.9 2.83-7.48 8.16-7.48 4.28 0 7.6 3.05 7.6 7.13 0 4.25-2.68 7.67-6.4 7.67-1.25 0-2.43-.65-2.83-1.42l-.77 2.95c-.28 1.08-1.04 2.43-1.55 3.26 1.17.36 2.41.55 3.69.55 5.52 0 10-4.48 10-10S17.52 2 12 2z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconGithub() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 18 4.77 5.07 5.07 0 0 0 17.91 1S16.73.65 14 2.48a13.38 13.38 0 0 0-7 0C4.27.65 3.09 1 3.09 1A5.07 5.07 0 0 0 3 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 7 18.13V22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
          className="inline-flex h-[3.25rem] w-[3.25rem] flex-shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[color:var(--gray-200)] text-ink transition-all duration-200 hover:-translate-y-px hover:bg-[color:var(--gray-300)] hover:text-[color:var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)]"
        >
          <Icon />
        </a>
      ))}
    </nav>
  );
}
