import type { Metadata } from "next"
import { Mail, ClipboardList, Clock, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Reklamacje — Nobile Pet Care",
  description: "Jak złożyć reklamację w sklepie Nobile Pet Care. Odpowiadamy w ciągu 14 dni.",
}

const STEPS = [
  {
    Icon: Mail,
    step: "01",
    title: "Wyślij zgłoszenie",
    body: `Napisz na kontakt@nobilepetcare.pl z tytułem „Reklamacja". Podaj numer zamówienia, nazwę produktu, opis wady oraz preferowany sposób rozpatrzenia (wymiana, naprawa, obniżenie ceny lub zwrot pieniędzy).`,
  },
  {
    Icon: ClipboardList,
    step: "02",
    title: "Rozpatrzenie w 14 dniach",
    body: "Mamy 14 dni na ustosunkowanie się do Twojej reklamacji. Brak odpowiedzi w tym terminie oznacza automatyczne uznanie reklamacji za zasadną. Poinformujemy Cię o decyzji e-mailem.",
  },
  {
    Icon: CheckCircle2,
    step: "03",
    title: "Realizacja decyzji",
    body: "Po pozytywnym rozpatrzeniu reklamacji wymienimy produkt, obniżymy cenę lub zwrócimy pieniądze — w zależności od Twojego żądania i możliwości. Koszty odesłania wadliwego towaru pokrywamy my.",
  },
]

export default function ReklamacjePage() {
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
              Reklamacje
            </h1>
            <p className="mt-6 text-lg leading-body text-ink-muted max-w-lg">
              Jeśli otrzymany produkt jest wadliwy lub niezgodny z zamówieniem —
              masz pełne prawo do reklamacji. Odpowiadamy w ciągu 14 dni.
            </p>
          </div>
          <div className="md:col-span-4 md:col-start-9 md:flex md:items-end">
            <div className="flex items-start gap-3 rounded-card-sm border border-moss/20 bg-moss/5 px-5 py-4">
              <Clock size={18} className="shrink-0 mt-0.5 text-moss" strokeWidth={1.5} />
              <p className="text-sm leading-body text-ink-muted">
                Odpowiedź na reklamację w ciągu <strong className="text-ink font-medium">14 dni</strong> — wymagane przepisami prawa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── JAK ZŁOŻYĆ ───────────────────────────────────────────────── */}
      <section className="bg-warm-island">
        <div className="mx-auto max-w-editorial px-6 py-16 md:px-12 md:py-20">
          <p className="mb-5 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
            Proces
          </p>
          <h2 className="mb-12 font-serif font-normal leading-editorial text-ink text-3xl md:text-4xl">
            Jak złożyć reklamację.
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
                Podstawa prawna
              </p>
              <h2 className="mb-6 font-serif font-normal text-2xl text-ink leading-snug">
                Twoje prawa z tytułu rękojmi
              </h2>
              <ul className="flex flex-col gap-4">
                {[
                  "Sprzedawca odpowiada za wady fizyczne i prawne produktu przez **2 lata** od dnia jego wydania Konsumentowi.",
                  "Jeśli wada zostanie stwierdzona w ciągu **roku** od odbioru, domniemywa się, że istniała w chwili wydania.",
                  "Możesz żądać: naprawy produktu, wymiany na nowy, obniżenia ceny lub — przy istotnej wadzie — odstąpienia od umowy.",
                  "Koszty dostarczenia wadliwego produktu do Sprzedawcy pokrywa Sprzedawca.",
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
                Co warto podać w zgłoszeniu
              </p>
              <h2 className="mb-6 font-serif font-normal text-2xl text-ink leading-snug">
                Dane do zgłoszenia reklamacji
              </h2>
              <ul className="flex flex-col gap-4">
                {[
                  "Numer zamówienia (znajdziesz go w e-mailu potwierdzającym zakup).",
                  "Nazwa reklamowanego produktu.",
                  "Opis wady — kiedy ją zauważyłeś i jak się objawia.",
                  "Zdjęcia dokumentujące wadę (jeśli dotyczy).",
                  "Preferowany sposób rozpatrzenia: wymiana, obniżenie ceny lub zwrot pieniędzy.",
                  "Dane kontaktowe (imię, nazwisko, adres e-mail).",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="shrink-0 font-tnum text-[11px] text-ink-subtle mt-0.5 w-4 text-right">
                      {i + 1}.
                    </span>
                    <p className="text-sm leading-body text-ink-muted">{item}</p>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ── POZASĄDOWE ───────────────────────────────────────────────── */}
      <section className="bg-warm-island">
        <div className="mx-auto max-w-editorial px-6 py-12 md:px-12 md:py-16">
          <div className="rounded-card-sm border border-border-warm bg-card-warm p-6 md:p-8">
            <p className="mb-3 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
              Pozasądowe rozwiązywanie sporów
            </p>
            <p className="text-sm leading-body text-ink-muted max-w-2xl">
              Konsument może skorzystać z pozasądowych sposobów rozpatrywania reklamacji
              i dochodzenia roszczeń, m.in. za pośrednictwem platformy ODR Komisji Europejskiej:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-terracotta underline underline-offset-4 hover:text-terracotta-hover transition-colors"
              >
                ec.europa.eu/consumers/odr
              </a>
              . Udział w postępowaniu mediacyjnym jest dobrowolny.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-editorial px-6 py-16 md:px-12 md:py-20 flex flex-col items-center text-center">
          <p className="mb-4 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
            Złóż reklamację
          </p>
          <h2 className="mb-6 font-serif font-normal text-2xl md:text-3xl text-ink leading-editorial">
            Napisz do nas.
          </h2>
          <p className="mb-8 max-w-md text-sm leading-body text-ink-muted">
            Wyślij e-mail z tytułem „Reklamacja" — odpowiemy najszybciej jak to możliwe,
            nie później niż w ciągu 14 dni.
          </p>
          <a
            href="mailto:kontakt@nobilepetcare.pl?subject=Reklamacja"
            className="inline-flex items-center gap-2.5 rounded-button bg-terracotta px-8 py-4 text-base font-medium text-card-warm transition-colors hover:bg-terracotta-hover"
          >
            <Mail size={16} strokeWidth={1.5} />
            kontakt@nobilepetcare.pl
          </a>
          <p className="mt-6 text-xs text-ink-subtle">
            Szczegółowe zasady reklamacji zawiera{" "}
            <Link href="/regulamin#reklamacje-short" className="underline underline-offset-4 hover:text-ink transition-colors">
              §7 Regulaminu
            </Link>.
          </p>
        </div>
      </section>

    </main>
  )
}
