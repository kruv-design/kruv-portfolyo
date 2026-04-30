import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Kök `/` → `public/kruv.html` (hover hero + ticker).
 * Matcher'a `/` açık yazılmalı; sadece `/((?!…).*)` kök path'i çoğu zaman eşleştirmez,
 * bu yüzden anasayfa yanlışlıkla `/works` benzeri başka davranışlara düşebilir.
 */
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    return NextResponse.rewrite(new URL("/kruv.html", request.url));
  }
  return updateSession(request);
}

export const config = {
  matcher: [
    "/",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|woff2?)$).*)",
  ],
};
