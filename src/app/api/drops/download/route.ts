import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { dropDownloadBodySchema } from "@/lib/validators";
import { extractClientIp, checkContactRateLimit } from "@/lib/rate-limit";
import { resolveDownloadTarget } from "@/lib/drops-queries";
import { cldRawUrl } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = dropDownloadBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { name, email, packSlug, fontSlug, type, locale, hp } = parsed.data;
  if (hp.trim()) {
    return NextResponse.json({ ok: true, url: "" });
  }

  const ip = extractClientIp(req);
  const rate = await checkContactRateLimit(ip);
  if (!rate.ok) {
    return NextResponse.json(
      { ok: false, error: rate.reason },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } },
    );
  }

  const target = await resolveDownloadTarget(packSlug, fontSlug, type);
  if (!target?.downloadUrl) {
    return NextResponse.json(
      {
        ok: false,
        error:
          type === "pack"
            ? "Paket indirme dosyası henüz yüklenmemiş."
            : "Font indirme dosyası henüz yüklenmemiş.",
      },
      { status: 404 },
    );
  }

  const salt = process.env.WAITLIST_IP_SALT ?? "dev";
  const ip_hash = createHash("sha256").update(`${ip}:${salt}`).digest("hex");
  const user_agent = req.headers.get("user-agent") ?? "";

  let downloadUrl = target.downloadUrl;
  if (!/^https?:\/\//i.test(downloadUrl)) {
    downloadUrl = cldRawUrl(downloadUrl);
  }

  try {
    const sb = supabaseAdmin();
    const { error } = await sb.from("drop_downloads").insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      pack_id: target.pack.id.startsWith("demo-") ? null : target.pack.id,
      font_id:
        target.font && !target.font.id.startsWith("demo-")
          ? target.font.id
          : null,
      download_type: type,
      ip_hash,
      user_agent: user_agent.slice(0, 500),
      locale,
    });
    if (error) {
      console.error("[drops/download] db", error);
    }
  } catch (e) {
    console.error("[drops/download] db", e);
  }

  return NextResponse.json({
    ok: true,
    url: downloadUrl,
    filename: target.filename,
  });
}
