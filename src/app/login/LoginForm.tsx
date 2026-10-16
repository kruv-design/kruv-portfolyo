"use client";

import { useState, type FormEvent } from "react";

/** kruvtest ile aynı şifre paneli — DASHBOARD_PASSWORD (/api/unlock). */
export function LoginForm({ next }: { next: string }) {
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(res.status === 401 ? "Şifre hatalı." : data.error ?? "Giriş yapılamadı.");
        setPending(false);
        return;
      }
      const target = next.startsWith("/") && !next.startsWith("//") ? next : "/admin";
      window.location.assign(target);
    } catch {
      setError("Bağlantı hatası.");
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="adm-card w-full max-w-[360px] p-10 text-center"
    >
      <div className="h2" style={{ color: "var(--ink)" }}>
        kruv
        <strong style={{ color: "var(--accent)", fontWeight: 600 }}>.</strong>
      </div>
      <div className="b3 mb-8 mt-1" style={{ color: "var(--ink-faint)" }}>
        Bu sayfa şifre korumalıdır.
      </div>

      <input
        name="password"
        type="password"
        required
        autoFocus
        autoComplete="current-password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="form-input mb-3"
      />

      <button
        type="submit"
        disabled={pending}
        className="btn btn-primary w-full justify-center py-3 disabled:opacity-60"
      >
        {pending ? "Giriş yapılıyor…" : "Giriş"}
      </button>

      <div
        className="b2 mt-3 min-h-[18px]"
        style={{ color: "var(--accent)" }}
        aria-live="polite"
      >
        {error}
      </div>
    </form>
  );
}
