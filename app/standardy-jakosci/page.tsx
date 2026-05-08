import {
  Leaf,
  BadgeCheck,
  FileCheck,
  ArrowRight,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  SlidersHorizontal,
  ClipboardList,
} from "lucide-react"

export const metadata = {
  title: "Standardy jakości — Premium Pet Care",
  description:
    "Dowiedz się, jakie kryteria musi spełnić produkt, żeby trafić na naszą półkę. Trzy odznaki, jedno zobowiązanie — tylko to, co bezpieczne.",
}

const BADGES = [
  {
    code: "pure_care",
    Icon: Leaf,
    eyebrow: "Weryfikacja składu",
    name: "Standard PureCare",
    tagline: "Bez sztucznych konserwantów i wypełniaczy.",
    description:
      "Innymi słowy — żadnych skrótów chemicznych, za którymi producenci ukrywają niskiej jakości surowce. Weryfikujemy nie tylko etykietę, ale też czy za trudnymi nazwami chemicznymi nie kryją się substancje maskujące niską jakość składnika.",
    criteria: [
      "Brak BHA, BHT, etoksychininy i innych syntetycznych antyoksydantów",
      "Brak wypełniaczy (celuloza drzewna, propyleno glikol, siarczan sodu)",
      "Skład zgodny z normami FEDIAF lub AAFCO dla gatunku",
      "Brak sztucznych barwników i aromatów",
    ],
    notAllowed: [
      "Produkty z więcej niż jednym konserwantem syntetycznym",
      "Karmy z mąką mięsno-kostną jako głównym źródłem białka",
    ],
    whoAssigns: "Weryfikacja składu w panelu admina — każdy składnik flagowany ręcznie przez zespół.",
    iconBg: "bg-moss/10",
    iconText: "text-moss",
    eyebrowCls: "text-moss",
    barBg: "bg-moss/10",
    barBorder: "border-l-2 border-moss/20",
    barLabel: "text-moss",
  },
  {
    code: "expert_choice",
    Icon: BadgeCheck,
    eyebrow: "Rekomendacja Kuratorów",
    name: "Wybór Ekspertów",
    tagline: "Rekomendowany przez Panel Cyfrowych Kuratorów.",
    description:
      "Odznaka przyznawana produktom, które Panel Cyfrowych Kuratorów — Wiktor i Julia — aktywnie rekomenduje w oparciu o analizę składu, dopasowanie do profili ras i aktualny stan wiedzy żywieniowej. Każdy endorsement ma datę walidacji i cytat Kuratora widoczny na karcie produktu.",
    criteria: [
      "Produkt musi mieć Standard PureCare lub Atest Czystego Składu",
      "Skład analizowany pod kątem biodostępności aktywnych składników",
      "Dopasowanie do co najmniej jednego potwierdzonego profilu zdrowotnego (rasa, wiek, stan zdrowia)",
      "Endorsement zawiera datę walidacji — nie starszą niż 12 miesięcy",
    ],
    notAllowed: [
      "Produkty bez potwierdzonej zgodności składu z normami żywieniowymi",
      "Produkty, które zmieniły skład po dacie walidacji bez ponownej analizy",
    ],
    whoAssigns: "Przypisanie endorsementu przez Kuratora w panelu admina. Link do /eksperci widoczny przy każdej rekomendacji.",
    iconBg: "bg-terracotta/10",
    iconText: "text-terracotta",
    eyebrowCls: "text-terracotta",
    barBg: "bg-terracotta/10",
    barBorder: "border-l-2 border-terracotta/20",
    barLabel: "text-terracotta",
  },
  {
    code: "clean_composition",
    Icon: FileCheck,
    eyebrow: "Transparentność składu",
    name: "Atest Czystego Składu",
    tagline: "Pełna transparentność każdego składnika.",
    description:
      "Kupujesz świadomie, nie na wiarę. Produkt z Atestem Czystego Składu ma w sklepie rozłożony każdy składnik na czynniki pierwsze — z opisem, co robi i dlaczego jest obecny w formule. Każdy składnik ma tooltip z neutralnym wyjaśnieniem, a walidowane oznaczone zieloną ikoną.",
    criteria: [
      "Wszystkie składniki opisane w bazie tooltipów — bez wyjątków",
      "Producent udostępnił pełną specyfikację surowców",
      "Brak sformułowań ukrywających skład ('mieszanka naturalnych aromatów' bez rozwinięcia)",
      "Dokumentacja przechowywana w panelu admina z datą weryfikacji",
    ],
    notAllowed: [
      "Produkty z 'zastrzeżonymi formułami' niepodlegającymi ujawnieniu",
      "Składniki opisane wyłącznie numerem E bez wyjaśnienia roli",
    ],
    whoAssigns: "Walidacja dokumentacji producenta w panelu admina. Wymagana pełna spec surowców.",
    iconBg: "bg-moss/10",
    iconText: "text-moss",
    eyebrowCls: "text-moss",
    barBg: "bg-moss/10",
    barBorder: "border-l-2 border-moss/20",
    barLabel: "text-moss",
  },
]

const PROCESS_STEPS = [
  {
    Icon: ClipboardList,
    step: "01",
    title: "Analiza składu",
    body: "Każdy produkt trafia najpierw do Wiktora — Analityka Formuł Żywieniowych. Sprawdzamy skład pod kątem zakazanych substancji, wypełniaczy i zgodności z normami.",
  },
  {
    Icon: SlidersHorizontal,
    step: "02",
    title: "Dopasowanie do profili",
    body: "Julia ocenia, czy formuła odpowiada realnym potrzebom ras i etapów życia. Produkt dla seniora musi spełniać inne kryteria niż produkt dla szczeniaka.",
  },
  {
    Icon: ShieldCheck,
    step: "03",
    title: "Przyznanie odznaki",
    body: "Dopiero po pozytywnej weryfikacji produkt otrzymuje jedną lub więcej odznak. Data walidacji jest jawna — odznaka nie jest dożywotnia.",
  },
]

