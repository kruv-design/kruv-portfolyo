import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getResendClient } from "@/lib/olly/resend";
import { createOllySupabaseAdmin } from "@/lib/olly/supabase-admin";

const bodySchema = z.object({
  email: z.string().min(1).email(),
});

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }

  const email = parsed.data.email.trim().toLowerCase();

  const h = await headers();
  const fwd = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "0.0.0.0";
  const salt = process.env.WAITLIST_IP_SALT ?? "dev";
  const ip_hash = createHash("sha256").update(`${fwd}:${salt}`).digest("hex");

  try {
    const supabase = createOllySupabaseAdmin();
    const { error } = await supabase.from("waitlist").insert({
      email,
      ip_hash,
    });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ ok: false, error: "duplicate" }, { status: 409 });
      }
      console.error("[waitlist]", error);
      return NextResponse.json({ ok: false, error: "db" }, { status: 500 });
    }
  } catch (e) {
    console.error("[waitlist]", e);
    return NextResponse.json({ ok: false, error: "config" }, { status: 500 });
  }

  const resend = getResendClient();
  if (resend) {
    const from = process.env.RESEND_FROM ?? "Olly <onboarding@resend.dev>";
    try {
      await resend.emails.send({
        from,
        to: email,
        subject: "Olly bekleme listesi onayı",
        html: `<p>Merhaba,</p><p>Olly bekleme listesine kaydın alındı. Yakında sana haber vereceğiz.</p><p>Sevgiler,<br/>Olly ekibi</p>`,
      });
    } catch (e) {
      console.error("[waitlist] resend", e);
    }
  }

  return NextResponse.json({ ok: true });
}
