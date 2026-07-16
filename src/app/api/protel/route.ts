import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";
import { requireUser, isAuthFailureResponse } from "@/lib/auth-guard";
import { protelPitchSaveSchema } from "@/lib/validators";
import {
  brandInputToDbRow,
  mapProtelBrandRow,
  mapProtelSettingsRow,
  settingsInputToDbRow,
} from "@/lib/map-protel-row";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request) {
  try {
    await requireUser();
  } catch (e) {
    if (isAuthFailureResponse(e)) return e;
    throw e;
  }

  try {
    const body = await req.json().catch(() => ({}));
    const parsed = protelPitchSaveSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Geçersiz veri.",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { settings, brands, pagePassword } = parsed.data;
    const sb = supabaseAdmin();

    if (pagePassword) {
      const secretRes = await sb
        .from("protel_page_secrets")
        .upsert({ id: 1, page_password: pagePassword })
        .select("id")
        .single();

      if (secretRes.error) {
        return NextResponse.json(
          { error: `Şifre kaydedilemedi: ${secretRes.error.message}` },
          { status: 400 },
        );
      }
    }

    const settingsRes = await sb
      .from("protel_pitch_settings")
      .update(settingsInputToDbRow(settings))
      .eq("id", 1)
      .select("*")
      .single();

    if (settingsRes.error) {
      return NextResponse.json(
        { error: settingsRes.error.message },
        { status: 400 },
      );
    }

    const updatedBrands = [];
    for (const brand of brands) {
      const brandRes = await sb
        .from("protel_brands")
        .update(brandInputToDbRow(brand))
        .eq("id", brand.id)
        .select("*")
        .single();

      if (brandRes.error) {
        return NextResponse.json(
          { error: `${brand.name}: ${brandRes.error.message}` },
          { status: 400 },
        );
      }
      updatedBrands.push(
        mapProtelBrandRow(brandRes.data as Record<string, unknown>),
      );
    }

    revalidatePath("/protel");

    return NextResponse.json({
      data: {
        settings: mapProtelSettingsRow(
          settingsRes.data as Record<string, unknown>,
        ),
        brands: updatedBrands,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[PATCH /api/protel]", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
