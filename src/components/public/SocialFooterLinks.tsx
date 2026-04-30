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

export function SocialFooterLinks({ settings }: { settings: SiteSettings }) {
  const entries: Entry[] = [
    { href: settings.instagramUrl.trim(), label: "Instagram", Icon: IconInstagram },
    { href: settings.xUrl.trim(), label: "X", Icon: IconX },
    { href: settings.linkedinUrl.trim(), label: "LinkedIn", Icon: IconLinkedIn },
    { href: settings.behanceUrl.trim(), label: "Behance", Icon: IconBehance },
    { href: settings.dribbbleUrl.trim(), label: "Dribbble", Icon: IconDribbble },
    { href: settings.youtubeUrl.trim(), label: "YouTube", Icon: IconYoutube },
    { href: settings.githubUrl.trim(), label: "GitHub", Icon: IconGithub },
  ].filter((e): e is Entry => Boolean(e.href));

  if (entries.length === 0) return null;

  return (
    <nav
      className="flex flex-shrink-0 flex-wrap items-center justify-end gap-1"
      aria-label="Sosyal medya"
    >
      {entries.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${label} — yeni sekmede aç`}
          className="inline-flex h-9 w-9 items-center justify-center rounded border border-border text-ink-soft transition-colors duration-150 hover:border-border-md hover:bg-adm-surface hover:text-ink"
        >
          <Icon />
        </a>
      ))}
    </nav>
  );
}
