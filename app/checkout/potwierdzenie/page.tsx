import { ShieldCheck, Mail, Package, Truck, ArrowRight, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { PendingPoller } from "./pending-poller";

function fmt(n: number) {
  return n.toFixed(2).replace(".", ",") + " zł";
}

export default async function PotwierdzeniePage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>;
}) {
  const { order_id } = await searchParams;
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  let orderNumber: string | null = null;
  let orderTotal: number | null = null;
  let customerEmail: string | null = null;
  let paymentStatus: string | null = null;
  let petName: string | null = null;

  if (order_id) {
    const { data: rows } = await supabase.rpc("get_order_for_confirmation", {
      p_order_id: order_id,
    });

    const order = rows?.[0] ?? null;
    if (order) {
      orderNumber = order.id.slice(0, 8).toUpperCase();
      orderTotal = order.total_amount;
      paymentStatus = order.payment_status;
      petName = (order.pet_name as string | null) ?? null;
      const addr = order.shipping_address as Record<string, string> | null;
      customerEmail = addr?.email ?? null;
    }
  }

  if (paymentStatus === "failed") {
    return (
      <main className="bg-canvas">
        <div className="mx-auto max-w-editorial px-6 pt-28 pb-24 md:px-12 md:pt-36 md:pb-32">
          <div className="mb-10 w-14 h-14 rounded-card bg-terracotta/10 flex items-center justify-center">
            <XCircle size={26} className="text-terracotta" strokeWidth={1.5} />
          </div>
          <p className="mb-4 text-xs font-medium tracking-eyebrow uppercase text-terracotta">
            Płatność nieudana
          </p>
          <h1 className="font-serif font-normal text-4xl md:text-[3rem] text-ink leading-editorial mb-6 max-w-lg">
            Coś poszło nie tak z płatnością.
          </h1>
          <p className="text-base leading-body text-ink-muted max-w-md mb-12">
            {orderNumber
              ? `Zamówienie #${orderNumber} zostało anulowane — płatność została odrzucona lub przerwana.`
              : "Płatność została odrzucona lub przerwana."}{" "}
            Możesz spróbować ponownie — produkty wciąż na Ciebie czekają.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/koszyk"
              className="inline-flex items-center justify-center gap-2 rounded-button bg-terracotta px-8 py-4 text-base font-medium text-card-warm hover:bg-terracotta-hover transition-colors cursor-pointer"
            >
              Wróć do koszyka
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/produkty"
              className="inline-flex items-center justify-center gap-2 rounded-button border border-border-warm px-8 py-4 text-base font-medium text-ink hover:border-terracotta/50 transition-colors cursor-pointer"
            >
              Przeglądaj produkty
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (paymentStatus === "pending") {
    return (
      <main className="bg-canvas">
        <div className="mx-auto max-w-editorial px-6 pt-28 pb-24 md:px-12 md:pt-36 md:pb-32">
          <div className="mb-10 w-14 h-14 rounded-card bg-warm-island flex items-center justify-center">
            <Clock size={26} className="text-ink-muted" strokeWidth={1.5} />
          </div>
          <p className="mb-4 text-xs font-medium tracking-eyebrow uppercase text-ink-muted">
            Oczekiwanie na potwierdzenie
          </p>
          <h1 className="font-serif font-normal text-4xl md:text-[3rem] text-ink leading-editorial mb-6 max-w-lg">
            Potwierdzamy Twoją płatność.
          </h1>
          <p className="text-base leading-body text-ink-muted max-w-md mb-12">
            {orderNumber
              ? `Zamówienie #${orderNumber} czeka na potwierdzenie od banku.`
              : "Zamówienie czeka na potwierdzenie od banku."}{" "}
            Wyślemy Ci e-mail, gdy płatność zostanie zaksięgowana. Zwykle trwa to kilka minut.
          </p>
          <Link
            href="/produkty"
            className="inline-flex items-center justify-center gap-2 rounded-button border border-border-warm px-8 py-4 text-base font-medium text-ink hover:border-terracotta/50 transition-colors cursor-pointer"
          >
            Wróć do sklepu
          </Link>
        </div>
        <PendingPoller orderId={order_id ?? ""} />
      </main>
    );
  }

  // paid (or unknown — show success as fallback)
  return (
    <main className="bg-canvas">
      <div className="mx-auto max-w-editorial px-6 pt-28 pb-24 md:px-12 md:pt-36 md:pb-32">

        <div className="mb-10 w-14 h-14 rounded-card bg-warm-island flex items-center justify-center">
          <ShieldCheck size={26} className="text-moss" strokeWidth={1.5} />
        </div>

        <p className="mb-4 text-xs font-medium tracking-eyebrow uppercase text-terracotta">
          Zamówienie przyjęte
        </p>
        <h1 className="font-serif font-normal text-4xl md:text-[3rem] text-ink leading-editorial mb-6 max-w-lg">
          Doskonały wybór dla {petName ?? "Twojego pupila"}.
        </h1>
        <p className="text-base leading-body text-ink-muted max-w-md mb-12">
          Potwierdzenie zamówienia{customerEmail ? ` wyślemy na ${customerEmail}` : " wyślemy na Twój adres e-mail"}{" "}
          w ciągu kilku minut. Raport zdrowotny czeka jutro rano.
        </p>

        <div className="bg-card-warm rounded-card shadow-warm p-7 md:p-10 max-w-lg mb-10">
          <div className="space-y-6">

            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-field bg-warm-island flex items-center justify-center">
                <Package size={18} className="text-ink-muted" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs font-medium tracking-eyebrow uppercase text-ink-subtle mb-1">
                  Numer zamówienia
                </p>
                <p className="text-base font-medium text-ink font-tnum">
                  {orderNumber ?? "—"}
                </p>
                {orderTotal !== null && (
                  <p className="text-xs text-ink-muted mt-0.5">
                    Kwota: {fmt(orderTotal)}
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-border-warm" />

            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-field bg-warm-island flex items-center justify-center">
                <Truck size={18} className="text-ink-muted" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs font-medium tracking-eyebrow uppercase text-ink-subtle mb-1">
                  Dostawa
                </p>
                <p className="text-base font-medium text-ink">Paczka w drodze do Ciebie</p>
                <p className="text-xs text-ink-muted mt-0.5">
                  Powiadomimy Cię, gdy dotrze do paczkomatu lub kuriera.
                </p>
              </div>
            </div>

            <div className="border-t border-border-warm" />

            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-field bg-warm-island flex items-center justify-center">
                <Mail size={18} className="text-ink-muted" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs font-medium tracking-eyebrow uppercase text-ink-subtle mb-1">
                  Raport zdrowotny
                </p>
                <p className="text-base font-medium text-ink">Jutro rano na Twoją skrzynkę</p>
                <p className="text-xs text-ink-muted mt-0.5">
                  Szczegółowy plan suplementacji i wskazówki zdrowotne na najbliższe miesiące.
                </p>
              </div>
            </div>

          </div>
        </div>

        <p className="text-sm leading-body text-ink-muted mb-12 max-w-md">
          Pamiętaj — masz 30 dni na zwrot bez żadnych pytań.
          Jeśli pupil nie zaakceptuje produktu, zwracamy pełną kwotę.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/konto/rejestracja"
            className="inline-flex items-center justify-center gap-2 rounded-button bg-terracotta px-8 py-4 text-base font-medium text-card-warm hover:bg-terracotta-hover transition-colors cursor-pointer"
          >
            Utwórz profil pupila
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/produkty"
            className="inline-flex items-center justify-center gap-2 rounded-button border border-border-warm px-8 py-4 text-base font-medium text-ink hover:border-terracotta/50 transition-colors cursor-pointer"
          >
            Wróć do sklepu
          </Link>
        </div>

        <p className="mt-4 text-xs leading-body text-ink-subtle max-w-sm">
          Profil pupila pozwala przechowywać raport zdrowotny i otrzymywać
          spersonalizowane przypomnienia o suplementacji.
        </p>

      </div>
    </main>
  );
}
