"use client";

import { useState, useActionState } from "react";
import { ArrowRight, ChevronDown, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { BreedCombobox } from "@/components/breed-combobox";
import { DatePicker } from "@/components/ui/date-picker";
import { signUp, type AuthState } from "@/lib/actions/auth";

const SPECIES_OPTIONS = [
  { value: "kot", label: "Kot" },
  { value: "pies", label: "Pies" },
  { value: "inny", label: "Inny pupil" },
];

const inputBase =
  "w-full rounded-field border bg-card-warm px-4 py-3.5 text-base text-ink placeholder:text-ink-subtle focus:outline-none transition";

const inputClass =
  `${inputBase} border-border-warm focus:border-terracotta/60 focus:ring-2 focus:ring-terracotta/10`;

const inputValidClass =
  `${inputBase} border-moss/60 ring-2 ring-moss/20`;

const inputErrorClass =
  `${inputBase} border-error-warm/60 ring-2 ring-error-warm/10`;

const labelClass =
  "block text-xs font-medium tracking-eyebrow uppercase text-ink-subtle mb-2";

const fieldErrorClass = "mt-1.5 text-xs text-error-warm";

const TODAY = new Date().toISOString().split("T")[0];
const MIN_PET_DATE = (() => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 50);
  return d.toISOString().split("T")[0];
})();

const initial: AuthState = { error: null };

