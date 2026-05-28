import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Locale } from "@/lib/i18n/config";
import { withLocale } from "@/lib/i18n/path";

const KRUV_HTML_PATH = path.join(process.cwd(), "public", "kruv.html");

/** `kruv.html` içinde hero altı gövde başlangıcı (ticker band). */
const HOME_BODY_START = '<div class="ticker">';
const HOME_FOOTER_START = '<footer class="site-footer"';

function sliceBetween(html: string, start: string, end: string): string {
  const from = html.indexOf(start);
  if (from === -1) {
    throw new Error(`marketing-home: start marker not found: ${start.slice(0, 40)}`);
  }
  const to = html.indexOf(end, from + start.length);
  if (to === -1) {
    throw new Error(`marketing-home: end marker not found after body start`);
  }
  return html.slice(from, to).trim();
}

function sliceFooter(html: string): string {
  const from = html.indexOf(HOME_FOOTER_START);
  if (from === -1) throw new Error("marketing-home: footer not found");
  const close = html.indexOf("</footer>", from);
  if (close === -1) throw new Error("marketing-home: footer close not found");
  return html.slice(from, close + "</footer>".length).trim();
}

/** Göreli asset ve dahili linkleri Next locale yollarına çevirir. */
export function rewriteMarketingHomeHtml(html: string, locale: Locale): string {
  let out = html;

  out = out.replace(/\b(src|href)="assets\//g, '$1="/assets/');
  out = out.replace(/'link\//g, "'/link/");

  out = out.replace(/href="\/contact"/g, `href="${withLocale("/contact", locale)}"`);
  out = out.replace(/href="\/works([^"]*)"/g, (_, rest: string) => {
    const suffix = rest || "";
    return `href="${withLocale("/works", locale)}${suffix}"`;
  });
  out = out.replace(/href="\/projects\//g, `href="${withLocale("/projects/", locale)}`);
  out = out.replace(/href="\/#hero"/g, `href="${withLocale("/", locale)}#hero"`);
  out = out.replace(/href="\/"/g, `href="${withLocale("/", locale)}"`);

  return out;
}

function patchHomeScript(content: string, locale: Locale): string {
  const projectsBase = withLocale("/projects/", locale);
  return content.replace(
    /function projectURL\(slug\) \{\s*return '\/projects\/' \+ encodeURIComponent\(slug \|\| ''\);\s*\}/,
    `function projectURL(slug) { return '${projectsBase}' + encodeURIComponent(slug || ''); }`,
  );
}

function shouldIncludeHomeScript(content: string): boolean {
  if (
    content.includes("site-nav") ||
    content.includes("nav-menu-toggle") ||
    content.includes("lanShareHint") ||
    content.includes("heroCylinder") ||
    content.includes("fan-wrap") ||
    content.includes("lang-switch-trigger") ||
    content.includes("kruv-theme") ||
    content.includes("Global wheel dampening")
  ) {
    return false;
  }

  return (
    content.includes("featured-works") ||
    content.includes("focusList") ||
    content.includes("getElementById('scene')") ||
    content.includes("testimonialsMarquee") ||
    content.includes("scroll-theme-bridge") ||
    content.includes("/api/projects") ||
    content.includes("hydrateFooterSocial") ||
    content.includes("initIdealShareMarquee") ||
    content.includes("location.hash !== '#hero'")
  );
}

function extractHomeScripts(html: string, locale: Locale): string[] {
  const footerEnd = html.indexOf("</footer>");
  const rotatorIdx = html.indexOf('<script src="/hero-v2-rotator.js"');
  if (footerEnd === -1 || rotatorIdx === -1) return [];

  const chunk = html.slice(footerEnd, rotatorIdx);
  const scripts: string[] = [];
  const re = /<script>\s*([\s\S]*?)<\/script>/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(chunk))) {
    const content = match[1]?.trim() ?? "";
    if (!content || !shouldIncludeHomeScript(content)) continue;
    scripts.push(patchHomeScript(content, locale));
  }
  return scripts;
}

export type MarketingHomeContent = {
  bodyHtml: string;
  footerHtml: string;
  scripts: string[];
};

let cachedRaw: string | null = null;

async function readKruvHtml(): Promise<string> {
  if (cachedRaw) return cachedRaw;
  cachedRaw = await readFile(KRUV_HTML_PATH, "utf8");
  return cachedRaw;
}

/** Hero altı marketing gövdesi + footer + etkileşim scriptleri — tek kaynak `public/kruv.html`. */
export async function loadMarketingHomeContent(
  locale: Locale,
): Promise<MarketingHomeContent> {
  const html = await readKruvHtml();
  const bodyRaw = sliceBetween(html, HOME_BODY_START, HOME_FOOTER_START);
  const footerRaw = sliceFooter(html);

  return {
    bodyHtml: rewriteMarketingHomeHtml(bodyRaw, locale),
    footerHtml: rewriteMarketingHomeHtml(footerRaw, locale),
    scripts: extractHomeScripts(html, locale),
  };
}
