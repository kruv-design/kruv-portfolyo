import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";
import { reorderSchema } from "@/lib/validators";
import { requireUser } from "@/lib/auth-guard";

export async function POST(req: Request) {
  try {
    await requireUser();
  } catch (res) {
    return res as Response;
  }

  const body = await req.json().catch(() => ({}));
  const parsed = reorderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Geçersiz veri.", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const sb = await supabaseServer();
  // Apply new sira = index * 10 (leaves room for manual tweaks later)
  const updates = parsed.data.order.map((id, idx) =>
    sb.from("projects").update({ sira: (idx + 1) * 10 }).eq("id", id),
  );
  const results = await Promise.all(updates);
  const firstErr = results.find((r) => r.error);
  if (firstErr?.error) {
    return NextResponse.json({ error: firstErr.error.message }, { status: 500 });
  }

  revalidatePath("/");
  return NextResponse.json({ data: { ok: true } });
}
