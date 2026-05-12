import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/** Kök `/` artık `src/app/route.ts` (GET) ile `public/kruv.html` döndürüyor — rewrite gerekmez. */
export async function middleware(request: NextRequest) {
  try {
    return await updateSession(request);
  } catch (err) {
    console.error("[middleware]", err);
    const { pathname } = request.nextUrl;
    if (pathname.startsWith("/admin")) {
      const next = request.nextUrl.clone();
      next.pathname = "/login";
      next.searchParams.set("next", pathname);
      return NextResponse.redirect(next);
    }
    return NextResponse.next({ request });
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|woff2?)$).*)",
  ],
};
