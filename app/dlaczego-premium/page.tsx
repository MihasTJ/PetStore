import type { Metadata } from "next"
import { ShieldCheck, Search, AlertTriangle, HeartPulse, Leaf, BadgeCheck, ArrowRight } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Dlaczego Premium? — Nobile Pet Care",
  description:
    "Czym różni się karma premium od supermarketowej? Jak czytać skład? Dlaczego prewencja jest tańsza niż leczenie — i jak to sprawdzić samodzielnie.",
}

const MYTH_BUSTERS = [
  {
    myth: 'Premium to tylko droższe opakowanie.',
    truth:
      'W karmach ekonomicznych głównym składnikiem białkowym jest często mąka mięsno-kostna — odpad przemysłowy z niezidentyfikowanych zwierząt. W premium: nazwane mięso (np. kurczak z chowu wolnowybiegowego) jako pierwszy składnik na liście.',
  },
  {
    myth: 'Mój pies je to od lat i nic mu nie jest.',
    truth:
      'Skutki wadliwej diety w 70% przypadków ujawniają się po 4–7 latach — problemy stawowe, choroby nerek, alergie skórne. Twój pupil może się dobrze czuć dziś, ale jeść coś, co odbiera mu lata sprawności.',
  },
  {
    myth: 'Weterynarze polecają karmy z supermarketu.',
    truth:
      'Większość polecanych karm pochodzi od producentów, którzy sponsorują kształcenie weterynaryjne. Niezależne analizy składów często pokazują zupełnie inny obraz. Wiedz, co dajesz — zamiast ufać etykiecie.',
  },
]

const INGREDIENTS_EXPLAINED = [
  {
    bad: "Mączka mięsno-kostna",
    good: "Kurczak z chowu wolnowybiegowego",
    why: "Mączka to odpad po przetwórstwie — kości, pióra, nieidentyfikowane tkanki. Nazwane mięso to konkretny, identyfikowalny surowiec o stałej jakości.",
  },
  {
    bad: "Celuloza drzewna",
    good: "Pektyna jabłkowa / błonnik z buraków",
    why: "Celuloza drzewna to wypełniacz bez wartości odżywczych, używany do zwiększenia objętości produktu. Naturalne źródła błonnika wspierają trawienie.",
  },
  {
    bad: "BHA / BHT / Etoksychina",
    good: "Mieszanina tokoferoli (wit. E)",
    why: "Syntetyczne antyoksydanty przedłużają termin ważności, ale są powiązane z zaburzeniami hormonalnymi. Tokoferole to naturalne witaminy — działają tak samo, nie szkodzą.",
  },
  {
    bad: "Aromat drobiowy (nieokreślony)",
    good: "Hydrolizat mięsa z kurczaka",
    why: 'Aromat to chemiczne odtworzenie smaku — często maskuje niską jakość składników. Hydrolizat to prawdziwy wyciąg mięsny z wartością odżywczą.',
  },
]

const WHY_PREVENTION = [
  {
    Icon: HeartPulse,
    age: "1–3 rok życia",
    title: "Fundament",
    body: "Odpowiednia dieta w tym okresie decyduje o gęstości kości, sile mięśni i kondycji układu odpornościowego na całe życie. Błędów z tego okresu nie da się cofnąć.",
  },
  {
    Icon: ShieldCheck,
    age: "4–6 rok życia",
    title: "Prewencja stawów",
    body: "To moment, w którym suplementacja glukozaminą i MSM zaczyna mieć największy sens — zanim pojawią się pierwsze objawy. Po ich wystąpieniu suplementy spowalniają degradację, ale nie cofają szkód.",
  },
  {
    Icon: Leaf,
    age: "7+ rok życia",
    title: "Senior care",
    body: 'Starszy pies lub kot potrzebuje innej proporcji białka, tłuszczu i mikroelementów. Karma dla dorosłych to za mało — senior wymaga profilu, który odciąża nerki i wspiera serce.',
  },
]

