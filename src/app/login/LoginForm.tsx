"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = { status: "idle" };

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form
      action={formAction}
      className="adm-card w-full max-w-[360px] p-10 text-center"
    >
      <div className="h2" style={{ color: "var(--ink)" }}>
        kruv
        <strong style={{ color: "var(--accent)", fontWeight: 600 }}>.</strong>
      </div>
      <div className="b3 mb-8 mt-1 lowercase" style={{ color: "var(--ink-faint)" }}>
        Admin Paneli
      </div>

      <input type="hidden" name="next" value={next} />

      <input
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="E-posta"
        className="form-input mb-3"
      />
      <input
        name="password"
        type="password"
        required
        autoComplete="current-password"
        placeholder="Şifre"
        className="form-input mb-3"
      />

      <button
        type="submit"
        disabled={pending}
        className="btn btn-primary w-full justify-center py-3 disabled:opacity-60"
      >
        {pending ? "Giriş yapılıyor…" : "Giriş Yap"}
      </button>

      <div
        className="b2 mt-3 min-h-[18px]"
        style={{ color: "var(--accent)" }}
        aria-live="polite"
      >
        {state.status === "error" ? state.message : ""}
      </div>
    </form>
  );
}
