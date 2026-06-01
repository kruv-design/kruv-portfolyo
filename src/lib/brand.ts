/** Marka adı — sonda nokta gösterilmez (ör. `kruv.` → `kruv`). */
export function normalizeBrandName(value: string | null | undefined): string {
  const trimmed = (value ?? "kruv").trim().replace(/\.+$/u, "");
  return trimmed || "kruv";
}
