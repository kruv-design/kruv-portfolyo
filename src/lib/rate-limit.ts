import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * IP başına iletişim formu rate limit'i — Upstash Redis ile.
 * Env eksikse `null` döner; çağıran taraf "yapılandırılmamış" diye atlar (DX bozulmaz).
 *
 * Ayar: 5 başarılı gönderim/saat + 20/gün IP başına.
 *  - `kruv-contact-h`: 5 / 1h sliding window
 *  - `kruv-contact-d`: 20 / 24h sliding window
 */
export type ContactRateLimiters = {
  hourly: Ratelimit;
  daily: Ratelimit;
} | null;

let cached: ContactRateLimiters | undefined;

export function getContactRateLimiters(): ContactRateLimiters {
  if (cached !== undefined) return cached;

  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (!url || !token) {
    cached = null;
    return null;
  }

  const redis = new Redis({ url, token });

  cached = {
    hourly: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      analytics: true,
      prefix: "kruv-contact-h",
    }),
    daily: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, "1 d"),
      analytics: true,
      prefix: "kruv-contact-d",
    }),
  };
  return cached;
}

export type ContactRateCheckResult =
  | { ok: true; configured: boolean }
  | { ok: false; reason: string; retryAfter: number };

/**
 * IP başına saatlik + günlük limit kontrolü.
 * `configured: false` → Upstash yok, atlanır (geliştirme/erken aşama).
 */
export async function checkContactRateLimit(
  ip: string,
): Promise<ContactRateCheckResult> {
  const limiters = getContactRateLimiters();
  if (!limiters) {
    return { ok: true, configured: false };
  }

  const safeIp = ip || "unknown";

  const [h, d] = await Promise.all([
    limiters.hourly.limit(safeIp),
    limiters.daily.limit(safeIp),
  ]);

  if (!h.success) {
    return {
      ok: false,
      reason: "Çok hızlı gönderiyorsunuz — bir süre sonra tekrar deneyin.",
      retryAfter: Math.max(0, Math.ceil((h.reset - Date.now()) / 1000)),
    };
  }
  if (!d.success) {
    return {
      ok: false,
      reason: "Günlük gönderim sınırına ulaştınız — yarın tekrar deneyin.",
      retryAfter: Math.max(0, Math.ceil((d.reset - Date.now()) / 1000)),
    };
  }

  return { ok: true, configured: true };
}

/** Vercel arkasındaki proxy header'larından gerçek IP'yi çıkarır. */
export function extractClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}
