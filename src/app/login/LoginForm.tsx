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
      <div
        className="serif text-[2.2rem] leading-none tracking-tight"
        style={{ color: "var(--ink)" }}
      >
        kruv
        <em style={{ color: "var(--accent)", fontStyle: "italic" }}>.</em>
      </div>
      <div
        className="mb-8 mt-1 text-[12px] uppercase tracking-[0.06em]"
        style={{ color: "var(--ink-faint)" }}
      >
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
        className="mt-3 min-h-[18px] text-[12px]"
        style={{ color: "var(--accent)" }}
        aria-live="polite"
      >
        {state.status === "error" ? state.message : ""}
      </div>
    </form>
  );
}
