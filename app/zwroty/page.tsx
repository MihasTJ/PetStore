import type { Metadata } from "next"
import { RotateCcw, Mail, Package, ShieldCheck, Clock } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Zwroty i odstąpienie od umowy — Nobile Pet Care",
  description: "Zwrot towaru w ciągu 14 dni bez podawania przyczyn. Dowiedz się, jak złożyć zwrot w sklepie Nobile Pet Care.",
}

const STEPS = [
  {
    Icon: Mail,
    step: "01",
    title: "Poinformuj nas",
    body: "Wyślij e-mail na kontakt@nobilepetcare.pl z informacją o chęci zwrotu, numerem zamówienia i nazwą produktu. Nie musisz podawać przyczyny — prawo do zwrotu przysługuje Ci bezwarunkowo w ciągu 14 dni.",
  },
  {
    Icon: Package,
    step: "02",
    title: "Odeślij produkt",
    body: "Zapakuj produkt w oryginalne opakowanie (lub zabezpiecz podobnie). Wyślij w ciągu 14 dni od złożenia oświadczenia o zwrocie. Adres zwrotu podamy w e-mailu potwierdzającym przyjęcie zwrotu.",
  },
  {
    Icon: RotateCcw,
    step: "03",
    title: "Czekaj na zwrot pieniędzy",
    body: "Po otrzymaniu przesyłki zwrócimy płatność (wraz z kosztem najtańszej dostępnej metody dostawy) w ciągu 14 dni — na rachunek, z którego dokonano płatności.",
  },
]

export default function ZwrotyPage() {
  return (
    <main className="bg-canvas">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-editorial px-6 pt-20 pb-16 md:px-12 md:pt-32 md:pb-20">
        <p className="mb-8 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
          Dokumenty prawne
        </p>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <h1 className="font-serif font-normal leading-editorial text-ink text-5xl md:text-6xl">
              Zwroty
            </h1>
            <p className="mt-6 text-lg leading-body text-ink-muted max-w-lg">
              14 dni bez pytań. Jeśli pupil nie zaakceptuje produktu — zwracamy
              pełną kwotę. Bez komplikacji.
            </p>
          </div>
          <div className="md:col-span-4 md:col-start-9 md:flex md:items-end">
            <div className="flex items-start gap-3 rounded-card-sm border border-moss/20 bg-moss/5 px-5 py-4">
              <ShieldCheck size={18} className="shrink-0 mt-0.5 text-moss" strokeWidth={1.5} />
              <p className="text-sm leading-body text-ink-muted">
                Gwarancja zwrotu w ciągu <strong className="text-ink font-medium">14 dni</strong> — zgodnie z ustawą o prawach konsumenta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── JAK ZŁOŻYĆ ZWROT ─────────────────────────────────────────── */}
      <section className="bg-warm-island">
        <div className="mx-auto max-w-editorial px-6 py-16 md:px-12 md:py-20">
          <p className="mb-5 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
            Jak to działa
          </p>
          <h2 className="mb-12 font-serif font-normal leading-editorial text-ink text-3xl md:text-4xl">
            Trzy kroki do zwrotu.
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {STEPS.map(({ Icon, step, title, body }) => (
              <div key={step} className="bg-card-warm rounded-card-sm p-6 shadow-warm">
                <div className="mb-5 flex items-start justify-between">
                  <Icon size={20} className="text-terracotta" strokeWidth={1.5} />
                  <span className="font-tnum text-xs text-ink-subtle">{step}</span>
                </div>
                <p className="mb-3 text-base font-medium text-ink">{title}</p>
                <p className="text-sm leading-body text-ink-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SZCZEGÓŁY ────────────────────────────────────────────────── */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-editorial px-6 py-16 md:px-12 md:py-20">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">

            <div>
              <p className="mb-5 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
                Warunki zwrotu
              </p>
              <h2 className="mb-6 font-serif font-normal text-2xl text-ink leading-snug">
                Co musisz wiedzieć
              </h2>
              <ul className="flex flex-col gap-4">
                {[
                  "Zwrot przysługuje w ciągu **14 dni** od daty otrzymania przesyłki.",
                  "Produkt powinien być w stanie nienaruszonym, kompletny, najlepiej w oryginalnym opakowaniu.",
                  "Koszt odesłania produktu do nas pokrywa Klient (chyba że produkt był uszkodzony lub niezgodny z zamówieniem — wtedy koszty pokrywamy my).",
                  "Zwrot płatności nastąpi w ciągu 14 dni od otrzymania przesyłki zwrotnej, na rachunek bankowy użyty do płatności.",
                  "Zwracamy koszt zamówienia **wraz z najtańszym dostępnym kosztem dostawy**.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-terracotta/60" />
                    <p className="text-sm leading-body text-ink-muted">
                      {item.split(/\*\*(.+?)\*\*/g).map((part, j) =>
                        j % 2 === 1 ? <strong key={j} className="font-medium text-ink">{part}</strong> : part
                      )}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-5 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
                Wyjątki
              </p>
              <h2 className="mb-6 font-serif font-normal text-2xl text-ink leading-snug">
                Kiedy zwrot nie przysługuje
              </h2>
              <ul className="flex flex-col gap-4">
                {[
                  "Produkty szybko psujące się lub mające krótki termin przydatności do spożycia.",
                  "Produkty w zapieczętowanym opakowaniu, które po otwarciu nie mogą być zwrócone ze względów higienicznych — jeśli opakowanie zostało naruszone.",
                  "Produkty wykonane na specjalne zamówienie (np. personalizowane).",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-ink-subtle" />
                    <p className="text-sm leading-body text-ink-muted">{item}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-10 rounded-card-sm border border-border-warm bg-card-warm p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={14} className="text-ink-muted shrink-0" strokeWidth={1.5} />
                  <p className="text-xs font-medium text-ink">Czas realizacji zwrotu</p>
                </div>
                <p className="text-sm leading-body text-ink-muted">
                  Po otrzymaniu przesyłki zwrotnej zwracamy pieniądze w ciągu <strong className="text-ink font-medium">14 dni roboczych</strong>.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="bg-warm-island">
        <div className="mx-auto max-w-editorial px-6 py-16 md:px-12 md:py-20 flex flex-col items-center text-center">
          <p className="mb-4 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
            Masz pytania?
          </p>
          <h2 className="mb-6 font-serif font-normal text-2xl md:text-3xl text-ink leading-editorial">
            Napisz do nas.
          </h2>
          <p className="mb-8 max-w-md text-sm leading-body text-ink-muted">
            Jeśli masz pytania dotyczące zwrotu lub nie wiesz jak postąpić — odpisujemy
            zazwyczaj tego samego dnia roboczego.
          </p>
          <a
            href="mailto:kontakt@nobilepetcare.pl"
            className="inline-flex items-center gap-2.5 rounded-button bg-terracotta px-8 py-4 text-base font-medium text-card-warm transition-colors hover:bg-terracotta-hover"
          >
            <Mail size={16} strokeWidth={1.5} />
            kontakt@nobilepetcare.pl
          </a>
          <p className="mt-6 text-xs text-ink-subtle">
            Szczegółowe zasady odstąpienia od umowy zawiera{" "}
            <Link href="/regulamin#odstapienie" className="underline underline-offset-4 hover:text-ink transition-colors">
              §6 Regulaminu
            </Link>.
          </p>
        </div>
      </section>

    </main>
  )
}
