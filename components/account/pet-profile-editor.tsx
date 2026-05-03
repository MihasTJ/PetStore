"use client";

import { useState, useTransition } from "react";
import { Heart, ChevronDown, ChevronRight, Pencil, X } from "lucide-react";
import Link from "next/link";
import { BreedCombobox } from "@/components/breed-combobox";
import { DatePicker } from "@/components/ui/date-picker";
import { updatePetProfileAction } from "@/lib/actions/pet";
import type { PetProfile } from "@/types/database";

function calcAgeLabel(birthDate: string | null): string {
  if (!birthDate) return "Nieznany";
  const birth = new Date(birthDate);
  const now = new Date();
  const months =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth());
  if (months < 12) return `${months} mies.`;
  const years = Math.floor(months / 12);
  return years === 1 ? "1 rok" : `${years} lata`;
}

const SPECIES_OPTIONS = [
  { value: "pies", label: "Pies" },
  { value: "kot", label: "Kot" },
  { value: "inny", label: "Inny pupil" },
] as const;

const inputClass =
  "w-full rounded-field border border-border-warm bg-canvas px-3 py-2 text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:border-terracotta/60 focus:ring-2 focus:ring-terracotta/10 transition";

const labelClass =
  "block text-xs font-medium tracking-eyebrow uppercase text-ink-subtle mb-1.5";

interface Props {
  pet: PetProfile;
}

export function PetProfileEditor({ pet }: Props) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [saveError, setSaveError] = useState<string | null>(null);

  const [persisted, setPersisted] = useState({
    petName: pet.pet_name,
    species: pet.species,
    breed: pet.breed ?? "",
    birthDate: pet.birth_date ?? "",
    weightKg: pet.weight_kg?.toString() ?? "",
  });

  const [draft, setDraft] = useState(persisted);

  function handleEdit() {
    setDraft(persisted);
    setSaveError(null);
    setEditing(true);
  }

  function handleCancel() {
    setDraft(persisted);
    setSaveError(null);
    setEditing(false);
  }

  function handleSave() {
    if (!draft.petName.trim()) return;
    setSaveError(null);
    startTransition(async () => {
      const result = await updatePetProfileAction(pet.id, {
        pet_name: draft.petName.trim(),
        species: draft.species,
        breed: draft.breed || null,
        birth_date: draft.birthDate || null,
        weight_kg: draft.weightKg ? parseFloat(draft.weightKg) : null,
      });
      if (result.error) {
        setSaveError(result.error);
      } else {
        setPersisted(draft);
        setEditing(false);
      }
    });
  }

  const today = new Date().toISOString().split("T")[0];
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 50);
  const minDateStr = minDate.toISOString().split("T")[0];

  const petAge = calcAgeLabel(persisted.birthDate || null);

  const displayRows = [
    { label: "Wiek", value: petAge },
    persisted.birthDate && {
      label: "Data urodzenia",
      value: new Date(persisted.birthDate).toLocaleDateString("pl-PL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    },
    persisted.weightKg && {
      label: "Waga",
      value: `${parseFloat(persisted.weightKg).toString().replace(".", ",")} kg`,
    },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif font-normal text-xl text-ink">Profil pupila</h2>
        {!editing ? (
          <button
            type="button"
            onClick={handleEdit}
            className="flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink transition-colors cursor-pointer"
          >
            <Pencil size={12} strokeWidth={1.5} />
            Edytuj
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCancel}
            disabled={isPending}
            className="flex items-center gap-1 text-xs text-ink-subtle hover:text-ink transition-colors cursor-pointer disabled:opacity-50"
          >
            <X size={13} strokeWidth={1.5} />
            Anuluj
          </button>
        )}
      </div>

      {/* View mode */}
      {!editing && (
        <div className="flex items-center gap-4 mb-7">
          <div className="w-14 h-14 rounded-full bg-warm-island flex items-center justify-center shrink-0">
            <Heart size={20} className="text-ink-subtle" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-base font-medium text-ink">{persisted.petName}</p>
            <p className="text-sm text-ink-muted capitalize">
              {persisted.species === "pies"
                ? "Pies"
                : persisted.species === "kot"
                ? "Kot"
                : "Inny pupil"}
              {persisted.breed ? ` · ${persisted.breed}` : ""}
            </p>
          </div>
        </div>
      )}

      {!editing && (
        <div className="space-y-0 mb-6">
          {displayRows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between py-3 border-b border-border-warm last:border-0"
            >
              <span className="text-xs font-medium tracking-eyebrow uppercase text-ink-subtle">
                {row.label}
              </span>
              <span className="text-sm text-ink">{row.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Edit mode */}
      {editing && (
        <div className="space-y-4">
          {saveError && (
            <p className="text-xs text-error-warm">{saveError}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Imię pupila</label>
              <input
                type="text"
                value={draft.petName}
                onChange={(e) => setDraft({ ...draft, petName: e.target.value })}
                className={inputClass}
                placeholder="Zuzia"
                autoFocus
              />
            </div>
            <div>
              <label className={labelClass}>Gatunek</label>
              <div className="relative">
                <select
                  value={draft.species}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      species: e.target.value as "pies" | "kot" | "inny",
                      breed: "",
                    })
                  }
                  className={`${inputClass} appearance-none pr-8 cursor-pointer`}
                >
                  {SPECIES_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  strokeWidth={1.5}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle"
                />
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Rasa</label>
            <BreedCombobox
              value={draft.breed}
              onChange={(v) => setDraft({ ...draft, breed: v })}
              species={
                draft.species === "pies" || draft.species === "kot"
                  ? draft.species
                  : null
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Data urodzenia</label>
              <DatePicker
                value={draft.birthDate}
                onChange={(v) => setDraft({ ...draft, birthDate: v })}
                min={minDateStr}
                max={today}
                placeholder="Wybierz datę urodzenia"
                className="border-border-warm bg-canvas px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className={labelClass}>Waga (kg)</label>
              <input
                type="number"
                min="0.1"
                max="100"
                step="0.1"
                value={draft.weightKg}
                onChange={(e) => setDraft({ ...draft, weightKg: e.target.value })}
                className={`${inputClass} font-tnum`}
                placeholder="4.2"
              />
            </div>
          </div>

          {/* Save button — primary action at the bottom */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending || !draft.petName.trim()}
              className="w-full inline-flex items-center justify-center rounded-button bg-terracotta px-6 py-3 text-sm font-medium text-card-warm hover:bg-terracotta-hover transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Zapisywanie…" : "Zapisz zmiany"}
            </button>
          </div>
        </div>
      )}

      {/* Quiz link — hidden in edit mode */}
      {!editing && (
        <Link
          href="/quiz"
          className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-button border border-border-warm px-6 py-3 text-sm font-medium text-ink hover:border-terracotta/40 transition-colors"
        >
          Sprawdź, czego potrzebuje {persisted.petName}
          <ChevronRight size={14} />
        </Link>
      )}
    </>
  );
}
