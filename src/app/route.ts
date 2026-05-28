import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOCALE, normalizeLocale } from "@/lib/i18n/config";

export const runtime = "nodejs";

function resolveLocale(request: NextRequest): "tr" | "en" {
  const cookieLocale = normalizeLocale(request.cookies.get("kruv-locale")?.value);
  if (cookieLocale) return cookieLocale;
  const headerLocale = normalizeLocale(
    request.headers.get("accept-language")?.split(",")[0],
  );
  return headerLocale || DEFAULT_LOCALE;
}

/** Kök `/` artık locale-aware `/tr/works` veya `/en/works` yönlendirmesi yapar. */
export async function GET(request: NextRequest) {
  const locale = resolveLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}/works`;
  return NextResponse.redirect(url);
}

export async function HEAD(request: NextRequest) {
  const locale = resolveLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}/works`;
  return NextResponse.redirect(url);
}
