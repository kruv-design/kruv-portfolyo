import type { ContactPayloadInput } from "@/lib/validators";

/** Sunucu-tarafı içerik filtresi — honeypot + rate limit'e ek koruma. */
export type SpamCheckResult = { ok: true } | { ok: false; reason: string };

const MIN_NAME = 2;
const MAX_NAME = 120;
const MAX_MESSAGE = 5000;
const MAX_LINKS = 3;
/** Yalnızca harf sayan asgari eşik üstünde caps oranını dener. */
const CAPS_MIN_LETTERS = 20;
const CAPS_RATIO_LIMIT = 0.6;

function countLinks(s: string): number {
  const matches = s.match(/https?:\/\/[^\s]+/gi);
  return matches?.length ?? 0;
}

function capsRatio(s: string): number {
  const letters = s.replace(/[^A-Za-zÀ-ÿĞŞİÇÖÜğşıçöü]/g, "");
  if (letters.length < CAPS_MIN_LETTERS) return 0;
  const upper = letters.replace(/[^A-ZÀ-ÝĞŞİÇÖÜ]/g, "").length;
  return upper / letters.length;
}

export function checkContactSpam(payload: ContactPayloadInput): SpamCheckResult {
  const name = payload.name.trim();
  const message = payload.message.trim();

  if (name.length < MIN_NAME) {
    return { ok: false, reason: "İsim en az 2 karakter olmalı." };
  }
  if (name.length > MAX_NAME) {
    return { ok: false, reason: "İsim çok uzun." };
  }
  if (message.length > MAX_MESSAGE) {
    return { ok: false, reason: "Mesaj çok uzun." };
  }
  if (countLinks(message) > MAX_LINKS) {
    return {
      ok: false,
      reason: "Mesajda 3'ten fazla bağlantı var — lütfen sadeleştirin.",
    };
  }
  if (capsRatio(message) > CAPS_RATIO_LIMIT) {
    return {
      ok: false,
      reason: "Mesaj çoğunlukla büyük harf — lütfen normal cümleler kullanın.",
    };
  }

  return { ok: true };
}
