import type { ReactElement, ReactNode } from "react";
import type { SiteSettings } from "@/types";

const FOOTER_ICON_GLYPH = "var(--color-accent)";
const FOOTER_ICON_BG = "var(--white-fixed)";

/** Beyaz squircle + mor glyph */
function FooterSocialSquircle({ children }: { children: ReactNode }) {
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
      <rect width="48" height="48" rx="12" fill={FOOTER_ICON_BG} />
      {children}
    </svg>
  );
}

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

/** Beyaz squircle + mor önplan */
function IconLinkedIn() {
  return (
    <FooterSocialSquircle>
      <text
        x="24"
        y="31"
        textAnchor="middle"
        fill={FOOTER_ICON_GLYPH}
        style={{
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          fontSize: "17px",
          fontWeight: 900,
        }}
      >
        in
      </text>
    </FooterSocialSquircle>
  );
}

function IconBehance() {
  return (
    <FooterSocialSquircle>
      <text
        x="24"
        y="31"
        textAnchor="middle"
        fill={FOOTER_ICON_GLYPH}
        style={{
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          fontSize: "15.5px",
          fontWeight: 800,
        }}
      >
        Bē
      </text>
    </FooterSocialSquircle>
  );
}

function IconInstagram() {
  return (
    <FooterSocialSquircle>
      <g transform="translate(12, 12)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
          fill={FOOTER_ICON_GLYPH}
        />
        <path
          d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z"
          fill={FOOTER_ICON_GLYPH}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z"
          fill={FOOTER_ICON_GLYPH}
        />
      </g>
    </FooterSocialSquircle>
  );
}

function IconDribbble() {
  return (
    <FooterSocialSquircle>
      <g transform="translate(12, 12)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM5.14386 17.8201C3.81099 16.2515 3.00683 14.2197 3.00683 12L3.00683 11.9978C6.61307 11.9618 9.57567 11.4838 12.2422 10.5779C12.4668 11.0605 12.6847 11.5534 12.8956 12.0564C12.5555 12.1691 12.221 12.2949 11.8918 12.4335C9.24177 13.5489 7.00538 15.4612 5.14386 17.8201ZM6.60614 19.1967C8.10884 20.3248 9.97636 20.9932 12 20.9932C13.2188 20.9932 14.3809 20.7507 15.4409 20.3114C14.9668 18.0368 14.352 15.907 13.6265 13.9217C13.3003 14.0264 12.9807 14.1451 12.6677 14.2768C10.356 15.2499 8.33843 16.9649 6.60614 19.1967ZM15.5924 13.4765C16.2479 15.3019 16.8129 17.2399 17.267 19.2902C19.048 18.0013 20.338 16.0757 20.8032 13.8473C18.9143 13.3589 17.1821 13.2604 15.5924 13.4765ZM14.8575 11.5662C16.754 11.2412 18.7996 11.3067 20.9917 11.8332C20.9578 9.97415 20.3599 8.25291 19.3619 6.8334C17.6358 8.0531 15.9276 9.06168 14.1111 9.85398C14.3687 10.4121 14.6177 10.9829 14.8575 11.5662ZM11.3457 8.76846C8.99734 9.53429 6.39047 9.94463 3.2312 9.9948C3.85725 7.24565 5.74294 4.97565 8.24906 3.82401C9.34941 5.31262 10.3933 6.96064 11.3457 8.76846ZM13.2302 8.05623C14.8876 7.34152 16.4466 6.43089 18.0282 5.32624C16.4333 3.88469 14.3192 3.00683 12 3.00683C11.4014 3.00683 10.8165 3.06531 10.2506 3.17688C11.3103 4.66337 12.3129 6.28992 13.2302 8.05623Z"
          fill={FOOTER_ICON_GLYPH}
        />
      </g>
    </FooterSocialSquircle>
  );
}

function IconPinterest() {
  return (
    <FooterSocialSquircle>
      <g transform="translate(8, 8)">
        <path
          d="M 16.09375 4 C 11.01675 4 6 7.3833281 6 12.861328 C 6 16.344328 7.9584844 18.324219 9.1464844 18.324219 C 9.6364844 18.324219 9.9199219 16.958266 9.9199219 16.572266 C 9.9199219 16.112266 8.7460938 15.131797 8.7460938 13.216797 C 8.7460938 9.2387969 11.774359 6.4199219 15.693359 6.4199219 C 19.063359 6.4199219 21.556641 8.3335625 21.556641 11.851562 C 21.556641 14.478563 20.501891 19.40625 17.087891 19.40625 C 15.855891 19.40625 14.802734 18.516234 14.802734 17.240234 C 14.802734 15.370234 16 13.558906 16 11.628906 C 16 8.3529063 11.462891 8.94725 11.462891 12.90625 C 11.462891 13.73725 11.5665 14.657063 11.9375 15.414062 C 11.2555 18.353063 10 23.037406 10 26.066406 C 10 27.001406 10.133656 27.921422 10.222656 28.857422 C 10.390656 29.045422 10.307453 29.025641 10.564453 28.931641 C 13.058453 25.517641 12.827078 24.544172 13.955078 20.076172 C 14.564078 21.234172 16.137766 21.857422 17.384766 21.857422 C 22.639766 21.857422 25 16.736141 25 12.119141 C 25 7.2061406 20.75475 4 16.09375 4 z"
          fill={FOOTER_ICON_GLYPH}
        />
      </g>
    </FooterSocialSquircle>
  );
}

function IconYoutube() {
  return (
    <FooterSocialSquircle>
      <rect x="10" y="15.5" width="28" height="17" rx="7" fill={FOOTER_ICON_GLYPH} />
      <path d="M21 19.5v9l8-4.5-8-4.5z" fill={FOOTER_ICON_BG} />
    </FooterSocialSquircle>
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

  const tileClass = "site-footer-social-btn";

  const tileMuted =
    "pointer-events-none cursor-default opacity-70 hover:translate-y-0 hover:opacity-70";

  return (
    <ul
      className={`site-footer-social site-footer-social--grid ${className ?? ""}`}
      aria-label="Social links"
    >
      {entries.map(({ href, label, Icon, hasUrl }) => {
        const ariaLabel = hasUrl
          ? `${label} — yeni sekmede aç`
          : `${label} — bağlantı henüz eklenmedi`;
        const className = `${tileClass}${hasUrl ? "" : ` ${tileMuted}`}`;

        if (hasUrl) {
          return (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={ariaLabel}
                className={className}
              >
                <Icon />
              </a>
            </li>
          );
        }

        return (
          <li key={label}>
            <span aria-disabled="true" aria-label={ariaLabel} className={className}>
              <Icon />
            </span>
          </li>
        );
      })}
    </ul>
  );
}
