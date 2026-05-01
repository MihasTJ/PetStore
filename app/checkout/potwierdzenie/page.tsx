import { ShieldCheck, Mail, Package, Truck, ArrowRight } from "lucide-react";
import Link from "next/link";

// Docelowo: numer zamówienia i dane z Supabase przez searchParams lub cookies sesji
const ORDER_NUMBER = "NB-2847";
const ESTIMATED_DELIVERY = "piątek, 3 maja";

export default function PotwierdzeniePage() {
  return (
    <main className="bg-canvas">
      <div className="mx-auto max-w-editorial px-6 pt-28 pb-24 md:px-12 md:pt-36 md:pb-32">

        {/* Ikona sukcesu */}
        <div className="mb-10 w-14 h-14 rounded-card bg-warm-island flex items-center justify-center">
          <ShieldCheck size={26} className="text-moss" strokeWidth={1.5} />
        </div>

        {/* Nagłówek emocjonalny */}
        <p className="mb-4 text-xs font-medium tracking-eyebrow uppercase text-terracotta">
          Zamówienie przyjęte
        </p>
        <h1 className="font-serif font-normal text-4xl md:text-[3rem] text-ink leading-editorial mb-6 max-w-lg">
          Doskonały wybór dla Twojego pupila.
        </h1>
        <p className="text-base leading-body text-ink-muted max-w-md mb-12">
          Potwierdzenie zamówienia i raport zdrowotny wyślemy na Twój adres e-mail
          w ciągu kilku minut.
        </p>

        {/* Karta z detalami */}
        <div className="bg-card-warm rounded-card shadow-warm p-7 md:p-10 max-w-lg mb-10">
          <div className="space-y-6">

            {/* Numer zamówienia */}
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-field bg-warm-island flex items-center justify-center">
                <Package size={18} className="text-ink-muted" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs font-medium tracking-eyebrow uppercase text-ink-subtle mb-1">
                  Numer zamówienia
                </p>
                <p className="text-base font-medium text-ink font-tnum">{ORDER_NUMBER}</p>
              </div>
            </div>

            <div className="border-t border-border-warm" />

            {/* Przewidywana dostawa */}
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-field bg-warm-island flex items-center justify-center">
                <Truck size={18} className="text-ink-muted" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs font-medium tracking-eyebrow uppercase text-ink-subtle mb-1">
                  Przewidywana dostawa
                </p>
                <p className="text-base font-medium text-ink">Paczka w drodze — {ESTIMATED_DELIVERY}</p>
                <p className="text-xs text-ink-muted mt-0.5">
                  Powiadomimy Cię SMS-em, gdy dotrze do paczkomatu.
                </p>
              </div>
            </div>

            <div className="border-t border-border-warm" />

            {/* E-mail z raportem */}
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-field bg-warm-island flex items-center justify-center">
                <Mail size={18} className="text-ink-muted" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs font-medium tracking-eyebrow uppercase text-ink-subtle mb-1">
                  Raport zdrowotny
                </p>
                <p className="text-base font-medium text-ink">Raport zdrowotny — jutro rano</p>
                <p className="text-xs text-ink-muted mt-0.5">
                  Szczegółowy plan suplementacji i wskazówki zdrowotne na najbliższe miesiące.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Trust — gwarancja */}
        <p className="text-sm leading-body text-ink-muted mb-12 max-w-md">
          Pamiętaj — masz 30 dni na zwrot bez żadnych pytań.
          Jeśli pupil nie zaakceptuje produktu, zwracamy pełną kwotę.
        </p>

        {/* CTA */}
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

        {/* Kontekst CTA */}
        <p className="mt-4 text-xs leading-body text-ink-subtle max-w-sm">
          Profil pupila pozwala przechowywać raport zdrowotny i otrzymywać
          spersonalizowane przypomnienia o suplementacji.
        </p>

      </div>
    </main>
  );
}
