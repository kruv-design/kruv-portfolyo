"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ProtelBrandLogo } from "@/components/protel/ProtelBrandLogo";

export function ProtelUnlockForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const router = useRouter();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    start(async () => {
      const res = await fetch("/api/protel/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof json.error === "string" ? json.error : "Giriş başarısız.");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="protel-pitch protel-pitch--gate">
      <ProtelBrandLogo />
      <form className="protel-unlock" onSubmit={onSubmit}>
        <p className="b1 protel-unlock__lead">Bu sayfa şifre korumalıdır.</p>
        <input
          type="password"
          className="protel-unlock__input"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        {error ? (
          <p className="b2 protel-unlock__error" role="alert">
            {error}
          </p>
        ) : null}
        <button type="submit" className="protel-unlock__btn" disabled={pending}>
          {pending ? "Kontrol ediliyor…" : "Giriş"}
        </button>
      </form>
    </div>
  );
}
