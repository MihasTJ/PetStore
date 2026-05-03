"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, User, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart";

const links = [
  { label: "Produkty", href: "/produkty" },
  { label: "Dlaczego Premium?", href: "/dlaczego-premium" },
  { label: "AI Quiz", href: "/quiz" },
  { label: "Eksperci", href: "/eksperci" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { count, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-colors duration-300",
        scrolled || mobileOpen ? "bg-canvas" : "bg-transparent"
      )}
    >
      <nav className="mx-auto max-w-editorial flex items-center justify-between px-6 py-5 md:px-12">
        <a href="/" className="font-serif text-xl text-ink tracking-tight">
          Nobile
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={cn(
                  "text-sm transition-colors border-b pb-0.5",
                  pathname === link.href
                    ? "text-ink border-terracotta"
                    : "text-ink-muted border-transparent hover:text-ink"
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-5">
          <a
            href="/konto"
            className="hidden md:block text-ink-muted hover:text-ink transition-colors"
            aria-label="Konto"
          >
            <User size={20} />
          </a>

          <button
            type="button"
            onClick={openCart}
            className="relative p-2 -m-2 text-ink-muted hover:text-ink transition-colors cursor-pointer"
            aria-label="Otwórz koszyk"
          >
            <ShoppingBag size={20} />
            {count > 0 && (
              <span
                key={count}
                className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-terracotta animate-in zoom-in-50 duration-300"
              />
            )}
          </button>

          <button
            type="button"
            className="md:hidden p-2 -m-2 text-ink-muted hover:text-ink transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Zamknij menu" : "Otwórz menu"}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden bg-card-warm border-t border-border-warm shadow-warm-md animate-in fade-in slide-in-from-top-2 duration-200">
          <ul className="flex flex-col px-6 py-6 gap-6">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cn(
                    "text-base transition-colors",
                    pathname === link.href ? "text-ink" : "text-ink-muted hover:text-ink"
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-4 border-t border-border-warm">
              <a
                href="/konto"
                className="text-base text-ink-muted hover:text-ink transition-colors"
              >
                Konto
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
