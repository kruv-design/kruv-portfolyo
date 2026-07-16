import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  PROTEL_AUTH_COOKIE,
  protelAuthCookieOptions,
  resolveProtelPassword,
  verifyProtelPassword,
} from "@/lib/protel-auth";
import { protelUnlockSchema } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = protelUnlockSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz istek." },
        { status: 400 },
      );
    }

    if (!(await resolveProtelPassword())) {
      return NextResponse.json(
        { error: "Sayfa şifresi tanımlı değil. Supabase'de protel_page_secrets tablosunu çalıştırın." },
        { status: 503 },
      );
    }

    if (!(await verifyProtelPassword(parsed.data.password))) {
      return NextResponse.json({ error: "Şifre hatalı." }, { status: 401 });
    }

    const jar = await cookies();
    jar.set(PROTEL_AUTH_COOKIE, "1", protelAuthCookieOptions());

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[POST /api/protel/unlock]", e);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
