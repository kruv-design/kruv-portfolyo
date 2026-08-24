import "server-only";
import { headers, cookies } from "next/headers";
import {
  DASHBOARD_AUTH_COOKIE,
  isDashboardCookieAuthed,
  isDashboardPasswordConfigured,
  shouldEnforceDashboardGate,
} from "@/lib/dashboard-auth";

/** Route handler’da `catch` ile dönülecek 401/503 yanıtları ayırt etmek için. */
export function isAuthFailureResponse(e: unknown): e is Response {
  return e instanceof Response;
}

function hostFromHeaders(headerList: Headers): string {
  const raw = headerList.get("x-forwarded-host") || headerList.get("host") || "";
  return raw.split(",")[0]?.trim() ?? "";
}

/**
 * Admin yazma API’leri — kruvtest `requireAuth` ile aynı kapı.
 * Yerelde (localhost) atlanır; Vercel’de `dashboard_access` çerezi gerekir.
 */
export async function requireUser(): Promise<void> {
  const headerList = await headers();
  const hostname = hostFromHeaders(headerList);

  if (!shouldEnforceDashboardGate(hostname)) return;

  if (!isDashboardPasswordConfigured()) {
    throw Response.json(
      { error: "DASHBOARD_PASSWORD tanımlı değil (Vercel env)" },
      { status: 503 },
    );
  }

  const jar = await cookies();
  if (
    !isDashboardCookieAuthed((name) =>
      name === DASHBOARD_AUTH_COOKIE ? jar.get(name)?.value : undefined,
    )
  ) {
    throw Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
