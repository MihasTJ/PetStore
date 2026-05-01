"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCart, type CartItem } from "@/lib/cart";

interface Props {
  item: Omit<CartItem, "quantity">;
  disabled?: boolean;
}

export function AddToCartButton({ item, disabled = false }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className="inline-flex items-center justify-center gap-2 rounded-button bg-terracotta px-8 py-4 text-base font-medium text-card-warm transition-colors hover:bg-terracotta-hover disabled:opacity-50 disabled:cursor-not-allowed"
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
    </button>
  );
}
