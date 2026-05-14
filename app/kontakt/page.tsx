import type { Metadata } from "next"
import { Mail, Clock, RotateCcw, AlertTriangle, ArrowRight } from "lucide-react"
import { ContactForm } from "./contact-form"

export const metadata: Metadata = {
  title: "Kontakt — Nobile Pet Care",
  description:
    "Napisz do nas w sprawie produktu, zamówienia lub dobrostanu swojego pupila. Odpowiadamy w ciągu jednego dnia roboczego.",
}

const CONTACT_LINKS = [
  {
    Icon: RotateCcw,
    title: "Zwrot towaru",
    body: "Pupil nie polubił produktu? Zwrot bez pytań w ciągu 14 dni.",
    href: "/zwroty",
    cta: "Złóż wniosek o zwrot",
  },
  {
    Icon: AlertTriangle,
    title: "Reklamacja",
    body: "Produkt uszkodzony lub niezgodny z opisem? Rozpatrzymy w 14 dni.",
    href: "/reklamacje",
    cta: "Złóż reklamację",
  },
]

export default function KontaktPage() {
  return (
    <main className="bg-canvas">

      {/* ── 1. HERO ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-editorial px-6 pt-20 pb-12 md:px-12 md:pt-32 md:pb-16">
        <p className="mb-8 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
          Kontakt
        </p>
        <h1 className="font-serif font-normal leading-editorial text-ink text-5xl md:text-6xl">
          Napisz do nas.
        </h1>
        <p className="mt-6 max-w-lg text-base leading-body text-ink-muted">
          Masz pytanie o produkt, zamówienie lub dobrostan pupila?
          Jesteśmy tu, żeby pomóc — bez formularzy z 12 polami i bez czekania w kolejce.
        </p>
      </section>

      {/* ── 2. FORMULARZ + DANE KONTAKTOWE ────────────────────────────── */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-editorial px-6 pb-20 md:px-12 md:pb-28">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-12">

            {/* Formularz */}
            <div className="md:col-span-7">
              <p className="mb-6 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
                Formularz
              </p>
              <ContactForm />
            </div>

            {/* Sidebar z danymi */}
            <aside className="md:col-span-4 md:col-start-9 flex flex-col gap-8">

              <div>
                <p className="mb-6 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
                  Dane kontaktowe
                </p>

                <div className="flex flex-col gap-5">
                  <a
                    href="mailto:kontakt@nobilepetcare.pl"
                    className="group flex items-start gap-3"
                  >
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-tag border border-border-warm bg-card-warm">
                      <Mail size={14} className="text-ink-muted" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-xs text-ink-subtle mb-0.5">E-mail</p>
                      <p className="text-sm font-medium text-ink group-hover:text-terracotta transition-colors">
                        kontakt@nobilepetcare.pl
                      </p>
                    </div>
                  </a>

                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-tag border border-border-warm bg-card-warm">
                      <Clock size={14} className="text-ink-muted" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-xs text-ink-subtle mb-0.5">Godziny odpowiedzi</p>
                      <p className="text-sm font-medium text-ink">Pon – Pt, 9:00–17:00</p>
                      <p className="text-xs text-ink-subtle mt-0.5">Odpowiadamy w ciągu 24h w dni robocze</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Separator */}
              <div className="h-px bg-border-warm" />

              {/* Szybkie linki */}
              <div>
                <p className="mb-5 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
                  Najczęstsze sprawy
                </p>
                <div className="flex flex-col gap-3">
                  {CONTACT_LINKS.map(({ Icon, title, body, href, cta }) => (
                    <a
                      key={href}
                      href={href}
                      className="group flex flex-col gap-2 rounded-card-sm border border-border-warm bg-card-warm p-5 shadow-warm transition-shadow hover:shadow-warm-md"
                    >
                      <div className="flex items-center gap-2">
                        <Icon size={14} className="text-ink-muted shrink-0" strokeWidth={1.5} />
                        <span className="text-sm font-medium text-ink">{title}</span>
                      </div>
                      <p className="text-xs leading-body text-ink-muted">{body}</p>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-terracotta mt-1">
                        {cta}
                        <ArrowRight size={11} strokeWidth={1.5} />
                      </span>
                    </a>
                  ))}
                </div>
              </div>

            </aside>

          </div>
        </div>
      </section>

      {/* ── 3. SEKCJA TRUST ───────────────────────────────────────────── */}
      <section className="bg-warm-island">
        <div className="mx-auto max-w-editorial px-6 py-14 md:px-12 md:py-16">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">

            <div>
              <p className="mb-2 text-sm font-medium text-ink">Odpowiadamy w 24h</p>
              <p className="text-sm leading-body text-ink-muted">
                W dni robocze. Weekendowe wiadomości odbierzemy w poniedziałek rano.
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-ink">Zwrot bez pytań</p>
              <p className="text-sm leading-body text-ink-muted">
                Jeśli pupil nie polubił produktu — zwracamy pieniądze. 14 dni, bez uzasadnienia.
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-ink">Piszemy po ludzku</p>
              <p className="text-sm leading-body text-ink-muted">
                Bez automatycznych odpowiedzi z numerem zgłoszenia. Czytamy każdą wiadomość.
              </p>
            </div>

          </div>
        </div>
      </section>

    </main>
  )
}
