import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  ShieldCheck,
  CreditCard,
  Check,
  Clock,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

function fmt(n: number) {
  return n.toFixed(2).replace(".", ",") + " zł";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const STATUS_LABELS: Record<string, string> = {
  pending:    "Oczekuje na płatność",
  paid:       "Opłacono",
  processing: "W realizacji",
  shipped:    "Wysłano",
  delivered:  "Dostarczono",
  cancelled:  "Anulowano",
  refunded:   "Zwrócono",
};

const SHIPPING_LABELS: Record<string, string> = {
  inpost: "InPost Paczkomat 24h",
  dpd:    "Kurier DPD",
};

type TimelineStep = { label: string; key: string };
const TIMELINE: TimelineStep[] = [
  { label: "Zamówienie przyjęte", key: "placed" },
  { label: "Płatność potwierdzona", key: "paid" },
  { label: "Przekazano do wysyłki", key: "shipped" },
  { label: "Dostarczono", key: "delivered" },
];

function timelineIndex(status: string): number {
  switch (status) {
    case "pending":    return 0;
    case "paid":       return 1;
    case "processing": return 1;
    case "shipped":    return 2;
    case "delivered":  return 3;
    default:           return 0;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return { title: `Zamówienie #${id.slice(0, 8).toUpperCase()} — Nobile` };
}

export default async function ZamowieniePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/konto/logowanie");

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*, products(slug, name_seo))")
    .eq("id", id)
    .eq("customer_id", user.id)
    .single();

  if (!order) notFound();

  const addr = order.shipping_address as Record<string, string> | null;
  const orderNumber = order.id.slice(0, 8).toUpperCase();
  const doneIndex = timelineIndex(order.status);

  type OrderItem = {
    id: string;
    quantity: number;
    price_at_purchase: number;
    product_snapshot: { name?: string; price?: number } | null;
    products: { slug: string; name_seo: string } | null;
  };
  const items = (order.order_items ?? []) as OrderItem[];

  const subtotal = items.reduce(
    (sum, i) => sum + i.price_at_purchase * i.quantity,
    0
  );

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
            Zamówienie #{orderNumber}
          </p>
          <h1 className="font-serif font-normal text-4xl md:text-[2.75rem] text-ink leading-editorial mb-3">
            Doskonały wybór dla Twojego pupila.
          </h1>
          <p className="text-base leading-body text-ink-muted">
            Zamówione {formatDate(order.created_at)}
          </p>
        </div>

        {/* Timeline — poziomy md+ */}
        <div className="mb-10">
          <div className="hidden md:flex items-center gap-0">
            {TIMELINE.map((step, i) => {
              const done = i <= doneIndex;
              const isLast = i === TIMELINE.length - 1;
              return (
                <div key={step.key} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        done ? "bg-moss" : "bg-border-warm"
                      }`}
                    >
                      {done ? (
                        <Check size={11} strokeWidth={2.5} className="text-card-warm" />
                      ) : (
                        <Clock size={11} strokeWidth={2} className="text-ink-subtle" />
                      )}
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
              const done = i <= doneIndex;
              const isLast = i === TIMELINE.length - 1;
              return (
                <div key={step.key} className="flex items-start gap-4">
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        done ? "bg-moss" : "bg-border-warm"
                      }`}
                    >
                      {done ? (
                        <Check size={11} strokeWidth={2.5} className="text-card-warm" />
                      ) : (
                        <Clock size={11} strokeWidth={2} className="text-ink-subtle" />
                      )}
                    </div>
                    {!isLast && (
                      <div
                        className={`w-px flex-1 min-h-[28px] mt-1 ${done ? "bg-moss/40" : "bg-border-warm"}`}
                      />
                    )}
                  </div>
                  <p
                    className={`text-sm leading-body pb-5 ${
                      done ? "text-ink-muted" : "text-ink-subtle"
                    } ${isLast ? "pb-0" : ""}`}
                  >
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

            {items.map((item) => {
              const name =
                (item.product_snapshot?.name) ??
                item.products?.name_seo ??
                "Produkt";
              const slug = item.products?.slug;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 px-6 py-5 border-b border-border-warm last:border-0"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="shrink-0 w-10 h-10 rounded-field bg-warm-island flex items-center justify-center">
                      <Package size={16} strokeWidth={1.5} className="text-ink-muted" />
                    </div>
                    <div className="min-w-0">
                      {slug ? (
                        <Link
                          href={`/products/${slug}`}
                          className="text-sm font-medium text-ink hover:text-terracotta underline-offset-2 hover:underline transition-colors truncate block"
                        >
                          {name}
                        </Link>
                      ) : (
                        <p className="text-sm font-medium text-ink truncate">{name}</p>
                      )}
                      <p className="text-xs text-ink-muted mt-0.5">
                        szt. {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="shrink-0 text-sm font-medium text-ink font-tnum">
                    {fmt(item.price_at_purchase * item.quantity)}
                  </p>
                </div>
              );
            })}

            {/* Podsumowanie kosztów */}
            <div className="px-6 py-5 bg-warm-island/40 space-y-2.5">
              <div className="flex justify-between text-sm text-ink-muted">
                <span>Produkty</span>
                <span className="font-tnum">{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-ink-muted">
                <span>
                  Dostawa ({SHIPPING_LABELS[order.shipping_method] ?? order.shipping_method})
                </span>
                <span className="font-tnum">{fmt(order.shipping_cost)}</span>
              </div>
              {order.premium_packaging && (
                <div className="flex justify-between text-sm text-ink-muted">
                  <span>Opakowanie premium</span>
                  <span className="font-tnum">19,00 zł</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-medium text-ink pt-2 border-t border-border-warm">
                <span>Łącznie</span>
                <span className="font-tnum">{fmt(order.total_amount)}</span>
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
            {addr ? (
              <>
                <p className="text-sm font-medium text-ink">
                  {[addr.first_name, addr.last_name].filter(Boolean).join(" ")}
                </p>
                <p className="text-sm text-ink-muted mt-0.5">
                  {addr.street}{addr.apt ? ` / ${addr.apt}` : ""}
                </p>
                <p className="text-sm text-ink-muted">
                  {addr.postal_code} {addr.city}
                </p>
              </>
            ) : (
              <p className="text-sm text-ink-muted">Brak danych adresowych</p>
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
            <p className="text-sm font-medium text-ink">
              {STATUS_LABELS[order.payment_status] ?? order.payment_status}
            </p>
            <div className="flex items-center gap-1.5 mt-3">
              <ShieldCheck size={13} strokeWidth={1.5} className="text-moss" />
              <p className="text-xs text-ink-muted">
                {order.payment_status === "paid" ? "Płatność zrealizowana" : "Oczekuje na potwierdzenie"}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Truck size={13} strokeWidth={1.5} className="text-ink-subtle" />
              <p className="text-xs text-ink-muted">
                {SHIPPING_LABELS[order.shipping_method] ?? order.shipping_method}
              </p>
            </div>
          </div>
        </section>

        {/* Akcje */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/konto"
            className="inline-flex items-center gap-2 rounded-button border border-border-warm px-6 py-3 text-sm font-medium text-ink hover:border-terracotta/40 transition-colors"
          >
            Wróć do konta
          </Link>
          <Link
            href="/produkty"
            className="inline-flex items-center gap-2 rounded-button border border-border-warm px-6 py-3 text-sm font-medium text-ink hover:border-terracotta/40 transition-colors"
          >
            Przeglądaj produkty
          </Link>
        </div>

      </div>
    </main>
  );
}
