"use client";

import { useActionState, useState } from "react";
import { loginAction, type LoginState } from "../actions";

const initial: LoginState = {};

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initial);
  const [show, setShow] = useState(false);
  return (
    <form action={action} className="flex flex-col gap-[16px]">
      <label className="flex flex-col gap-[7px] text-[13px] tracking-[0.02em] text-ink-soft">
        Password
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            name="password"
            required
            autoFocus
            placeholder="••••••••"
            className="admin-input py-3 pl-4 pr-12 text-[16px]"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            aria-pressed={show}
            className="absolute right-[6px] top-1/2 flex h-[34px] w-[34px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-[6px] border-none bg-transparent text-muted transition-colors hover:text-ink"
          >
            {show ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <path d="M1 1l22 22M6.61 6.61A18.5 18.5 0 0 0 1 12s4 8 11 8a9.12 9.12 0 0 0 5.39-1.61" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
      </label>
      {state.error && (
        <p className="m-0 rounded-[8px] border border-[#b3261e]/30 bg-[#b3261e]/[0.06] px-[14px] py-[10px] text-[13px] text-[#8a1d17]">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="admin-btn-primary mt-1 w-full"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
