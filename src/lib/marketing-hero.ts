import { readFile } from "node:fs/promises";
import path from "node:path";

const HERO_PARTIAL_PATH = path.join(process.cwd(), "public", "partials", "hero-v2.html");
const HERO_INNER_PARTIAL_PATH = path.join(
  process.cwd(),
  "public",
  "partials",
  "hero-v2-inner.html",
);
export const HERO_V2_PARTIAL_MARKER = "<!-- @partial:hero-v2 -->";
export const HERO_V2_INNER_MARKER = "<!-- @partial:hero-v2-inner -->";

export type HeroV2Copy = {
  lang: string;
  /** Mor satır (accent) */
  line1: string;
  /** Siyah satır (main) */
  line2: string;
  line2Tail?: string;
  /** accent-first = mor üst (TR) | main-first = siyah üst (EN) */
  lineOrder?: "accent-first" | "main-first";
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

function buildLine2Html(copy: HeroV2Copy): string {
  const lead = copy.line2.trim();
  const tail = copy.line2Tail?.trim() ?? "";

  if (!tail) {
    return `<span class="hero-v2-main">${escapeHtml(lead)}</span>`;
  }

  return `<span class="hero-v2-main hero-v2-main--split"><span class="hero-v2-main-part">${escapeHtml(lead)}</span><span class="hero-v2-main-part">${escapeHtml(tail)}</span></span>`;
}

const DEFAULT_COPY: HeroV2Copy = {
  lang: "en",
  line1: "Worth-sharing.",
  line2: "We build",
  line2Tail: "brands",
  lineOrder: "main-first",
};

function applyHeroV2Replacements(html: string, options: HeroV2Options): string {
  const { ctaHref = "/works", copy = DEFAULT_COPY } = options;
  const scrollHref =
    options.scrollHref !== undefined ? options.scrollHref : ctaHref;
  const lineOrder = copy.lineOrder === "main-first" ? "main-first" : "accent-first";
  return html
    .replace(/\{\{CTA_HREF\}\}/g, escapeAttr(ctaHref))
    .replace(/\{\{SCROLL_HREF\}\}/g, escapeAttr(scrollHref))
    .replace(/\{\{HERO_LANG\}\}/g, escapeAttr(copy.lang))
    .replace(/\{\{HERO_LINE_ORDER\}\}/g, escapeAttr(lineOrder))
    .replace(/\{\{HERO_LINE1\}\}/g, escapeHtml(copy.line1))
    .replace(/\{\{HERO_LINE2_HTML\}\}/g, buildLine2Html(copy));
}

/** Hero iç gövde — tipografi + imleç (`hero-v2-inner.html`). */
export async function loadHeroV2InnerHtml(options: HeroV2Options = {}): Promise<string> {
  const raw = await readFile(HERO_INNER_PARTIAL_PATH, "utf8");
  return applyHeroV2Replacements(raw, options);
}

/** Tam `<section>` — statik `kruv.html` enjeksiyonu. */
export async function loadHeroV2Html(options: HeroV2Options = {}): Promise<string> {
  const [shell, inner] = await Promise.all([
    readFile(HERO_PARTIAL_PATH, "utf8"),
    loadHeroV2InnerHtml(options),
  ]);
  return shell.replace(HERO_V2_INNER_MARKER, inner);
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
  if (pageHtml.includes(HERO_V2_INNER_MARKER)) {
    const inner = await loadHeroV2InnerHtml(options);
    return pageHtml.replace(HERO_V2_INNER_MARKER, inner);
  }
  return pageHtml;
}
