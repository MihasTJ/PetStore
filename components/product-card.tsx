"use client";

import { useState } from "react";
import { ShieldCheck, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/lib/cart";

const TAG_COLORS: Record<string, string> = {
  joints: "#A87B5C", coat: "#7A6E5A", weight: "#5C7A6B",
  teeth: "#8B7355", heart: "#9C5447", gut: "#9C8458",
  stawy: "#A87B5C", sierść: "#7A6E5A", seniory: "#9C5447",
  "duże rasy": "#7A6E5A", glukozamina: "#A87B5C", wellness: "#5C7A6B",
  skład: "#8B7355", biodostępność: "#9C8458",
}

function tagColor(tag: string): string {
  return TAG_COLORS[tag.toLowerCase()] ?? "#A87B5C"
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: string;
  priceNumeric: number;
  pricePromo?: number | null;
  category?: string | null;
  weight: string;
  stock?: number;
  healthTags: string[];
  isPremiumVerified?: boolean;
  hasExpertEndorsement?: boolean;
}

export function ProductCard({
  id,
  slug,
  name,
  description,
  price,
  priceNumeric,
  pricePromo,
  category,
  weight,
  stock = 9999,
  healthTags,
  isPremiumVerified = false,
  hasExpertEndorsement = false,
}: Product) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const hasPromo = pricePromo != null && pricePromo > 0;

  function handleAdd() {
    if (added) return;
    addItem({ id, slug, name, price: hasPromo ? pricePromo! : priceNumeric, weight, stock });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <article className="group flex flex-col bg-card-warm rounded-card-sm shadow-warm hover:shadow-warm-md transition-shadow duration-200 overflow-hidden">
      {/* Image */}
      <a href={`/products/${slug}`} className="relative block aspect-square sm:aspect-[4/3] bg-warm-island shrink-0">
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
      <div className="flex flex-col flex-1 px-3 pb-3 pt-2.5 sm:px-5 sm:pb-5 sm:pt-4">
        {/* Health tags */}
        {healthTags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {healthTags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-tag px-2 py-0.5 text-[11px] font-medium capitalize"
                style={{ backgroundColor: `${tagColor(tag)}1A`, color: tagColor(tag) }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Name + description */}
        <a href={`/products/${slug}`} className="group/link">
          {category && (
            <p className="mb-1 text-[10px] font-medium tracking-widest uppercase text-ink-subtle">
              {category}
            </p>
          )}
          <p className="text-sm font-medium leading-snug text-ink group-hover/link:opacity-70 transition-opacity">
            {name}
          </p>
        </a>
        <p className="mt-1.5 text-xs leading-body text-ink-muted line-clamp-2">{description}</p>

        {/* Expert endorsement badge */}
        {hasExpertEndorsement && (
          <div className="mt-3 flex items-center gap-1.5">
            <ShieldCheck size={13} className="shrink-0 text-moss" />
            <span className="text-xs text-moss">Analizowane przez Kuratorów</span>
          </div>
        )}

        {/* Spacer + Price + CTA */}
        <div className="mt-auto" />
        <div className="border-t border-border-warm" />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-3 pt-4">
          <div>
            {hasPromo ? (
              <>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <p className="font-tnum text-base font-medium text-terracotta leading-tight">
                    {pricePromo!.toFixed(2).replace(".", ",") + " zł"}
                  </p>
                  <p className="font-tnum text-sm text-ink-muted line-through leading-tight">{price}</p>
                  <span
                    className="rounded-tag px-1.5 py-0.5 text-[10px] font-medium text-terracotta"
                    style={{ backgroundColor: "rgba(184,101,74,0.1)" }}
                  >
                    -{Math.round((1 - pricePromo! / priceNumeric) * 100)}%
                  </span>
                </div>
              </>
            ) : (
              <p className="font-tnum text-base font-medium text-ink leading-tight">{price}</p>
            )}
            {weight && <p className="mt-0.5 text-[11px] text-ink-subtle">{weight}</p>}
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className={[
              "w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-1.5 rounded-button px-4 py-2 text-sm font-medium text-card-warm",
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
