"use client";

import { useEffect } from "react";
import {
  ShoppingBag, X, Minus, Plus, Trash2, ArrowRight, RotateCcw, ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/cart";

function fmt(n: number) {
  return n.toFixed(2).replace(".", ",") + " zł";
}

function pluralProducts(n: number) {
  if (n === 1) return "produkt";
  const last2 = n % 100;
  const last1 = n % 10;
  if (last1 >= 2 && last1 <= 4 && (last2 < 12 || last2 > 14)) return "produkty";
  return "produktów";
}

const SHIPPING_ESTIMATE = 13.99;

export function CartDrawer() {
  const { items, removeItem, updateQty, total, count, isOpen, closeCart } = useCart();
  const isEmpty = items.length === 0;

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeCart(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeCart]);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={closeCart}
        className={[
          "fixed inset-0 z-40 bg-ink/20 transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      {/* Drawer panel */}
      <aside
        role="dialog"
        aria-label="Koszyk"
        aria-modal="true"
        className={[
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-[420px] flex-col bg-card-warm border-l border-border-warm",
          "transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-warm px-6 py-5">
          <h2 className="font-serif font-normal text-xl text-ink">
            Koszyk
            {count > 0 && (
              <span className="ml-2 font-sans text-sm font-normal text-ink-muted">
                — {count} {pluralProducts(count)}
              </span>
            )}
          </h2>
          <button
            onClick={closeCart}
            className="text-ink-subtle hover:text-ink transition-colors"
            aria-label="Zamknij koszyk"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {isEmpty ? (
          /* Empty state */
          <div className="flex flex-1 flex-col items-center justify-center px-10 text-center">
            <div className="mb-7 w-14 h-14 rounded-card bg-warm-island flex items-center justify-center">
              <ShoppingBag size={24} className="text-ink-subtle" strokeWidth={1.5} />
            </div>
            <p className="font-serif font-normal text-2xl text-ink leading-editorial mb-3">
              Pupil jeszcze na coś czeka
            </p>
            <p className="text-sm leading-body text-ink-muted mb-8 max-w-[240px]">
              Przeglądaj produkty dobrane przez weterynarzy do konkretnych potrzeb zdrowotnych.
            </p>
            <Link
              href="/produkty"
              onClick={closeCart}
              className="inline-flex items-center gap-2 rounded-button bg-terracotta px-6 py-3.5 text-sm font-medium text-card-warm hover:bg-terracotta-hover transition-colors cursor-pointer"
            >
              Przeglądaj produkty
              <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {items.map((item) => (
                <article key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 rounded-field shrink-0 bg-warm-island flex items-center justify-center">
                    <span className="text-[9px] text-ink-subtle italic text-center px-1 leading-tight">
                      zdjęcie
                    </span>
                  </div>

                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-ink leading-snug line-clamp-2">{item.name}</p>
                        <p className="text-xs text-ink-subtle mt-0.5">{item.weight}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="shrink-0 mt-0.5 p-1 rounded text-ink-subtle hover:text-error-warm hover:bg-error-warm/8 transition-colors cursor-pointer"
                        aria-label={`Usuń ${item.name}`}
                      >
                        <Trash2 size={14} strokeWidth={1.5} />
                      </button>
                    </div>

                    <div className="mt-auto pt-3 flex items-center justify-between">
                      <div className="inline-flex items-center border border-border-warm rounded-field overflow-hidden">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-ink-muted hover:bg-warm-island hover:text-ink transition-colors cursor-pointer"
                          aria-label="Zmniejsz ilość"
                        >
                          <Minus size={12} />
                        </button>
                        <input
                          type="number"
                          min={1}
                          max={item.stock}
                          value={item.quantity}
                          onChange={(e) => {
                            const v = parseInt(e.target.value, 10);
                            if (!isNaN(v)) updateQty(item.id, v);
                          }}
                          onBlur={(e) => {
                            const v = parseInt(e.target.value, 10);
                            if (isNaN(v) || v < 1) updateQty(item.id, 1);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                          }}
                          className="w-8 text-center text-sm font-medium text-ink font-tnum bg-transparent border-none outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          aria-label="Ilość"
                        />
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="w-8 h-8 flex items-center justify-center text-ink-muted hover:bg-terracotta/10 hover:text-terracotta transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="Zwiększ ilość"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <p className="font-tnum text-sm font-medium text-ink">
                        {fmt(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}

              <div className="flex items-start gap-2.5 pt-1">
                <RotateCcw size={13} className="shrink-0 mt-0.5 text-moss" strokeWidth={1.5} />
                <p className="text-xs leading-body text-ink-muted">
                  Jeśli pupil nie zaakceptuje — zwrot w 30 dni bez pytań.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border-warm px-6 py-6 space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-ink-muted">Produkty</span>
                  <span className="font-tnum text-ink">{fmt(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-muted">Dostawa (szacowana)</span>
                  <span className="font-tnum text-ink">{fmt(SHIPPING_ESTIMATE)}</span>
                </div>
                <div className="flex justify-between items-baseline pt-3 border-t border-border-warm">
                  <span className="text-base font-medium text-ink">Razem</span>
                  <p className="font-tnum text-xl font-medium text-ink">
                    {fmt(total + SHIPPING_ESTIMATE)}
                  </p>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="flex items-center justify-center gap-2 w-full rounded-button bg-terracotta px-6 py-4 text-base font-medium text-card-warm hover:bg-terracotta-hover transition-colors cursor-pointer"
              >
                Przejdź do dostawy
                <ArrowRight size={16} />
              </Link>

              <div className="flex items-center justify-center gap-6">
                {[
                  { icon: ShieldCheck, text: "Zweryfikowany skład" },
                  { icon: RotateCcw, text: "Zwrot 30 dni" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5">
                    <Icon size={12} className="text-moss shrink-0" strokeWidth={1.5} />
                    <span className="text-[11px] text-ink-muted">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
