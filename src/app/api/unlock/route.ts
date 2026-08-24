import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  DASHBOARD_AUTH_COOKIE,
  dashboardAuthCookieOptions,
  isDashboardPasswordConfigured,
  verifyDashboardPassword,
} from "@/lib/dashboard-auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!isDashboardPasswordConfigured()) {
    return NextResponse.json(
      { error: "DASHBOARD_PASSWORD tanımlı değil (Vercel env)" },
      { status: 503 },
    );
  }

  let body: unknown = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const password =
    typeof body === "object" && body && "password" in body
      ? String((body as { password?: unknown }).password ?? "")
      : "";

  if (!verifyDashboardPassword(password)) {
    return NextResponse.json({ error: "Şifre hatalı." }, { status: 401 });
  }

  const jar = await cookies();
  jar.set(DASHBOARD_AUTH_COOKIE, "1", dashboardAuthCookieOptions());
  return NextResponse.json({ ok: true });
}
