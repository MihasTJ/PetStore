"use client";

import { useCart } from "@/lib/cart";
import { Minus, Plus, Trash2, ShieldCheck, ArrowRight, ShoppingBag, RotateCcw } from "lucide-react";
import Link from "next/link";

const SHIPPING_ESTIMATE = 13.99;

function fmt(n: number) {
  return n.toFixed(2).replace(".", ",") + " zł";
}

export default function KoszykPage() {
  const { items, removeItem, updateQty, total, count } = useCart();
  const isEmpty = items.length === 0;

  if (isEmpty) {
    return (
      <main className="bg-canvas flex-1 flex items-center">
        <div className="mx-auto max-w-editorial px-6 py-32 md:px-12 text-center">
          <div className="mx-auto mb-10 w-16 h-16 rounded-card bg-warm-island flex items-center justify-center">
            <ShoppingBag size={28} className="text-ink-subtle" strokeWidth={1.5} />
          </div>
          <h1 className="font-serif font-normal text-4xl md:text-[2.75rem] text-ink leading-editorial mb-5">
            Twój pupil jeszcze na coś czeka
          </h1>
          <p className="text-base leading-body text-ink-muted mb-10 max-w-sm mx-auto">
            Przeglądaj produkty dobrane przez weterynarzy do konkretnych potrzeb zdrowotnych.
          </p>
          <Link
            href="/produkty"
            className="inline-flex items-center gap-2 rounded-button bg-terracotta px-8 py-4 text-base font-medium text-card-warm hover:bg-terracotta-hover transition-colors"
          >
            Przeglądaj produkty
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    );
  }

  const estimatedTotal = total + SHIPPING_ESTIMATE;

  return (
    <main className="bg-canvas">
      <div className="mx-auto max-w-shell px-6 pt-28 pb-20 md:px-12 md:pt-32 md:pb-28">

        <h1 className="font-serif font-normal text-3xl md:text-4xl text-ink leading-editorial mb-12">
          Koszyk
        </h1>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">

          {/* Lista produktów */}
          <div className="lg:col-span-7 space-y-4">
            {items.map((item) => (
              <article
                key={item.id}
                className="bg-card-warm rounded-card-sm shadow-warm p-5 flex gap-5"
              >
                {/* Miniatura */}
                <div className="w-20 h-20 rounded-field shrink-0 bg-warm-island flex items-center justify-center text-center px-2">
                  <span className="text-[10px] text-ink-subtle leading-tight italic">
                    zdjęcie lifestyle
                  </span>
                </div>

                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink leading-snug">{item.name}</p>
                      <p className="text-xs text-ink-subtle mt-0.5">{item.weight}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="shrink-0 mt-0.5 text-ink-subtle hover:text-error-warm transition-colors"
                      aria-label={`Usuń ${item.name} z koszyka`}
                    >
                      <Trash2 size={15} strokeWidth={1.5} />
                    </button>
                  </div>

                  <div className="mt-auto pt-4 flex items-center justify-between">
                    {/* Ilość */}
                    <div className="inline-flex items-center border border-border-warm rounded-field overflow-hidden">
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center text-ink-muted hover:text-ink transition-colors"
                        aria-label="Zmniejsz ilość"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-7 text-center text-sm font-medium text-ink font-tnum select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center text-ink-muted hover:text-ink transition-colors"
                        aria-label="Zwiększ ilość"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <p className="font-tnum text-base font-medium text-ink">
                      {fmt(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </article>
            ))}

            {/* Gwarancja — inline trust */}
            <div className="flex items-start gap-3 pt-2 px-1">
              <RotateCcw size={15} className="shrink-0 mt-0.5 text-moss" strokeWidth={1.5} />
              <p className="text-xs leading-body text-ink-muted">
                Jeśli pupil nie zaakceptuje produktu — zwrot bez pytań w ciągu 30 dni.
                Żadnych formularzy, żadnych uzasadnień.
              </p>
            </div>
          </div>

          {/* Podsumowanie */}
          <div className="lg:col-span-5">
            <div className="bg-card-warm rounded-card shadow-warm p-6 md:p-8 sticky top-28">
              <h2 className="font-serif font-normal text-xl text-ink mb-6">Podsumowanie</h2>

              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-ink-muted truncate pr-4">
                      {item.name}
                      {item.quantity > 1 && (
                        <span className="font-tnum"> ×{item.quantity}</span>
                      )}
                    </span>
                    <span className="font-tnum shrink-0 text-ink">{fmt(item.price * item.quantity)}</span>
                  </div>
                ))}

                <div className="flex justify-between text-sm pt-1">
                  <span className="text-ink-muted">Dostawa (szacowana)</span>
                  <span className="font-tnum text-ink">{fmt(SHIPPING_ESTIMATE)}</span>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-border-warm flex justify-between items-baseline">
                <span className="text-base font-medium text-ink">Razem</span>
                <div className="text-right">
                  <p className="font-tnum text-2xl font-medium text-ink">{fmt(estimatedTotal)}</p>
                  <p className="text-[11px] text-ink-subtle mt-0.5">Ostateczna kwota po wyborze dostawy</p>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-6 flex items-center justify-center gap-2 w-full rounded-button bg-terracotta px-6 py-4 text-base font-medium text-card-warm hover:bg-terracotta-hover transition-colors"
              >
                Przejdź do dostawy
                <ArrowRight size={16} />
              </Link>

              {/* Trust signals */}
              <div className="mt-6 space-y-3">
                {[
                  { icon: ShieldCheck, text: "Skład zweryfikowany weterynaryjnie" },
                  { icon: RotateCcw,   text: "Zwrot w 30 dni bez pytań" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5">
                    <Icon size={14} className="shrink-0 text-moss" strokeWidth={1.5} />
                    <span className="text-xs text-ink-muted">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
