import type { Locale } from "@/lib/i18n/config";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import tr from "@/messages/tr.json";
import en from "@/messages/en.json";

export type Messages = typeof tr;

const ALL_MESSAGES: Record<Locale, Messages> = {
  tr,
  en,
};

export function getMessages(locale: Locale): Messages {
  return ALL_MESSAGES[locale] ?? ALL_MESSAGES[DEFAULT_LOCALE];
}
