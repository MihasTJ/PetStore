import { ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Zaloguj się — Nobile",
  description: "Zaloguj się i wróć do profilu swojego pupila.",
};

export default function LogowaniePage() {
  return (
    <main className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-[480px] px-6 pt-28 pb-24 md:pt-36">

        <p className="mb-4 text-xs font-medium tracking-eyebrow uppercase text-ink-subtle">
          Konto
        </p>
        <h1 className="font-serif font-normal text-4xl md:text-[2.75rem] text-ink leading-editorial mb-3">
          Zaloguj się.
        </h1>
        <p className="text-base leading-body text-ink-muted mb-10">
          Wróć do profilu swojego pupila i historii zdrowotnej.
        </p>

        {/* Docelowo: Supabase Auth signInWithPassword */}
        <form className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium tracking-eyebrow uppercase text-ink-subtle mb-2"
            >
              Adres e-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="w-full rounded-field border border-border-warm bg-card-warm px-4 py-3.5 text-base text-ink placeholder:text-ink-subtle focus:outline-none focus:border-terracotta/60 focus:ring-2 focus:ring-terracotta/10 transition"
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
              type="password"
              autoComplete="current-password"
              className="w-full rounded-field border border-border-warm bg-card-warm px-4 py-3.5 text-base text-ink placeholder:text-ink-subtle focus:outline-none focus:border-terracotta/60 focus:ring-2 focus:ring-terracotta/10 transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-button bg-terracotta px-8 py-4 text-base font-medium text-card-warm hover:bg-terracotta-hover transition-colors cursor-pointer"
          >
            Zaloguj się
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-border-warm">
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

        <div className="mt-8 flex items-start gap-2.5">
          <ShieldCheck size={14} strokeWidth={1.5} className="text-moss shrink-0 mt-0.5" />
          <p className="text-xs leading-body text-ink-subtle">
            Twoje dane są szyfrowane i nie są udostępniane podmiotom trzecim.
          </p>
        </div>

      </div>
    </main>
  );
}