const TRUST_FEATURES = [
  {
    Icon: Search,
    title: "Skład rozłożony na czynniki pierwsze",
    body: "Kliknij w dowolny składnik na karcie produktu — dostaniesz neutralny opis co robi i dlaczego jest obecny w formule. Bez ukrywania za trudnymi nazwami chemicznymi.",
  },
  {
    Icon: BadgeCheck,
    title: "Trzy poziomy weryfikacji",
    body: "Standard PureCare, Wybór Ekspertów, Atest Czystego Składu — każda odznaka ma konkretne kryteria i datę weryfikacji. Nie dożywotnią etykietkę, tylko aktualną ocenę.",
  },
  {
    Icon: AlertTriangle,
    title: "AI Alert zanim będzie za późno",
    body: "Jeśli Twój pupil zbliża się do wieku, w którym jego rasa statystycznie zaczyna mieć problemy ze stawami — dostaniesz powiadomienie. Prewencja, nie reakcja.",
  },
]

export default function DlaczegoPremiumPage() {
  return (
    <main className="bg-canvas">

      {/* ── 1. HERO ──────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-editorial px-6 pt-20 pb-16 md:px-12 md:pt-32 md:pb-24">
        <p className="mb-8 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
          Edukacja
        </p>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <h1 className="font-serif font-normal leading-editorial text-ink text-5xl md:text-6xl lg:text-7xl">
              Dlaczego<br />Premium?
            </h1>
            <p className="mt-8 text-lg leading-body text-ink-muted max-w-lg">
              Bo „bez glutenu" na etykiecie nie znaczy nic. Bo „naturalne aromaty"
              to chemiczne odtworzenie smaku. Bo twój pupil nie może sam przeczytać składu.
            </p>
          </div>
          <div className="md:col-span-4 md:col-start-9 md:flex md:items-end">
            <p className="text-base leading-body text-ink-muted">
              Ta strona nie jest po to, żebyś kupił u nas. Jest po to, żebyś wiedział,
              co czytać — u nas i wszędzie indziej.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. MITY ──────────────────────────────────────────────────────── */}
      <section className="bg-warm-island">
        <div className="mx-auto max-w-editorial px-6 py-16 md:px-12 md:py-20">
          <p className="mb-5 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
            Mity i fakty
          </p>
          <h2 className="mb-12 font-serif font-normal leading-editorial text-ink text-3xl md:text-4xl">
            Trzy rzeczy, które<br />słyszysz za często.
          </h2>

          <div className="flex flex-col gap-6">
            {MYTH_BUSTERS.map(({ myth, truth }, i) => (
              <div key={i} className="bg-card-warm rounded-card p-8 md:p-10 shadow-warm">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-12">
                  <div>
                    <p className="mb-3 text-[11px] font-medium tracking-eyebrow text-ink-subtle uppercase">
                      Mit
                    </p>
                    <p className="font-serif font-normal italic text-xl leading-body text-ink-muted">
                      &bdquo;{myth}&rdquo;
                    </p>
                  </div>
                  <div>
                    <p className="mb-3 text-[11px] font-medium tracking-eyebrow text-moss uppercase">
                      Rzeczywistość
                    </p>
                    <p className="text-sm leading-body text-ink-muted">{truth}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. JAK CZYTAĆ SKŁAD ──────────────────────────────────────────── */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-editorial px-6 py-16 md:px-12 md:py-20">
          <p className="mb-5 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
            Przewodnik
          </p>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <h2 className="font-serif font-normal leading-editorial text-ink text-3xl md:text-4xl">
                Jak czytać<br />skład karmy.
              </h2>
              <p className="mt-6 text-base leading-body text-ink-muted">
                Składniki podawane są w kolejności malejącej według masy. Pierwszy składnik
                to ten, którego jest najwięcej. Jeśli na pierwszym miejscu nie ma
                konkretnego mięsa — reszta nie ma już znaczenia.
              </p>
              <p className="mt-4 text-base leading-body text-ink-muted">
                Poniżej zestawienie tego, czego szukać i czego unikać.
              </p>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <div className="flex flex-col gap-4">
                {/* Nagłówek kolumn */}
                <div className="grid grid-cols-[1fr_1fr] gap-4 pb-2 border-b border-border-warm">
                  <p className="text-[11px] font-medium tracking-eyebrow text-error-warm uppercase">
                    Czerwona flaga
                  </p>
                  <p className="text-[11px] font-medium tracking-eyebrow text-moss uppercase">
                    Dobry sygnał
                  </p>
                </div>
                {INGREDIENTS_EXPLAINED.map(({ bad, good, why }, i) => (
                  <div key={i} className="rounded-card-sm border border-border-warm bg-card-warm p-5">
                    <div className="grid grid-cols-[1fr_1fr] gap-4 mb-3">
                      <p className="text-sm font-medium text-error-warm">{bad}</p>
                      <p className="text-sm font-medium text-moss">{good}</p>
                    </div>
                    <p className="text-xs leading-body text-ink-muted border-t border-border-warm pt-3">
                      {why}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. PREWENCJA ─────────────────────────────────────────────────── */}
      <section className="bg-warm-island">
        <div className="mx-auto max-w-editorial px-6 py-16 md:px-12 md:py-20">
          <p className="mb-5 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
            Filozofia prewencji
          </p>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12 mb-12">
            <div className="md:col-span-6">
              <h2 className="font-serif font-normal leading-editorial text-ink text-3xl md:text-4xl">
                Prewencja kosztuje<br />mniej niż leczenie.
              </h2>
            </div>
            <div className="md:col-span-5 md:col-start-8 md:flex md:items-end">
              <p className="text-base leading-body text-ink-muted">
                Suplement na stawy dla 4-letniego psa kosztuje kilkadziesiąt złotych miesięcznie.
                Rehabilitacja i leczenie dysplazji — kilka tysięcy rocznie, i to tylko
                żeby zatrzymać postęp, nie cofnąć szkód.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {WHY_PREVENTION.map(({ Icon, age, title, body }) => (
              <div key={title} className="bg-card-warm rounded-card-sm p-6 shadow-warm">
                <div className="mb-5 flex items-start justify-between">
                  <Icon size={20} className="text-terracotta" strokeWidth={1.5} />
                  <span className="text-[11px] font-medium text-ink-subtle">{age}</span>
                </div>
                <p className="mb-3 text-base font-medium text-ink">{title}</p>
                <p className="text-sm leading-body text-ink-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. JAK MY TO ROBIMY ──────────────────────────────────────────── */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-editorial px-6 py-16 md:px-12 md:py-20">
          <p className="mb-5 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
            Jak to sprawdzamy
          </p>
          <h2 className="mb-12 font-serif font-normal leading-editorial text-ink text-3xl md:text-4xl">
            Co robimy, żebyś<br />mógł nam ufać.
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TRUST_FEATURES.map(({ Icon, title, body }) => (
              <div key={title} className="rounded-card-sm border border-border-warm p-6">
                <div className="mb-5 w-10 h-10 rounded-field bg-terracotta/8 flex items-center justify-center">
                  <Icon size={18} className="text-terracotta" strokeWidth={1.5} />
                </div>
                <p className="mb-3 text-base font-medium text-ink">{title}</p>
                <p className="text-sm leading-body text-ink-muted">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/standardy-jakosci"
              className="inline-flex items-center gap-2 rounded-button border border-border-warm px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-terracotta hover:text-terracotta"
            >
              Nasze standardy jakości
              <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
            <Link
              href="/eksperci"
              className="inline-flex items-center gap-2 rounded-button border border-border-warm px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-terracotta hover:text-terracotta"
            >
              Panel Cyfrowych Kuratorów
              <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. CTA ───────────────────────────────────────────────────────── */}
      <section className="bg-warm-island">
        <div className="mx-auto max-w-editorial px-6 py-16 md:px-12 md:py-20 flex flex-col items-center text-center">
          <p className="mb-4 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
            Zacznij od quizu
          </p>
          <h2 className="mb-6 font-serif font-normal leading-editorial text-ink text-3xl md:text-4xl max-w-lg">
            Sprawdź, czego konkretnie<br />potrzebuje Twój pupil.
          </h2>
          <p className="mb-10 max-w-md text-base leading-body text-ink-muted">
            3 minuty, kilka pytań o rasę, wiek i aktywność — i dostaniesz
            spersonalizowany raport z rekomendacjami dopasowanymi do Twojego zwierzęcia.
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2.5 rounded-button bg-terracotta px-8 py-4 text-base font-medium text-card-warm transition-colors hover:bg-terracotta-hover"
          >
            Sprawdź, czego potrzebuje Twój pupil
            <ArrowRight size={16} strokeWidth={1.5} />
          </Link>
          <p className="mt-6 text-xs text-ink-subtle">
            Bezpłatnie. Raport ma charakter informacyjny — najlepszą diagnozę postawi weterynarz Twojego pupila.
          </p>
        </div>
      </section>

    </main>
  )
}
