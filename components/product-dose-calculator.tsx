"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

type AgeGroup = "puppy" | "adult" | "senior";

const ageGroups: { value: AgeGroup; label: string; hint: string }[] = [
  { value: "puppy", label: "Szczenię / kocię", hint: "do 1. roku życia" },
  { value: "adult", label: "Dorosły", hint: "1–7 lat" },
  { value: "senior", label: "Senior", hint: "powyżej 7 lat" },
];

function calcDose(weightKg: number, ageGroup: AgeGroup): { dose: string; timing: string } | null {
  if (weightKg <= 0 || weightKg > 120) return null;

  let capsules: number;
  if (weightKg <= 10) capsules = 1;
  else if (weightKg <= 25) capsules = 2;
  else capsules = 3;

  if (ageGroup === "puppy") capsules = Math.max(1, capsules - 1);
  if (ageGroup === "senior") capsules = capsules + 1;

  const plural =
    capsules === 1 ? "kapsułkę" : capsules < 5 ? "kapsułki" : "kapsułek";
  return {
    dose: `${capsules} ${plural} dziennie`,
    timing: "Podaj z posiłkiem, o stałej porze dnia",
  };
}

export function ProductDoseCalculator() {
  const [weight, setWeight] = useState<string>("");
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("adult");

  const weightNum = parseFloat(weight.replace(",", "."));
  const result = !isNaN(weightNum) && weightNum > 0 ? calcDose(weightNum, ageGroup) : null;

  return (
    <section className="bg-tech-island">
      <div className="mx-auto max-w-editorial px-6 py-16 md:px-12 md:py-20">

        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">

          <div className="md:col-span-5">
            <p className="mb-5 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
              Kalkulator dawki
            </p>
            <h2 className="font-serif font-normal leading-editorial text-ink text-3xl md:text-4xl">
              Ile dokładnie<br />
              potrzebuje Twój pupil?
            </h2>
            <p className="mt-5 text-base leading-body text-ink-muted">
              Wpisz wagę i wiek zwierzęcia — kalkulator wyliczy zalecaną dzienną porcję.
            </p>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <div className="bg-card-warm rounded-card p-8 shadow-warm">

              {/* Weight input */}
              <div className="mb-6">
                <label
                  htmlFor="pet-weight"
                  className="mb-2 block text-xs font-medium tracking-eyebrow text-ink-muted uppercase"
                >
                  Waga pupila (kg)
                </label>
                <input
                  id="pet-weight"
                  type="number"
                  inputMode="decimal"
                  min={0.5}
                  max={120}
                  step={0.5}
                  placeholder="np. 4,5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className={cn(
                    "w-full rounded-field border border-border-warm bg-canvas px-4 py-3",
                    "text-sm text-ink placeholder:text-ink-subtle",
                    "outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta",
                    "transition-colors"
                  )}
                />
              </div>

              {/* Age group */}
              <div className="mb-8">
                <p className="mb-3 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
                  Etap życia
                </p>
                <div className="flex gap-2 flex-wrap">
                  {ageGroups.map(({ value, label, hint }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setAgeGroup(value)}
                      className={cn(
                        "flex flex-col items-start rounded-field border px-4 py-3 text-left transition-colors",
                        ageGroup === value
                          ? "border-terracotta bg-terracotta/5 text-ink"
                          : "border-border-warm bg-canvas text-ink-muted hover:border-terracotta/40"
                      )}
                    >
                      <span className="text-sm font-medium">{label}</span>
                      <span className="text-[11px] text-ink-subtle">{hint}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Result */}
              {result ? (
                <div className="rounded-field border border-moss/20 bg-moss/5 px-5 py-4">
                  <p className="text-xs font-medium tracking-eyebrow text-moss uppercase mb-1">
                    Zalecana dawka
                  </p>
                  <p className="font-serif text-2xl text-ink">{result.dose}</p>
                  <p className="mt-1 text-xs text-ink-muted">{result.timing}</p>
                </div>
              ) : (
                <div className="rounded-field border border-border-warm bg-canvas px-5 py-4 text-center">
                  <p className="text-sm text-ink-subtle">
                    Wpisz wagę pupila, by zobaczyć zalecaną porcję.
                  </p>
                </div>
              )}

              {/* Disclaimer */}
              <div className="mt-5 flex items-start gap-2">
                <Info size={13} className="mt-0.5 shrink-0 text-ink-subtle" />
                <p className="text-xs leading-body text-ink-subtle">
                  Dawka ma charakter informacyjny — najlepszą diagnozę postawi
                  weterynarz Twojego pupila, który zna jego indywidualny stan zdrowia.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
