"use client";

import { useState } from "react";
import { ArrowRight, ChevronDown, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { BreedCombobox } from "@/components/breed-combobox";

const SPECIES_OPTIONS = [
  { value: "kot", label: "Kot" },
  { value: "pies", label: "Pies" },
  { value: "inny", label: "Inny pupil" },
];

const inputClass =
  "w-full rounded-field border border-border-warm bg-card-warm px-4 py-3.5 text-base text-ink placeholder:text-ink-subtle focus:outline-none focus:border-terracotta/60 focus:ring-2 focus:ring-terracotta/10 transition";

const labelClass =
  "block text-xs font-medium tracking-eyebrow uppercase text-ink-subtle mb-2";

export function RegistrationForm() {
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");

  return (
    <form className="space-y-10">

      {/* Sekcja: Twoje dane */}
      <section className="space-y-5">
        <h2 className="font-serif font-normal text-xl text-ink">Twoje dane</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className={labelClass}>Imię</label>
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              className={inputClass}
              placeholder="Anna"
            />
          </div>
          <div>
            <label htmlFor="lastName" className={labelClass}>Nazwisko</label>
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              className={inputClass}
              placeholder="Kowalska"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>Adres e-mail</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={inputClass}
            placeholder="anna@przykład.pl"
          />
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>Hasło</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className={inputClass}
            placeholder="••••••••"
          />
          <p className="mt-1.5 text-xs text-ink-subtle">Minimum 8 znaków</p>
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
            <label htmlFor="petName" className={labelClass}>Imię pupila</label>
            <input
              id="petName"
              type="text"
              className={inputClass}
              placeholder="Zuzia"
            />
          </div>
          <div>
            <label htmlFor="species" className={labelClass}>Gatunek</label>
            <div className="relative">
              <select
                id="species"
                value={species}
                onChange={(e) => { setSpecies(e.target.value); setBreed(""); }}
                className={`${inputClass} appearance-none pr-10 cursor-pointer`}
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
          <p className="mt-1.5 text-xs text-ink-subtle">
            Rasa pozwala nam dopasować alerty do predyspozycji zdrowotnych gatunku.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="birthDate" className={labelClass}>Data urodzenia</label>
            <input
              id="birthDate"
              type="date"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="weight" className={labelClass}>Waga (kg)</label>
            <input
              id="weight"
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
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-0.5 shrink-0 accent-terracotta w-4 h-4 rounded"
          />
          <span className="text-sm leading-body text-ink-muted">
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
            </a>
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
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
        className="w-full inline-flex items-center justify-center gap-2 rounded-button bg-terracotta px-8 py-4 text-base font-medium text-card-warm hover:bg-terracotta-hover transition-colors cursor-pointer"
      >
        Utwórz konto i profil pupila
        <ArrowRight size={16} />
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
