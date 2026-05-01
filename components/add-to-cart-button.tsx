"use client";

import { useState } from "react";
import { ShoppingBag, Check, CheckCheck } from "lucide-react";
import { useCart, type CartItem } from "@/lib/cart";

interface Props {
  item: Omit<CartItem, "quantity">;
  disabled?: boolean;
}

export function AddToCartButton({ item, disabled = false }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    if (added) return;
    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 2100);
  }

  return (
    <div className="relative">
      {added && (
        <span className="absolute -top-10 left-1/2 pointer-events-none inline-flex items-center gap-1.5 whitespace-nowrap rounded-tag bg-moss px-3 py-1.5 text-xs font-medium text-card-warm shadow-warm-md animate-cart-toast">
          <CheckCheck size={12} strokeWidth={2} />
          Dodano do koszyka
        </span>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={handleClick}
        className={[
          "inline-flex items-center justify-center gap-2 rounded-button px-8 py-4 text-base font-medium text-card-warm",
          "transition-[background-color,transform] duration-300 active:scale-[0.96] cursor-pointer",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          added ? "bg-moss" : "bg-terracotta hover:bg-terracotta-hover",
        ].join(" ")}
      >
        <span
          key={String(added)}
          className="inline-flex items-center gap-2 animate-in zoom-in-75 fade-in duration-200"
        >
          {added ? (
            <>
              <Check size={17} />
              Dodano dla pupila
            </>
          ) : (
            <>
              <ShoppingBag size={17} />
              Dodaj dla pupila
            </>
          )}
        </span>
      </button>
    </div>
  );
}
