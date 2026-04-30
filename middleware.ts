import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/** Kök `/` artık `src/app/route.ts` (GET) ile `public/kruv.html` döndürüyor — rewrite gerekmez. */
export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|woff2?)$).*)",
  ],
};
