import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

/** Kök `/` — React sayfası yok; statik `public/kruv.html` doğrudan gövde olarak döner (Vercel’de eski `page.tsx` önbelleğiyle çakışmaz). */
async function kruvHtmlResponse(): Promise<NextResponse> {
  const filePath = path.join(process.cwd(), "public", "kruv.html");
  const html = await readFile(filePath, "utf8");
  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}

export async function GET() {
  return kruvHtmlResponse();
}

export async function HEAD() {
  const res = await kruvHtmlResponse();
  return new NextResponse(null, {
    status: res.status,
    headers: res.headers,
  });
}