export function RegistrationForm() {
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [state, action, pending] = useActionState(signUp, initial);

  const passwordValid = password.length >= 8;
  const fe = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-10">
      {state.error && (
        <p
          role="alert"
          className="rounded-field border border-error-warm/30 bg-error-warm/5 px-4 py-3 text-sm text-error-warm"
        >
          {state.error}
        </p>
      )}

      {/* Sekcja: Twoje dane */}
      <section className="space-y-5">
        <h2 className="font-serif font-normal text-xl text-ink">Twoje dane</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className={labelClass}>
              Imię <span className="text-error-warm">*</span>
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              className={fe.firstName ? inputErrorClass : inputClass}
              placeholder="Anna"
            />
            {fe.firstName && <p className={fieldErrorClass}>{fe.firstName}</p>}
          </div>
          <div>
            <label htmlFor="lastName" className={labelClass}>
              Nazwisko <span className="text-error-warm">*</span>
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              className={fe.lastName ? inputErrorClass : inputClass}
              placeholder="Kowalska"
            />
            {fe.lastName && <p className={fieldErrorClass}>{fe.lastName}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Adres e-mail <span className="text-error-warm">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className={fe.email ? inputErrorClass : inputClass}
            placeholder="anna@przykład.pl"
          />
          {fe.email && <p className={fieldErrorClass}>{fe.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>
            Hasło <span className="text-error-warm">*</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={
              passwordValid
                ? inputValidClass
                : fe.password
                  ? inputErrorClass
                  : inputClass
            }
            placeholder="••••••••"
          />
          {fe.password && !passwordValid ? (
            <p className={fieldErrorClass}>{fe.password}</p>
          ) : (
            <p className={`mt-1.5 text-xs ${passwordValid ? "text-moss" : "text-ink-subtle"}`}>
              Minimum 8 znaków
            </p>
          )}
        </div>
      </section>

      <div className="border-t border-border-warm" />

      {/* Sekcja: Profil pupila */}
      <section className="space-y-5">
        <div>
          <h2 className="font-serif font-normal text-xl text-ink mb-1.5">
            Profil pupila
          </h2>
          <p className="text-sm leading-body text-ink-muted">
            Te dane pozwolą nam dopasować rekomendacje zdrowotne i wysyłać alerty
            prewencyjne — zanim pojawi się problem.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="petName" className={labelClass}>
              Imię pupila <span className="text-error-warm">*</span>
            </label>
            <input
              id="petName"
              name="petName"
              type="text"
              className={fe.petName ? inputErrorClass : inputClass}
              placeholder="Zuzia"
            />
            {fe.petName && <p className={fieldErrorClass}>{fe.petName}</p>}
          </div>
          <div>
            <label htmlFor="species" className={labelClass}>
              Gatunek <span className="text-error-warm">*</span>
            </label>
            <div className="relative">
              <select
                id="species"
                name="species"
                value={species}
                onChange={(e) => { setSpecies(e.target.value); setBreed(""); }}
                className={`${fe.species ? inputErrorClass : inputClass} appearance-none pr-10 cursor-pointer`}
              >
                <option value="" disabled>Wybierz...</option>
                {SPECIES_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown
                size={15}
                strokeWidth={1.5}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-subtle"
              />
            </div>
            {fe.species && <p className={fieldErrorClass}>{fe.species}</p>}
          </div>
        </div>

        <div>
          <label className={labelClass}>Rasa</label>
          <BreedCombobox
            value={breed}
            onChange={setBreed}
            species={species || null}
            inputClassName={inputClass}
          />
          <input type="hidden" name="breed" value={breed} />
          <p className="mt-1.5 text-xs text-ink-subtle">
            Rasa pozwala nam dopasować alerty do predyspozycji zdrowotnych gatunku.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Data urodzenia <span className="text-error-warm">*</span>
            </label>
            <DatePicker
              name="birthDate"
              value={birthDate}
              onChange={setBirthDate}
              min={MIN_PET_DATE}
              max={TODAY}
              placeholder="Wybierz datę urodzenia"
            />
            {fe.birthDate && <p className={fieldErrorClass}>{fe.birthDate}</p>}
          </div>
          <div>
            <label htmlFor="weight" className={labelClass}>Waga (kg)</label>
            <input
              id="weight"
              name="weight"
              type="number"
              min="0.1"
              max="100"
              step="0.1"
              className={`${inputClass} font-tnum`}
              placeholder="4.2"
            />
          </div>
        </div>
      </section>

      <div className="border-t border-border-warm" />

      {/* Zgody RODO */}
      <section className="space-y-4">
        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="terms"
              className="mt-0.5 shrink-0 accent-terracotta w-4 h-4 rounded"
            />
            <span className={`text-sm leading-body ${fe.terms ? "text-error-warm" : "text-ink-muted"}`}>
              Akceptuję{" "}
              <a
                href="/regulamin"
                className="underline underline-offset-2 hover:text-ink transition-colors"
              >
                Regulamin
              </a>{" "}
              i{" "}
              <a
                href="/polityka-prywatnosci"
                className="underline underline-offset-2 hover:text-ink transition-colors"
              >
                Politykę prywatności
              </a>{" "}
              <span className="text-error-warm">*</span>
            </span>
          </label>
          {fe.terms && (
            <p className={`${fieldErrorClass} ml-7`}>{fe.terms}</p>
          )}
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="healthConsent"
            className="mt-0.5 shrink-0 accent-terracotta w-4 h-4 rounded"
          />
          <span className="text-sm leading-body text-ink-muted">
            Wyrażam zgodę na przetwarzanie danych zdrowotnych pupila w celu
            generowania spersonalizowanych raportów i alertów prewencyjnych.
            Zgodę możesz wycofać w dowolnym momencie w ustawieniach konta.
          </span>
        </label>
      </section>

      <button
        type="submit"
        disabled={pending}
        className="w-full inline-flex items-center justify-center gap-2 rounded-button bg-terracotta px-8 py-4 text-base font-medium text-card-warm hover:bg-terracotta-hover transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? "Tworzenie konta…" : "Utwórz konto i profil pupila"}
        {!pending && <ArrowRight size={16} />}
      </button>

      <div className="mt-8 pt-8 border-t border-border-warm">
        <p className="text-sm text-ink-muted text-center">
          Masz już konto?{" "}
          <Link
            href="/konto/logowanie"
            className="text-ink underline underline-offset-2 hover:text-terracotta transition-colors"
          >
            Zaloguj się
          </Link>
        </p>
      </div>

      <div className="flex items-start gap-2.5">
        <ShieldCheck size={14} strokeWidth={1.5} className="text-moss shrink-0 mt-0.5" />
        <p className="text-xs leading-body text-ink-subtle">
          Twoje dane i profil zdrowotny pupila są szyfrowane. Nie sprzedajemy ich
          firmom ubezpieczeniowym ani podmiotom zewnętrznym.
        </p>
      </div>
    </form>
  );
}
