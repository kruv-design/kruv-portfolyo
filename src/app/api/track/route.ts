import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/server";
import { extractClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const trackBodySchema = z.object({
  session_id: z.string().min(1).max(128),
  event_name: z.string().min(1).max(64),
  page: z.string().max(512).nullable().optional(),
  props: z.record(z.unknown()).nullable().optional(),
  referrer: z.string().max(2048).nullable().optional(),
});

function hashIp(ip: string): string {
  const salt = process.env.WAITLIST_IP_SALT ?? "";
  return createHash("sha256")
    .update(ip + salt)
    .digest("hex")
    .slice(0, 16);
}

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = trackBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const { session_id, event_name, page, props, referrer } = parsed.data;
  const ip_hash = hashIp(extractClientIp(req));
  const ua = req.headers.get("user-agent") ?? "";

  const { error } = await supabaseAdmin().from("site_events").insert({
    session_id,
    event_name,
    page: page ?? null,
    props: props ?? null,
    referrer: referrer ?? null,
    ua,
    ip_hash,
  });

  if (error) {
    console.error("[track]", error.message);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
