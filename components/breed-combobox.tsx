"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { DOG_BREEDS, CAT_BREEDS } from "@/lib/breeds";

function highlightMatch(text: string, query: string) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <strong className="font-semibold text-terracotta not-italic">
        {text.slice(idx, idx + query.length)}
      </strong>
      {text.slice(idx + query.length)}
    </>
  );
}

export function BreedCombobox({
  value,
  onChange,
  species,
  placeholder,
  inputClassName,
}: {
  value: string;
  onChange: (v: string) => void;
  species: string | null;
  placeholder?: string;
  inputClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const breedList = species === "pies" ? DOG_BREEDS : species === "kot" ? CAT_BREEDS : [];

  const suggestions =
    value.trim().length > 0
      ? breedList.filter((b) => b.toLowerCase().includes(value.toLowerCase())).slice(0, 8)
      : [];

  const showDropdown = open && suggestions.length > 0;

  useEffect(() => {
    function onOutside(e: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("touchstart", onOutside);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("touchstart", onOutside);
    };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value);
    setOpen(true);
    setHighlighted(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showDropdown) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, -1));
    } else if (e.key === "Enter" && highlighted >= 0) {
      e.preventDefault();
      onChange(suggestions[highlighted]);
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  function select(breed: string) {
    onChange(breed);
    setOpen(false);
    setHighlighted(-1);
  }

  const defaultPlaceholder =
    species === "kot"
      ? "np. europejski, ragdoll, perski"
      : species === "pies"
      ? "np. golden retriever, mieszaniec"
      : "Wybierz najpierw gatunek";

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder ?? defaultPlaceholder}
        autoComplete="off"
        className={
          inputClassName ??
          "w-full rounded-field border border-border-warm bg-card-warm px-4 py-3 text-base text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition-colors"
        }
      />
      {showDropdown && (
        <ul className="absolute z-20 mt-1 w-full rounded-field border border-border-warm bg-card-warm shadow-warm-md overflow-hidden">
          {suggestions.map((breed, i) => (
            <li
              key={breed}
              onPointerDown={() => select(breed)}
              onMouseEnter={() => setHighlighted(i)}
              className={cn(
                "px-4 py-2.5 text-sm cursor-pointer transition-colors",
                i === highlighted
                  ? "bg-warm-island text-ink"
                  : "text-ink-muted hover:bg-warm-island hover:text-ink"
              )}
            >
              {highlightMatch(breed, value)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
