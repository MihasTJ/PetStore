"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";
import { useCart } from "@/lib/cart";
import { createClient } from "@/lib/supabase/client";
import { createOrder } from "@/lib/actions/checkout";
import {
  Package,
  MapPin,
  User,
  ShieldCheck,
  RotateCcw,
  ChevronDown,
  Gift,
  Check,
} from "lucide-react";
import Link from "next/link";


type DeliveryMethod = "inpost" | "dpd";

const DELIVERY: Record<DeliveryMethod, { label: string; sub: string; price: number }> = {
  inpost: { label: "InPost Paczkomat 24h",  sub: "Odbiór w wybranym paczkomacie",   price: 13.99 },
  dpd:    { label: "Kurier DPD",             sub: "Dostawa pod drzwi, następny dzień", price: 14.99 },
};

const PREMIUM_PACKAGING_PRICE = 19;

function fmt(n: number) {
  return n.toFixed(2).replace(".", ",") + " zł";
}

function Field({
  label, id, type = "text", placeholder, required = false, value, onChange, className = "",
}: {
  label: string; id: string; type?: string; placeholder?: string;
  required?: boolean; value: string; onChange: (v: string) => void; className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-xs font-medium text-ink-muted mb-1.5">
        {label}{required && <span className="text-terracotta ml-0.5">*</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-field border border-border-warm bg-card-warm px-3.5 py-3 text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:border-terracotta focus:shadow-warm-focus transition-shadow"
      />
    </div>
  );
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();

  const [delivery, setDelivery] = useState<DeliveryMethod>("inpost");
  const [hasPremiumPackaging, setHasPremiumPackaging] = useState(false);
  const [packagingNote, setPackagingNote] = useState("");
  const [showNip, setShowNip] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [quizPetName, setQuizPetName] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<{
    name: string;
    address: string;
    city: string;
  } | null>(null);

  useEffect(() => {
    createClient().auth.getUser()
      .then(({ data }) => { if (data.user) setLoggedIn(true); })
      .catch(() => {});
    try {
      const stored = localStorage.getItem("quiz_pet_name");
      if (stored) setQuizPetName(stored);
    } catch {}

    // Load InPost Geowidget styles
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://geowidget.inpost.pl/inpost-geowidget.css";
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  // Listen for paczkomat selection from InPost Geowidget
  useEffect(() => {
    if (delivery !== "inpost") {
      setSelectedPoint(null);
      return;
    }
    const widget = document.getElementById("inpost-geowidget");
    if (!widget) return;

    const handlePoint = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const addr = detail.address;
      setSelectedPoint({
        name: detail.name ?? "",
        address: typeof addr === "object" && addr !== null
          ? (addr.line1 ?? "")
          : (addr ?? ""),
        city: typeof addr === "object" && addr !== null ? (addr.city ?? "") : "",
      });
    };

    widget.addEventListener("point", handlePoint);
    return () => widget.removeEventListener("point", handlePoint);
  }, [delivery]);

  const [form, setForm] = useState({
    email: "", firstName: "", lastName: "",
    street: "", apt: "", postalCode: "", city: "",
    nip: "",
  });

  const set = (key: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [key]: v }));

  const deliveryPrice = DELIVERY[delivery].price;
  const packagingPrice = hasPremiumPackaging ? PREMIUM_PACKAGING_PRICE : 0;
  const orderTotal = total + deliveryPrice + packagingPrice;

  if (items.length === 0) {
    return (
      <main className="bg-canvas flex-1 flex items-center">
        <div className="mx-auto max-w-editorial px-6 py-32 md:px-12 text-center">
          <h1 className="font-serif font-normal text-3xl text-ink leading-editorial mb-4">
            Twój pupil jeszcze na coś czeka
          </h1>
          <p className="text-base leading-body text-ink-muted mb-8">
            Dodaj produkty do koszyka, żeby przejść do zamówienia.
          </p>
          <Link
            href="/produkty"
            className="inline-flex items-center gap-2 rounded-button bg-terracotta px-8 py-4 text-base font-medium text-card-warm hover:bg-terracotta-hover transition-colors"
          >
            Przeglądaj produkty
          </Link>
        </div>
      </main>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) return;
    setSubmitting(true);
    setCheckoutError(null);

    const result = await createOrder({
      email: form.email,
      firstName: form.firstName,
      lastName: form.lastName,
      street: delivery === "inpost" ? (selectedPoint?.address ?? "") : form.street,
      apt: delivery === "inpost" ? "" : form.apt,
      postalCode: delivery === "inpost" ? "" : form.postalCode,
      city: delivery === "inpost" ? (selectedPoint?.city ?? "") : form.city,
      nip: form.nip,
      delivery,
      premiumPackaging: hasPremiumPackaging,
      packagingNote,
      petName: quizPetName ?? undefined,
      inpostPoint: delivery === "inpost" && selectedPoint ? selectedPoint : undefined,
      items: items.map(({ id, name, price, quantity }) => ({ id, name, price, quantity })),
    });

    if ("error" in result) {
      setCheckoutError(result.error);
      setSubmitting(false);
      return;
    }

    clearCart();
    try { localStorage.removeItem("quiz_pet_name"); } catch {}
    window.location.href = result.redirectUrl;
  }

  return (
    <main className="bg-canvas">
      <Script src="https://geowidget.inpost.pl/inpost-geowidget.js" strategy="lazyOnload" />
      <div className="mx-auto max-w-shell px-6 pt-28 pb-20 md:px-12 md:pt-32 md:pb-28">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-ink-subtle mb-10" aria-label="Etapy zamówienia">
          <Link href="/koszyk" className="hover:text-ink transition-colors">Koszyk</Link>
          <span>/</span>
          <span className="text-ink font-medium">Dostawa i płatność</span>
        </nav>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">

            {/* ── LEWA: formularz ──────────────────────────────────────── */}
            <div className="lg:col-span-7 space-y-10">

              {/* Sekcja 1: Dane kontaktowe */}
              <section>
                <SectionHeader icon={<User size={16} />} title="Dane kontaktowe" />
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    label="Imię" id="firstName" placeholder="Marta" required
                    value={form.firstName} onChange={set("firstName")}
                  />
                  <Field
                    label="Nazwisko" id="lastName" placeholder="Kowalska" required
                    value={form.lastName} onChange={set("lastName")}
                  />
                  <Field
                    label="Adres e-mail" id="email" type="email" placeholder="marta@przykład.pl" required
                    value={form.email} onChange={set("email")} className="sm:col-span-2"
                  />
                  {!loggedIn && (
                    <p className="sm:col-span-2 text-xs leading-body text-ink-subtle">
                      Masz już konto?{" "}
                      <Link href="/konto" className="text-terracotta underline underline-offset-4 hover:text-terracotta-hover transition-colors">
                        Zaloguj się
                      </Link>
                      {" "}— zachowasz raport zdrowotny pupila i historię zamówień.
                    </p>
                  )}
                </div>
              </section>

              {/* Sekcja 2: Adres dostawy */}
              <section>
                <SectionHeader icon={<MapPin size={16} />} title="Adres dostawy" />

                {delivery === "inpost" ? (
                  <div className="mt-5">
                    <div className="rounded-card-sm border border-border-warm overflow-hidden" style={{ minHeight: 480 }}>
                      {React.createElement("inpost-geowidget", {
                        id: "inpost-geowidget",
                        token: process.env.NEXT_PUBLIC_INPOST_GEOWIDGET_TOKEN ?? "",
                        language: "pl",
                        config: "parcelcollect",
                        style: { width: "100%", minHeight: 480, display: "block" },
                      })}
                    </div>
                    {selectedPoint ? (
                      <div className="mt-4 flex items-start gap-3 rounded-field border border-moss/20 bg-moss/5 px-4 py-3">
                        <Check size={15} className="shrink-0 mt-0.5 text-moss" strokeWidth={2} />
                        <div>
                          <p className="text-sm font-medium text-ink">{selectedPoint.name}</p>
                          <p className="text-xs text-ink-muted mt-0.5">
                            {selectedPoint.address}{selectedPoint.city ? `, ${selectedPoint.city}` : ""}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-3 text-xs text-ink-muted text-center">
                        Wybierz paczkomat na mapie powyżej
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-6">
                    <Field
                      label="Ulica i numer" id="street" placeholder="ul. Słoneczna 12" required
                      value={form.street} onChange={set("street")} className="sm:col-span-4"
                    />
                    <Field
                      label="Mieszkanie" id="apt" placeholder="/ 3A"
                      value={form.apt} onChange={set("apt")} className="sm:col-span-2"
                    />
                    <Field
                      label="Kod pocztowy" id="postalCode" placeholder="00-000" required
                      value={form.postalCode} onChange={set("postalCode")} className="sm:col-span-2"
                    />
                    <Field
                      label="Miasto" id="city" placeholder="Warszawa" required
                      value={form.city} onChange={set("city")} className="sm:col-span-4"
                    />
                  </div>
                )}
              </section>

              {/* Sekcja 3: Metoda dostawy */}
              <section>
                <SectionHeader icon={<Package size={16} />} title="Metoda dostawy" />
                <div className="mt-5 space-y-3">
                  {(Object.entries(DELIVERY) as [DeliveryMethod, typeof DELIVERY[DeliveryMethod]][]).map(([key, opt]) => (
                    <DeliveryCard
                      key={key}
                      selected={delivery === key}
                      onSelect={() => setDelivery(key)}
                      label={opt.label}
                      sub={opt.sub}
                      price={fmt(opt.price)}
                    />
                  ))}
                </div>
              </section>

              {/* Sekcja 4: Opakowanie Premium */}
              <section>
                <SectionHeader icon={<Gift size={16} />} title="Opakowanie" />

                {/* Standard — zawsze widoczna opcja bazowa */}
                <div className="mt-5 space-y-3">
                  <DeliveryCard
                    selected={!hasPremiumPackaging}
                    onSelect={() => setHasPremiumPackaging(false)}
                    label="Standardowe opakowanie"
                    sub="Bezpieczne, bez dodatkowych dekoracji"
                    price="w cenie"
                  />

                  {/* Premium Packaging — wyróżniona karta */}
                  <div
                    className={`relative rounded-card-sm border-2 transition-all cursor-pointer ${
                      hasPremiumPackaging
                        ? "border-terracotta bg-card-warm shadow-warm-md"
                        : "border-border-warm bg-card-warm hover:border-terracotta/40"
                    }`}
                    onClick={() => setHasPremiumPackaging(true)}
                    role="radio"
                    aria-checked={hasPremiumPackaging}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === " " && setHasPremiumPackaging(true)}
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          {/* Checkbox indicator */}
                          <span
                            className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                              hasPremiumPackaging ? "border-terracotta bg-terracotta" : "border-border-warm"
                            }`}
                          >
                            {hasPremiumPackaging && <Check size={11} className="text-card-warm" strokeWidth={2.5} />}
                          </span>

                          <div>
                            {/* Eyebrow */}
                            <p className="text-[11px] font-medium tracking-eyebrow uppercase text-terracotta mb-1">
                              Opcja Premium
                            </p>
                            <p className="text-sm font-medium text-ink">Zapakuj z wyjątkową troską</p>
                            <p className="mt-1.5 text-xs leading-body text-ink-muted max-w-xs">
                              Eleganckie pudełko, bibułka i ręcznie pisana karteczka z imieniem Twojego pupila.
                              Idealne, gdy każda chwila ma znaczenie.
                            </p>
                          </div>
                        </div>

                        <span className="shrink-0 font-tnum text-sm font-medium text-ink">
                          +{fmt(PREMIUM_PACKAGING_PRICE)}
                        </span>
                      </div>

                      {/* Pole na wiadomość — otwiera się po wyborze */}
                      {hasPremiumPackaging && (
                        <div className="mt-5 pt-5 border-t border-border-warm">
                          <label htmlFor="packagingNote" className="block text-xs font-medium text-ink-muted mb-2">
                            Treść karteczki (opcjonalnie)
                          </label>
                          <textarea
                            id="packagingNote"
                            rows={3}
                            maxLength={120}
                            placeholder="np. Dla Zuzi, z całym sercem — bo zasługuje na to, co najlepsze."
                            value={packagingNote}
                            onChange={(e) => setPackagingNote(e.target.value)}
                            className="w-full rounded-field border border-border-warm bg-warm-island px-3.5 py-3 text-sm text-ink placeholder:text-ink-subtle resize-none focus:outline-none focus:border-terracotta focus:shadow-warm-focus transition-shadow"
                          />
                          <p className="mt-1 text-[11px] text-ink-subtle text-right">
                            {packagingNote.length}/120
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Sekcja 5: Faktura VAT */}
              <section>
                <button
                  type="button"
                  onClick={() => setShowNip((v) => !v)}
                  className="flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors"
                >
                  <ChevronDown
                    size={15}
                    className={`transition-transform ${showNip ? "rotate-180" : ""}`}
                  />
                  Potrzebuję faktury VAT
                </button>

                {showNip && (
                  <div className="mt-4">
                    <Field
                      label="NIP firmy" id="nip" placeholder="000-000-00-00"
                      value={form.nip} onChange={set("nip")}
                    />
                    <p className="mt-2 text-xs text-ink-subtle">
                      Faktura zostanie wysłana na podany adres e-mail w ciągu 3 dni roboczych.
                    </p>
                  </div>
                )}
              </section>

              {/* Zgoda na regulamin */}
              <div
                className="flex items-start gap-3 cursor-pointer"
                onClick={(e) => {
                  if (!(e.target as HTMLElement).closest("a")) setAgreed((v) => !v);
                }}
              >
                <div
                  className={`mt-0.5 shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    agreed ? "border-terracotta bg-terracotta" : "border-border-warm hover:border-terracotta/50"
                  }`}
                >
                  {agreed && <Check size={11} className="text-card-warm" strokeWidth={2.5} />}
                </div>
                <span className="text-xs leading-body text-ink-muted">
                  Akceptuję{" "}
                  <Link href="/regulamin" className="underline underline-offset-4 hover:text-ink transition-colors">
                    Regulamin
                  </Link>{" "}
                  i{" "}
                  <Link href="/polityka-prywatnosci" className="underline underline-offset-4 hover:text-ink transition-colors">
                    Politykę prywatności
                  </Link>
                  {" "}sklepu.
                </span>
              </div>

            </div>

            {/* ── PRAWA: podsumowanie sticky ──────────────────────────── */}
            <div className="lg:col-span-5">
              <div className="bg-card-warm rounded-card shadow-warm p-6 md:p-8 sticky top-28">
                <h2 className="font-serif font-normal text-xl text-ink mb-6">Twoje zamówienie</h2>

                {/* Produkty */}
                <div className="space-y-3 pb-5 border-b border-border-warm">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between gap-4 text-sm">
                      <span className="text-ink-muted leading-snug truncate">
                        {item.name}
                        {item.quantity > 1 && (
                          <span className="font-tnum"> ×{item.quantity}</span>
                        )}
                      </span>
                      <span className="shrink-0 font-tnum text-ink">
                        {fmt(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Rozbicie kosztów */}
                <div className="space-y-3 py-5 border-b border-border-warm text-sm">
                  <div className="flex justify-between">
                    <span className="text-ink-muted">Produkty</span>
                    <span className="font-tnum text-ink">{fmt(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-muted">{DELIVERY[delivery].label}</span>
                    <span className="font-tnum text-ink">{fmt(deliveryPrice)}</span>
                  </div>
                  {hasPremiumPackaging && (
                    <div className="flex justify-between">
                      <span className="text-ink-muted">Pakowanie premium</span>
                      <span className="font-tnum text-ink">{fmt(PREMIUM_PACKAGING_PRICE)}</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="pt-5 flex justify-between items-baseline">
                  <span className="text-base font-medium text-ink">Do zapłaty</span>
                  <span className="font-tnum text-2xl font-medium text-ink">{fmt(orderTotal)}</span>
                </div>

                {/* Metody płatności */}
                <div className="mt-5 flex items-center gap-2 flex-wrap">
                  {["BLIK", "Karta", "Przelew"].map((m) => (
                    <span
                      key={m}
                      className="text-[11px] font-medium text-ink-muted border border-border-warm rounded-tag px-2.5 py-1"
                    >
                      {m}
                    </span>
                  ))}
                </div>

                {/* Błąd płatności */}
                {checkoutError && (
                  <p className="mt-5 rounded-field border border-terracotta/30 bg-terracotta/5 px-4 py-3 text-xs leading-body text-terracotta">
                    {checkoutError}
                  </p>
                )}

                {/* Gwarancja zwrotu — bezpośrednio nad przyciskiem, widoczna na mobile */}
                <div className="mt-6 flex items-start gap-2.5 rounded-field border border-moss/20 bg-moss/5 px-4 py-3">
                  <ShieldCheck size={15} className="shrink-0 mt-0.5 text-moss" strokeWidth={1.5} />
                  <span className="text-xs leading-body text-ink-muted">
                    Twój pupil nie polubił produktu? Zwrot bez pytań w ciągu 14 dni.
                  </span>
                </div>

                {/* CTA */}
                <button
                  type="submit"
                  disabled={!agreed || submitting || (delivery === "inpost" && !selectedPoint)}
                  className="mt-3 w-full flex items-center justify-center gap-2 rounded-button bg-terracotta px-6 py-4 text-base font-medium text-card-warm hover:bg-terracotta-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  {submitting ? "Przekierowuję do płatności…" : "Zamów dla pupila"}
                </button>

                {/* Gwarancja */}
                <div className="mt-6 space-y-3">
                  {[
                    { icon: ShieldCheck, text: "Twój zakup objęty gwarancją satysfakcji — zwrot bez pytań w 30 dni" },
                    { icon: RotateCcw,   text: "Jeśli pupil nie zaakceptuje produktu, zwracamy pełną kwotę" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-start gap-2.5">
                      <Icon size={14} className="shrink-0 mt-0.5 text-moss" strokeWidth={1.5} />
                      <span className="text-xs leading-body text-ink-muted">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </main>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2.5 pb-4 border-b border-border-warm">
      <span className="text-ink-subtle">{icon}</span>
      <h2 className="text-base font-medium text-ink">{title}</h2>
    </div>
  );
}

function DeliveryCard({
  selected, onSelect, label, sub, price,
}: {
  selected: boolean; onSelect: () => void;
  label: string; sub: string; price: string;
}) {
  return (
    <div
      onClick={onSelect}
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onKeyDown={(e) => e.key === " " && onSelect()}
      className={`flex items-center justify-between gap-4 rounded-card-sm border-2 px-5 py-4 cursor-pointer transition-all ${
        selected
          ? "border-terracotta bg-card-warm shadow-warm"
          : "border-border-warm bg-card-warm hover:border-terracotta/40"
      }`}
    >
      <div className="flex items-center gap-4">
        <span
          className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            selected ? "border-terracotta bg-terracotta" : "border-border-warm"
          }`}
        >
          {selected && <Check size={11} className="text-card-warm" strokeWidth={2.5} />}
        </span>
        <div>
          <p className="text-sm font-medium text-ink">{label}</p>
          <p className="text-xs text-ink-muted mt-0.5">{sub}</p>
        </div>
      </div>
      <span className="shrink-0 font-tnum text-sm font-medium text-ink">{price}</span>
    </div>
  );
}
