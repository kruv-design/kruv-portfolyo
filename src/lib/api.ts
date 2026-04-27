import type { Project, ProjectInput } from "@/types";

async function request<T>(
  input: string,
  init: RequestInit = {},
): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const base = json?.error ?? `Request failed (${res.status})`;
    const details = json?.details as Record<string, string[]> | undefined;
    if (details && typeof details === "object") {
      const parts = Object.entries(details)
        .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(", ")}`)
        .filter(Boolean);
      if (parts.length) throw new Error(`${base} (${parts.join(" • ")})`);
    }
    throw new Error(base);
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
    request<Project>(`/api/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  deleteProject: (id: string) =>
    request<{ ok: true }>(`/api/projects/${id}`, { method: "DELETE" }),
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
