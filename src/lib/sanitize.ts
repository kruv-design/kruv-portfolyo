/**
 * Tiny text sanitizer. All project content is rendered as plain text in JSX,
 * so React already escapes it — but we still strip control chars & trim
 * before persistence to keep the DB tidy.
 */
export function cleanText(input: unknown, maxLen = 5000): string {
  if (typeof input !== "string") return "";
  const stripped = input
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
  return stripped.length > maxLen ? stripped.slice(0, maxLen) : stripped;
}

export function cleanUrl(input: unknown): string {
  const s = cleanText(input, 500);
  if (!s) return "";
  try {
    const u = new URL(s);
    if (u.protocol !== "http:" && u.protocol !== "https:") return "";
    return u.toString();
  } catch {
    return "";
  }
}
