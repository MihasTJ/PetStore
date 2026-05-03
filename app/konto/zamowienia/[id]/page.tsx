import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  ShieldCheck,
  CreditCard,
  FileText,
  Check,
} from "lucide-react";

// Docelowo: SELECT z orders JOIN order_items WHERE id = params.id AND customer_id = auth.uid()
const MOCK_ORDERS: Record<string, Order> = {
  "NB-2847": {
    id: "NB-2847",
    date: "28 kwietnia 2026",
    deliveredAt: "30 kwietnia 2026",
    status: "delivered",
    statusLabel: "Dostarczono",
    paymentMethod: "BLIK",
    shipping: "InPost Paczkomat",
    shippingCost: "13,99 zł",
    packagingPremium: false,
    address: {
      name: "Anna Kowalska",
      line1: "ul. Lipowa 12/4",
      city: "00-001 Warszawa",
      point: "WAW43N — Galeria Mokotów, parter",
    },
    items: [
      {
        name: "Suplement na stawy Senior",
        variant: "90 kapsułek",
        qty: 1,
        price: "175,00 zł",
        slug: "suplement-stawy-senior",
      },
    ],
    subtotal: "175,00 zł",
    total: "189,00 zł",
    hasHealthReport: true,
  },
  "NB-2614": {
    id: "NB-2614",
    date: "2 marca 2026",
    deliveredAt: "4 marca 2026",
    status: "delivered",
    statusLabel: "Dostarczono",
    paymentMethod: "Karta Visa",
    shipping: "DPD Kurier",
    shippingCost: "14,99 zł",
    packagingPremium: true,
    address: {
      name: "Anna Kowalska",
      line1: "ul. Lipowa 12/4",
      city: "00-001 Warszawa",
      point: null,
    },
    items: [
      {
        name: "Karma premium z łososiem",
        variant: "2 kg",
        qty: 1,
        price: "109,00 zł",
        slug: "karma-losos",
      },
      {
        name: "Przysmaki dentystyczne",
        variant: "150 g",
        qty: 1,
        price: "25,00 zł",
        slug: "przysmaki-dentystyczne",
      },
    ],
    subtotal: "134,00 zł",
    total: "148,99 zł",
    hasHealthReport: false,
  },
};

type Order = {
  id: string;
  date: string;
  deliveredAt: string;
  status: string;
  statusLabel: string;
  paymentMethod: string;
  shipping: string;
  shippingCost: string;
  packagingPremium: boolean;
  address: { name: string; line1: string; city: string; point: string | null };
  items: { name: string; variant: string; qty: number; price: string; slug: string }[];
  subtotal: string;
  total: string;
  hasHealthReport: boolean;
};

const TIMELINE = [
  { label: "Zamówienie przyjęte", key: "placed" },
  { label: "Płatność potwierdzona", key: "paid" },
  { label: "Przekazano do wysyłki", key: "shipped" },
  { label: "Dostarczono", key: "delivered" },
];

export async function generateStaticParams() {
  return Object.keys(MOCK_ORDERS).map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: `Zamówienie ${id} — Nobile` };
}

