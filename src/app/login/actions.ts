"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  DASHBOARD_AUTH_COOKIE,
  clearDashboardAuthCookieOptions,
} from "@/lib/dashboard-auth";

/** Admin çıkış — dashboard şifre çerezini siler. */
export async function logoutAction() {
  const jar = await cookies();
  jar.set(DASHBOARD_AUTH_COOKIE, "", clearDashboardAuthCookieOptions());
  revalidatePath("/", "layout");
  redirect("/login");
}