export default function StandardyJakosciPage() {
  return (
    <main className="bg-canvas">

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-editorial px-6 pt-20 pb-16 md:px-12 md:pt-32 md:pb-24">
        <p className="mb-8 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
          Certyfikaty jakości
        </p>
        <div className="max-w-2xl">
          <h1 className="font-serif font-normal leading-editorial text-ink text-5xl md:text-6xl lg:text-7xl">
            Co oznaczają<br />nasze odznaki.
          </h1>
          <p className="mt-8 text-lg leading-body text-ink-muted max-w-lg">
            Zanim cokolwiek trafi na naszą półkę, wiemy dokładnie z czego jest
            zrobione. I dlaczego.
          </p>
        </div>
      </section>

      {/* ── 2. TRZY ODZNAKI ─────────────────────────────────────────────── */}
      <section className="bg-warm-island">
        <div className="mx-auto max-w-editorial px-6 py-16 md:px-12 md:py-20">
          <p className="mb-5 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
            System odznak
          </p>
          <h2 className="mb-12 font-serif font-normal leading-editorial text-ink text-3xl md:text-4xl">
            Trzy poziomy weryfikacji.<br />Jedno zobowiązanie.
          </h2>

          <div className="flex flex-col gap-6">
            {BADGES.map((badge) => (
              <div
                key={badge.code}
                className="bg-card-warm rounded-card p-8 shadow-warm md:p-10"
              >
                {/* Header */}
                <div className="mb-6 flex items-start gap-5">
                  <div className={`shrink-0 flex items-center justify-center w-12 h-12 rounded-field ${badge.iconBg}`}>
                    <badge.Icon size={22} className={badge.iconText} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className={`mb-1 text-xs font-medium tracking-eyebrow uppercase ${badge.eyebrowCls}`}>
                      {badge.eyebrow}
                    </p>
                    <h3 className="font-serif font-normal text-2xl md:text-3xl text-ink leading-editorial">
                      {badge.name}
                    </h3>
                    <p className="mt-1 text-sm text-ink-muted">{badge.tagline}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="mb-8 text-base leading-body text-ink-muted max-w-2xl">
                  {badge.description}
                </p>

                {/* Criteria grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <p className="mb-4 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
                      Wymagania
                    </p>
                    <ul className="flex flex-col gap-3">
                      {badge.criteria.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <CheckCircle2
                            size={16}
                            className="mt-0.5 shrink-0 text-moss"
                            strokeWidth={1.5}
                          />
                          <span className="text-sm leading-body text-ink-muted">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="mb-4 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
                      Dyskwalifikuje
                    </p>
                    <ul className="flex flex-col gap-3">
                      {badge.notAllowed.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <XCircle
                            size={16}
                            className="mt-0.5 shrink-0 text-error-warm"
                            strokeWidth={1.5}
                          />
                          <span className="text-sm leading-body text-ink-muted">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer — who assigns */}
                <div className={`mt-8 rounded-field px-5 py-3.5 flex items-start gap-3 ${badge.barBg} ${badge.barBorder}`}>
                  <span className={`shrink-0 text-[11px] font-medium tracking-eyebrow uppercase ${badge.barLabel}`}>
                    Kto przyznaje
                  </span>
                  <span className="text-sm leading-body text-ink-muted">{badge.whoAssigns}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. PROCES WERYFIKACJI ────────────────────────────────────────── */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-editorial px-6 py-16 md:px-12 md:py-20">
          <p className="mb-5 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
            Proces
          </p>
          <h2 className="mb-12 font-serif font-normal leading-editorial text-ink text-3xl md:text-4xl">
            Jak produkt trafia<br />na naszą półkę.
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {PROCESS_STEPS.map(({ Icon, step, title, body }) => (
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

      {/* ── 4. CTA ──────────────────────────────────────────────────────── */}
      <section className="bg-warm-island">
        <div className="mx-auto max-w-editorial px-6 py-16 md:px-12 md:py-20 flex flex-col items-center text-center">
          <p className="mb-4 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
            Weryfikowane produkty
          </p>
          <h2 className="mb-6 font-serif font-normal leading-editorial text-ink text-3xl md:text-4xl max-w-lg">
            Sprawdź, co nosi<br />nasze odznaki.
          </h2>
          <p className="mb-10 max-w-md text-base leading-body text-ink-muted">
            Filtruj produkty po odznakach i wybierz poziom weryfikacji,
            który daje Ci spokój ducha.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/produkty?badge=expert_choice"
              className="inline-flex items-center gap-2.5 rounded-button bg-terracotta px-8 py-4 text-base font-medium text-card-warm transition-colors hover:bg-terracotta-hover"
            >
              Przeglądaj weryfikowane produkty
              <ArrowRight size={16} strokeWidth={1.5} />
            </a>
            <a
              href="/eksperci"
              className="inline-flex items-center gap-2.5 rounded-button border border-border-warm px-8 py-4 text-base font-medium text-ink transition-colors hover:border-terracotta hover:text-terracotta"
            >
              Poznaj Kuratorów
              <ArrowRight size={16} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </section>

    </main>
  )
}
