import type { Project, ProjectInput } from "@/types";

/** İstemci her zaman tam origin ile çağırır (proxy / alt path sapmalarını azaltır). */
function resolveApiUrl(path: string): string {
  if (typeof window === "undefined") return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${window.location.origin}${p}`;
}

async function request<T>(
  input: string,
  init: RequestInit = {},
): Promise<T> {
  const url = resolveApiUrl(input);
  const res = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
  const text = await res.text();
  let json: Record<string, unknown> = {};
  try {
    if (text) json = JSON.parse(text) as Record<string, unknown>;
  } catch {
    /* HTML 500 veya düz metin */
  }
  if (!res.ok) {
    const fromJson =
      typeof json.error === "string" && json.error.length > 0
        ? json.error
        : null;
    const details = json.details as Record<string, string[]> | undefined;
    if (details && typeof details === "object") {
      const parts = Object.entries(details)
        .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(", ")}`)
        .filter(Boolean);
      if (parts.length) {
        throw new Error(
          `${fromJson ?? `İstek başarısız (${res.status})`} (${parts.join(" • ")})`,
        );
      }
    }
    const looksHtml = text.trimStart().toLowerCase().startsWith("<!doctype") ||
      text.trimStart().toLowerCase().startsWith("<html");
    const snippet =
      !fromJson && text && !looksHtml && text.length < 500
        ? text.trim().slice(0, 400)
        : null;
    throw new Error(
      fromJson ??
        snippet ??
        (looksHtml
          ? `Sunucu hatası (${res.status}). Ortam değişkenleri (ör. SUPABASE_SERVICE_ROLE_KEY) veya deploy loglarını kontrol edin.`
          : `İstek başarısız (${res.status})`),
    );
  }
  if (!("data" in json) || json.data === undefined) {
    throw new Error(
      "Sunucu yanıtı beklenmedik biçimde (data alanı yok). Ağ sekmesinde yanıt gövdesine bakın.",
    );
  }
  return json.data as T;
}

export const api = {
  listProjects: () => request<Project[]>("/api/projects"),
  createProject: (input: ProjectInput) =>
    request<Project>("/api/projects", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  updateProject: (id: string, input: ProjectInput) =>
    request<Project>(`/api/projects/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  deleteProject: (id: string) =>
    request<{ ok: true }>(`/api/projects/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
  reorder: (order: string[]) =>
    request<{ ok: true }>("/api/projects/reorder", {
      method: "POST",
      body: JSON.stringify({ order }),
    }),
  signUpload: () =>
    request<{
      cloudName: string;
      apiKey: string;
      timestamp: number;
      signature: string;
      folder: string;
      uploadPreset: string;
    }>("/api/upload/sign", { method: "POST" }),
};
