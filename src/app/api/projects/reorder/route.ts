import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";
import { reorderSchema } from "@/lib/validators";
import { requireUser, isAuthFailureResponse } from "@/lib/auth-guard";

export async function POST(req: Request) {
  try {
    await requireUser();
  } catch (e) {
    if (isAuthFailureResponse(e)) return e;
    throw e;
  }

  const body = await req.json().catch(() => ({}));
  const parsed = reorderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Geçersiz veri.", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const sb = supabaseAdmin();
  // Apply new sira = index * 10 (leaves room for manual tweaks later)
  const updates = parsed.data.order.map((id, idx) =>
    sb.from("projects").update({ sira: (idx + 1) * 10 }).eq("id", id),
  );
  const results = await Promise.all(updates);
  const firstErr = results.find((r) => r.error);
  if (firstErr?.error) {
    return NextResponse.json({ error: firstErr.error.message }, { status: 500 });
  }

  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/works");
  revalidatePath("/admin");
  return NextResponse.json({ data: { ok: true } });
}