export default async function ZamowieniePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = MOCK_ORDERS[id];
  if (!order) notFound();

  return (
    <main className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-[680px] px-6 pt-28 pb-24 md:px-8 md:pt-36">

        {/* Breadcrumb */}
        <Link
          href="/konto"
          className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink transition-colors mb-10"
        >
          <ArrowLeft size={13} strokeWidth={1.5} />
          Wróć do konta
        </Link>

        {/* Nagłówek */}
        <div className="mb-10">
          <p className="mb-4 text-xs font-medium tracking-eyebrow uppercase text-ink-subtle">
            Zamówienie {order.id}
          </p>
          <h1 className="font-serif font-normal text-4xl md:text-[2.75rem] text-ink leading-editorial mb-3">
            Doskonały wybór dla Twojego pupila.
          </h1>
          <p className="text-base leading-body text-ink-muted">
            Zamówione {order.date} · dostarczone {order.deliveredAt}
          </p>
        </div>

        {/* Timeline */}
        {/* Mobile: pionowy, Desktop: poziomy */}
        <div className="mb-10">
          {/* Poziomy — md+ */}
          <div className="hidden md:flex items-center gap-0">
            {TIMELINE.map((step, i) => {
              const done = true;
              const isLast = i === TIMELINE.length - 1;
              return (
                <div key={step.key} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        done ? "bg-moss" : "bg-border-warm"
                      }`}
                    >
                      <Check size={11} strokeWidth={2.5} className="text-card-warm" />
                    </div>
                    <span className="text-[10px] text-ink-subtle text-center leading-tight max-w-[72px]">
                      {step.label}
                    </span>
                  </div>
                  {!isLast && (
                    <div
                      className={`h-px flex-1 mb-4 mx-1 ${done ? "bg-moss/40" : "bg-border-warm"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Pionowy — do md */}
          <div className="flex flex-col gap-0 md:hidden">
            {TIMELINE.map((step, i) => {
              const done = true;
              const isLast = i === TIMELINE.length - 1;
              return (
                <div key={step.key} className="flex items-start gap-4">
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        done ? "bg-moss" : "bg-border-warm"
                      }`}
                    >
                      <Check size={11} strokeWidth={2.5} className="text-card-warm" />
                    </div>
                    {!isLast && (
                      <div
                        className={`w-px flex-1 min-h-[28px] mt-1 ${done ? "bg-moss/40" : "bg-border-warm"}`}
                      />
                    )}
                  </div>
                  <p className={`text-sm leading-body pb-5 ${done ? "text-ink-muted" : "text-ink-subtle"} ${isLast ? "pb-0" : ""}`}>
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Produkty */}
        <section className="mb-6">
          <div className="bg-card-warm rounded-card shadow-warm overflow-hidden">
            <div className="px-6 py-4 border-b border-border-warm">
              <p className="text-xs font-medium tracking-eyebrow uppercase text-ink-subtle">
                Zamówione produkty
              </p>
            </div>
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 px-6 py-5 border-b border-border-warm last:border-0"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="shrink-0 w-10 h-10 rounded-field bg-warm-island flex items-center justify-center">
                    <Package size={16} strokeWidth={1.5} className="text-ink-muted" />
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/products/${item.slug}`}
                      className="text-sm font-medium text-ink hover:text-terracotta underline-offset-2 hover:underline transition-colors cursor-pointer truncate block"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-ink-muted mt-0.5">
                      {item.variant} · szt. {item.qty}
                    </p>
                  </div>
                </div>
                <p className="shrink-0 text-sm font-medium text-ink font-tnum">
                  {item.price}
                </p>
              </div>
            ))}

            {/* Podsumowanie kosztów */}
            <div className="px-6 py-5 bg-warm-island/40 space-y-2.5">
              <div className="flex justify-between text-sm text-ink-muted">
                <span>Produkty</span>
                <span className="font-tnum">{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-ink-muted">
                <span>Dostawa ({order.shipping})</span>
                <span className="font-tnum">{order.shippingCost}</span>
              </div>
              {order.packagingPremium && (
                <div className="flex justify-between text-sm text-ink-muted">
                  <span>Opakowanie premium</span>
                  <span className="font-tnum">19,00 zł</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-medium text-ink pt-2 border-t border-border-warm">
                <span>Łącznie</span>
                <span className="font-tnum">{order.total}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Dostawa + płatność */}
        <section className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Adres */}
          <div className="bg-card-warm rounded-card shadow-warm p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={14} strokeWidth={1.5} className="text-ink-subtle" />
              <p className="text-xs font-medium tracking-eyebrow uppercase text-ink-subtle">
                Adres dostawy
              </p>
            </div>
            <p className="text-sm font-medium text-ink">{order.address.name}</p>
            <p className="text-sm text-ink-muted mt-0.5">{order.address.line1}</p>
            <p className="text-sm text-ink-muted">{order.address.city}</p>
            {order.address.point && (
              <p className="text-xs text-ink-subtle mt-2">{order.address.point}</p>
            )}
          </div>

          {/* Płatność */}
          <div className="bg-card-warm rounded-card shadow-warm p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={14} strokeWidth={1.5} className="text-ink-subtle" />
              <p className="text-xs font-medium tracking-eyebrow uppercase text-ink-subtle">
                Płatność
              </p>
            </div>
            <p className="text-sm font-medium text-ink">{order.paymentMethod}</p>
            <div className="flex items-center gap-1.5 mt-3">
              <ShieldCheck size={13} strokeWidth={1.5} className="text-moss" />
              <p className="text-xs text-ink-muted">Płatność zrealizowana</p>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Truck size={13} strokeWidth={1.5} className="text-ink-subtle" />
              <p className="text-xs text-ink-muted">{order.shipping}</p>
            </div>
          </div>
        </section>

        {/* Raport zdrowotny */}
        {order.hasHealthReport && (
          <section className="mb-6 bg-tech-island rounded-card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium tracking-eyebrow uppercase text-ink-subtle mb-1.5">
                  Raport zdrowotny
                </p>
                <p className="text-sm leading-body text-ink-muted">
                  Do tego zamówienia wygenerowaliśmy spersonalizowany raport zdrowotny
                  dla Zuzi z planem suplementacji.
                </p>
              </div>
              <Link
                href="/konto"
                className="shrink-0 inline-flex items-center gap-1.5 text-xs font-medium text-terracotta hover:text-terracotta-hover transition-colors mt-0.5"
              >
                <FileText size={13} strokeWidth={1.5} />
                Pobierz PDF
              </Link>
            </div>
          </section>
        )}

        {/* Akcje */}
        <div className="flex flex-wrap gap-3">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-button border border-border-warm px-6 py-3 text-sm font-medium text-ink hover:border-terracotta/40 transition-colors cursor-pointer"
          >
            <FileText size={14} strokeWidth={1.5} />
            Pobierz fakturę
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-button border border-border-warm px-6 py-3 text-sm font-medium text-ink hover:border-terracotta/40 transition-colors cursor-pointer"
          >
            Zgłoś zwrot
          </a>
        </div>

      </div>
    </main>
  );
}
