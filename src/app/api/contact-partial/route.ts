import { NextResponse } from "next/server";
import { contactPartialBodySchema } from "@/lib/validators";
import { supabaseAdmin } from "@/lib/supabase/server";
import { ENABLE_PUBLIC_CONTACT } from "@/lib/marketing-flags";

export const runtime = "nodejs";

function payloadHasContent(payload: Record<string, string>): boolean {
  return Object.values(payload).some((v) => typeof v === "string" && v.trim().length > 0);
}

export async function POST(req: Request) {
  if (!ENABLE_PUBLIC_CONTACT) {
    return NextResponse.json({ error: "İletişim formu şu an kapalı." }, { status: 404 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz JSON." }, { status: 400 });
  }

  const parsed = contactPartialBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Doğrulama hatası.", details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const { sessionId, payload, step } = parsed.data;
  if (!payloadHasContent(payload)) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const admin = supabaseAdmin();
  const email = payload.email.trim() || null;

  const { error } = await admin.from("contact_inquiries").upsert(
    {
      session_id: sessionId,
      status: "partial",
      payload: { ...payload, _step: step ?? 0 },
      email,
      hubspot_synced: false,
    },
    { onConflict: "session_id" },
  );

  if (error) {
    console.error("[contact-partial]", error.message);
    return NextResponse.json({ error: "Kayıt başarısız." }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}
