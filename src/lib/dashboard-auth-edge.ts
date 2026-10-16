/**
 * Middleware (Edge) için dashboard şifre kapısı yardımcıları.
 * node:crypto yok — Web Crypto kullanır.
 */
export const DASHBOARD_TOKEN_SALT = "kruv-dashboard-v1:";

export async function dashboardSessionTokenEdge(password: string): Promise<string> {
  const data = new TextEncoder().encode(`${DASHBOARD_TOKEN_SALT}${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
