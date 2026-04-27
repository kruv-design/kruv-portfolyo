"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validators";

export type LoginState =
  | { status: "idle" }
  | { status: "error"; message: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return {
      status: "error",
      message:
        parsed.error.issues[0]?.message ?? "E-posta veya şifre hatalı.",
    };
  }

  const sb = await supabaseServer();
  const { error } = await sb.auth.signInWithPassword(parsed.data);
  if (error) {
    return { status: "error", message: "E-posta veya şifre hatalı." };
  }

  const next =
    typeof formData.get("next") === "string"
      ? (formData.get("next") as string)
      : "/admin";
  revalidatePath("/", "layout");
  redirect(next.startsWith("/") ? next : "/admin");
}

export async function logoutAction() {
  const sb = await supabaseServer();
  await sb.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
