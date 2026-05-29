import { readFile } from "node:fs/promises";
import path from "node:path";

const HERO_PARTIAL_PATH = path.join(process.cwd(), "public", "partials", "hero-v2.html");
export const HERO_V2_PARTIAL_MARKER = "<!-- @partial:hero-v2 -->";

export type HeroV2Copy = {
  lang: string;
  staticLine: string;
  word: string;
  suffix: string;
  cursorLabel: string;
  mobileCta: string;
  mobileCtaA11y: string;
};

export type HeroV2Options = {
  ctaHref?: string;
  /** Doluysa masaüstü hero tıklaması bu URL’ye gider (ör. `/works`). */
  scrollHref?: string;
  copy?: HeroV2Copy;
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(text: string): string {
  return escapeHtml(text).replace(/'/g, "&#39;");
}

const DEFAULT_COPY: HeroV2Copy = {
  lang: "en",
  staticLine: "We build",
  word: "brands",
  suffix: "worth-sharing.",
  cursorLabel: "See projects",
  mobileCta: "See projects",
  mobileCtaA11y: "See projects — open portfolio",
};

/** Ortak hero-v2 HTML — `public/partials/hero-v2.html` tek kaynak. */
export async function loadHeroV2Html(options: HeroV2Options = {}): Promise<string> {
  const { ctaHref = "/works", copy = DEFAULT_COPY } = options;
  /** Boş bırakılırsa sayfa içi `#works`; varsayılan CTA ile aynı (`/works`). */
  const scrollHref =
    options.scrollHref !== undefined ? options.scrollHref : ctaHref;
  const raw = await readFile(HERO_PARTIAL_PATH, "utf8");
  return raw
    .replace(/\{\{CTA_HREF\}\}/g, escapeAttr(ctaHref))
    .replace(/\{\{SCROLL_HREF\}\}/g, escapeAttr(scrollHref))
    .replace(/\{\{HERO_LANG\}\}/g, escapeAttr(copy.lang))
    .replace(/\{\{HERO_STATIC\}\}/g, escapeHtml(copy.staticLine))
    .replace(/\{\{HERO_WORD\}\}/g, escapeHtml(copy.word))
    .replace(/\{\{HERO_SUFFIX\}\}/g, escapeHtml(copy.suffix))
    .replace(/\{\{CURSOR_LABEL\}\}/g, escapeHtml(copy.cursorLabel))
    .replace(/\{\{MOBILE_CTA\}\}/g, escapeHtml(copy.mobileCta))
    .replace(/\{\{MOBILE_CTA_A11Y\}\}/g, escapeHtml(copy.mobileCtaA11y));
}

/** Statik `kruv.html` gövdesine partial enjekte eder. */
export async function injectHeroV2IntoPageHtml(
  pageHtml: string,
  options: HeroV2Options = {},
): Promise<string> {
  const hero = await loadHeroV2Html(options);
  if (pageHtml.includes(HERO_V2_PARTIAL_MARKER)) {
    return pageHtml.replace(HERO_V2_PARTIAL_MARKER, hero);
  }
  return pageHtml;
}
