import type { Messages } from "@/lib/i18n/get-messages";

export type MessageKey = string;

export function t(messages: Messages, key: MessageKey, fallback = ""): string {
  const parts = key.split(".");
  let node: unknown = messages;
  for (const part of parts) {
    if (!node || typeof node !== "object" || !(part in node)) {
      return fallback || key;
    }
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === "string" ? node : fallback || key;
}
