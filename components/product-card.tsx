"use client";

import { useState } from "react";
import { ShieldCheck, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/lib/cart";

export type HealthTag = "joints" | "coat" | "weight" | "teeth" | "heart" | "gut";

const tagConfig: Record<HealthTag, { label: string; hex: string }> = {
  joints: { label: "Stawy",              hex: "#A87B5C" },
  coat:   { label: "Sierść",             hex: "#7A6E5A" },
  weight: { label: "Waga",               hex: "#5C7A6B" },
  teeth:  { label: "Zęby",               hex: "#8B7355" },
  heart:  { label: "Serce",              hex: "#9C5447" },
  gut:    { label: "Jelita",             hex: "#9C8458" },
};

export interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: string;
  priceNumeric: number;
  weight: string;
  healthTags: HealthTag[];
  isPremiumVerified?: boolean;
  hasVetEndorsement?: boolean;
}

export function ProductCard({
  id,
  slug,
  name,
  description,
  price,
  priceNumeric,
  weight,
  healthTags,
  isPremiumVerified = false,
  hasVetEndorsement = false,
}: Product) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    if (added) return;
    addItem({ id: String(id), slug, name, price: priceNumeric, weight });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <article className="group flex flex-col bg-card-warm rounded-card-sm shadow-warm hover:shadow-warm-md transition-shadow duration-200 overflow-hidden">
      {/* Image */}
      <a href={`/produkty/${slug}`} className="relative block aspect-[4/3] bg-warm-island shrink-0">
        {isPremiumVerified && (
          <span
            className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-tag px-2 py-1 text-[11px] font-medium tracking-eyebrow uppercase"
            style={{ backgroundColor: "rgba(61,79,61,0.10)", color: "#3D4F3D" }}
          >
            Premium Verified
          </span>
        )}
        <div className="flex h-full items-center justify-center px-6">
          <p className="text-center text-xs leading-body text-ink-subtle italic">
            Lifestyle — produkt na blacie kuchennym,
            naturalne światło z okna, ciepła korekcja.
          </p>
        </div>
      </a>

      {/* Content */}
      <div className="flex flex-col flex-1 px-5 pb-5 pt-4">
        {/* Health tags */}
        {healthTags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {healthTags.map((tag) => {
              const { label, hex } = tagConfig[tag];
              return (
                <span
                  key={tag}
                  className="rounded-tag px-2 py-0.5 text-[11px] font-medium"
                  style={{ backgroundColor: `${hex}1A`, color: hex }}
                >
                  {label}
                </span>
              );
            })}
          </div>
        )}

        {/* Name + description */}
        <a href={`/produkty/${slug}`} className="group/link">
          <p className="text-sm font-medium leading-snug text-ink group-hover/link:opacity-70 transition-opacity">
            {name}
          </p>
        </a>
        <p className="mt-1.5 text-xs leading-body text-ink-muted line-clamp-2">{description}</p>

        {/* Vet endorsement */}
        {hasVetEndorsement && (
          <div className="mt-3 flex items-center gap-1.5">
            <ShieldCheck size={13} className="shrink-0 text-moss" />
            <span className="text-xs text-moss">Zweryfikowany przez weterynarza</span>
          </div>
        )}

        {/* Spacer + Price + CTA */}
        <div className="mt-auto" />
        <div className="border-t border-border-warm" />
        <div className="flex items-end justify-between gap-3 pt-4">
          <div>
            <p className="font-tnum text-base font-medium text-ink leading-tight">{price}</p>
            <p className="mt-0.5 text-[11px] text-ink-subtle">{weight}</p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className={[
              "shrink-0 inline-flex items-center gap-1.5 rounded-button px-4 py-2 text-sm font-medium text-card-warm",
              "transition-[background-color,transform] duration-300 active:scale-95 cursor-pointer",
              added ? "bg-moss" : "bg-terracotta hover:bg-terracotta-hover",
            ].join(" ")}
          >
            <span key={String(added)} className="inline-flex items-center gap-1.5 animate-in zoom-in-75 fade-in duration-150">
              {added ? (
                <><Check size={13} strokeWidth={2} />Dodano</>
              ) : (
                <><ShoppingBag size={13} />Dodaj dla pupila</>
              )}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
