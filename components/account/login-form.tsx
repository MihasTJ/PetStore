"use client";

import { useActionState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { signIn, type AuthState } from "@/lib/actions/auth";

const inputClass =
  "w-full rounded-field border border-border-warm bg-card-warm px-4 py-3.5 text-base text-ink placeholder:text-ink-subtle focus:outline-none focus:border-terracotta/60 focus:ring-2 focus:ring-terracotta/10 transition";

const initial: AuthState = { error: null };

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, initial);

  return (
    <form action={action} className="space-y-5">
      {state.error && (
        <p
          role="alert"
          className="rounded-field border border-error-warm/30 bg-error-warm/5 px-4 py-3 text-sm text-error-warm"
        >
          {state.error}
        </p>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-xs font-medium tracking-eyebrow uppercase text-ink-subtle mb-2"
        >
          Adres e-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={inputClass}
          placeholder="anna@przykład.pl"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="password"
            className="text-xs font-medium tracking-eyebrow uppercase text-ink-subtle"
          >
            Hasło
          </label>
          <a
            href="#"
            className="text-xs text-ink-muted hover:text-ink transition-colors"
          >
            Nie pamiętam hasła
          </a>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full inline-flex items-center justify-center gap-2 rounded-button bg-terracotta px-8 py-4 text-base font-medium text-card-warm hover:bg-terracotta-hover transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? "Logowanie…" : "Zaloguj się"}
        {!pending && <ArrowRight size={16} />}
      </button>

      <div className="pt-8 border-t border-border-warm">
        <p className="text-sm text-ink-muted text-center">
          Nie masz jeszcze konta?{" "}
          <Link
            href="/konto/rejestracja"
            className="text-ink underline underline-offset-2 hover:text-terracotta transition-colors"
          >
            Utwórz profil pupila
          </Link>
        </p>
      </div>
    </form>
  );
}
