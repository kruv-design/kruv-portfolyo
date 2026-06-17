import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

const presenceBodySchema = z.object({
  session_id: z.string().min(1).max(128),
  page: z.string().min(1).max(512),
});

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = presenceBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const { session_id, page } = parsed.data;
  const now = new Date().toISOString();

  const { error } = await supabaseAdmin().from("site_presence").upsert(
    {
      session_id,
      page,
      last_seen_at: now,
    },
    { onConflict: "session_id" },
  );

  if (error) {
    console.error("[presence]", error.message);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
