import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  DASHBOARD_AUTH_COOKIE,
  isDashboardCookieAuthed,
  isDashboardPasswordConfigured,
} from "@/lib/dashboard-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isDashboardPasswordConfigured()) {
    return NextResponse.json(
      { error: "DASHBOARD_PASSWORD tanımlı değil", authed: false },
      { status: 503 },
    );
  }

  const jar = await cookies();
  const authed = isDashboardCookieAuthed((name) =>
    name === DASHBOARD_AUTH_COOKIE ? jar.get(name)?.value : undefined,
  );
  return NextResponse.json({ authed });
}
