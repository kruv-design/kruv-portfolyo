import { NextResponse } from "next/server";
import { z } from "zod";
import { contactSubmitBodySchema } from "@/lib/validators";
import { submitContactToHubSpot } from "@/lib/contact-hubspot";
import { supabaseAdmin } from "@/lib/supabase/server";
import { env } from "@/lib/env";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz JSON." }, { status: 400 });
  }

  const parsed = contactSubmitBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Doğrulama hatası.", details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  if (parsed.data.hp?.trim()) {
    return NextResponse.json({ ok: true });
  }

  const { sessionId, payload } = parsed.data;
  const nameOk = payload.name.trim().length >= 2;
  const emailOk = z.string().email().safeParse(payload.email.trim()).success;
  if (!nameOk || !emailOk) {
    return NextResponse.json(
      { error: "Ad ve geçerli e-posta zorunludur." },
      { status: 422 },
    );
  }

  const portalId = process.env.HUBSPOT_PORTAL_ID?.trim();
  const formGuid = process.env.HUBSPOT_FORM_GUID?.trim();

  let hubspotSynced = false;
  if (portalId && formGuid) {
    const hs = await submitContactToHubSpot({
      portalId,
      formGuid,
      payload,
      pageUri: `${env.SITE_URL}/contact`,
      pageName: "İletişim",
    });
    hubspotSynced = hs.ok;
    if (!hs.ok) {
      console.error("[contact] HubSpot submit failed", hs.status, hs.bodyText.slice(0, 500));
    }
  }

  const admin = supabaseAdmin();
  const email = payload.email.trim();

  const { error } = await admin.from("contact_inquiries").upsert(
    {
      session_id: sessionId,
      status: "submitted",
      payload,
      email,
      hubspot_synced: hubspotSynced,
    },
    { onConflict: "session_id" },
  );

  if (error) {
    console.error("[contact]", error.message);
    return NextResponse.json({ error: "Kayıt başarısız." }, { status: 503 });
  }

  return NextResponse.json({
    ok: true,
    hubspot: hubspotSynced,
    hubspotConfigured: Boolean(portalId && formGuid),
  });
}
