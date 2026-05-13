"use client";

import { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  weight: string;
  stock: number;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("nobile_cart");
      if (raw) {
        const parsed: CartItem[] = JSON.parse(raw);
        setItems(parsed.map((i) => ({
          ...i,
          stock: typeof i.stock === "number" && i.stock >= 0 ? i.stock : 9999,
          quantity: typeof i.quantity === "number" && i.quantity > 0 ? i.quantity : 1,
        })));
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("nobile_cart", JSON.stringify(items));
    } catch {}
  }, [items]);

  function addItem(item: Omit<CartItem, "quantity">) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        if (existing.quantity >= item.stock) return prev;
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateQty(id: string, qty: number) {
    if (qty <= 0) { removeItem(id); return; }
    setItems((prev) => prev.map((i) => {
      if (i.id !== id) return i;
      const max = typeof i.stock === "number" && i.stock > 0 ? i.stock : qty;
      return { ...i, quantity: Math.min(qty, max) };
    }));
  }

  function clearCart() { setItems([]); }

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count, isOpen, openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false) }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
