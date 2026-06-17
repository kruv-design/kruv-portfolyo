/** Canonical marka adı — kullanıcıya görünen metinlerde yalnızca `kruv` (nokta yok). */
export const BRAND_NAME = "kruv";

/** DB / eski içerik: sondaki noktayı ve fazla boşluğu temizler. */
export function normalizeBrandName(value: string | null | undefined): string {
  const trimmed = (value ?? BRAND_NAME).trim().replace(/\.+$/u, "");
  return trimmed || BRAND_NAME;
}
