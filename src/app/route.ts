import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { injectHeroV2IntoPageHtml } from "@/lib/marketing-hero";

export const runtime = "nodejs";

/** Kök `/` — statik `public/kruv.html` gövdesini döndürür (marketing homepage). */
async function kruvHtmlResponse(): Promise<NextResponse> {
  const filePath = path.join(process.cwd(), "public", "kruv.html");
  const raw = await readFile(filePath, "utf8");
  const html = await injectHeroV2IntoPageHtml(raw, {
    ctaHref: "/tr/works",
    scrollHref: "/tr/works",
  });
  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}

export async function GET() {
  try {
    return await kruvHtmlResponse();
  } catch (err) {
    console.error("[GET /] kruv.html", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function HEAD() {
  try {
    const res = await kruvHtmlResponse();
    return new NextResponse(null, {
      status: res.status,
      headers: res.headers,
    });
  } catch (err) {
    console.error("[HEAD /] kruv.html", err);
    return new NextResponse(null, { status: 500 });
  }
}
