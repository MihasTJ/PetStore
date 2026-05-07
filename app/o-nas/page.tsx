import { createClient } from "@/lib/supabase/server"
import { ArrowRight, Shield, Heart, Users } from "lucide-react"

export const metadata = {
  title: "O nas — Premium Pet Care",
  description:
    "Historia założyciela i filozofia marki. Dowiedz się, dlaczego powstał ten sklep i jak wybieramy produkty dla Twojego pupila.",
}

const LETTER_FALLBACK =
  "[Uzupełnij swoją historię tutaj — opisz swój moment przełomowy, imię własnego psa i dlaczego założyłeś ten sklep. Panel admina → Treść · zaufanie → List Założycielski — pełny.]"

const WHY_POINTS = [
  {
    Icon: Shield,
    step: "01",
    title: "Bo skład ma znaczenie",
    body: "Przepisy nie chronią wystarczająco. Wiele popularnych karm zawiera wypełniacze, które producenci ukrywają pod naukowymi nazwami. My rozkładamy każdy produkt na czynniki pierwsze.",
  },
  {
    Icon: Heart,
    step: "02",
    title: "Bo prewencja kosztuje mniej niż leczenie",
    body: "Suplement na stawy podawany od 5. roku życia to często różnica między psem, który biega, a psem, który leży. Budujemy sklep wokół filozofii prewencji, nie reakcji.",
  },
  {
    Icon: Users,
    step: "03",
    title: "Bo właściciele zasługują na rzetelną wiedzę",
    body: "Reklamy mówią, że każdy produkt jest premium. My pokazujemy, dlaczego ten konkretny produkt jest właściwy dla Twojego konkretnego zwierzęcia — z wyjaśnieniem, nie z hasłem.",
  },
] as const

export default async function ONasPage() {
  const supabase = await createClient()
  const { data: contentRow } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", "founder_letter_full")
    .maybeSingle()

  const founderLetter = contentRow?.value ?? LETTER_FALLBACK
  const isFallback = !contentRow?.value

  return (
    <main className="bg-canvas">

      {/* ── 1. HERO ──────────────────────────────────────────────────────
          Swap the placeholder div for a real image:
          <div className="relative w-full" style={{ height: "min(72vh, 620px)" }}>
            <Image
              src="/images/founder-full.jpg"
              alt="Założyciel z psem — historia sklepu"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
          Wtedy h1 przenieś nad sekcję obrazka lub pozostaw poniżej.
      ────────────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-editorial px-6 pt-20 pb-0 md:px-12 md:pt-32">
        <p className="mb-8 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
          Słowo założyciela
        </p>
        <h1 className="font-serif font-normal leading-editorial text-ink text-5xl md:text-6xl lg:text-7xl max-w-2xl">
          Skąd wziął się<br />ten sklep.
        </h1>
      </section>

      {/* Hero image placeholder — zamień na <Image> gdy gotowe zdjęcie */}
      <div className="mx-auto max-w-shell w-full px-0 mt-12">
        <div
          className="w-full bg-warm-island flex items-center justify-center"
          style={{ height: "min(56vh, 520px)" }}
        >
          <div className="text-center px-8">
            <p className="text-sm leading-body text-ink-subtle italic">
              [ /images/founder-full.jpg ]
            </p>
            <p className="mt-2 text-xs text-ink-subtle max-w-sm mx-auto">
              Właściciel z psem — naturalne, w domu. Ciepłe światło z okna,
              lekkie ziarno. Bez całych twarzy. Format panoramiczny.
            </p>
          </div>
        </div>
      </div>

      {/* ── 2. PEŁNY LIST ZAŁOŻYCIELSKI ──────────────────────────────────── */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-editorial px-6 pt-16 pb-20 md:px-12 md:pt-24 md:pb-28">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-12">

            {/* Boczne zdjęcie 4:5 */}
            <div className="md:col-span-4">
              {/*
                Zamień na:
                <Image
                  src="/images/founder-full.jpg"
                  alt="Założyciel z psem"
                  width={400} height={500}
                  className="w-full rounded-[6px] object-cover"
                />
              */}
              <div className="aspect-[4/5] w-full rounded-[6px] bg-warm-island flex items-center justify-center px-6">
                <p className="text-center text-sm leading-body text-ink-subtle italic">
                  [ /images/founder-full.jpg ]<br />
                  <span className="not-italic text-xs">
                    Właściciel z psem. Format 4:5.
                  </span>
                </p>
              </div>
            </div>

            {/* Tekst listu */}
            <div className="md:col-span-7 md:col-start-6 flex flex-col justify-start">
              <p className="mb-8 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
                Historia
              </p>

              {isFallback ? (
                <div
                  className="border-l-2 pl-6 py-1"
                  style={{ borderColor: "rgba(184,101,74,0.35)" }}
                >
                  <p className="font-serif font-normal text-xl leading-body text-ink-muted italic">
                    {LETTER_FALLBACK}
                  </p>
                </div>
              ) : (
                <div className="font-serif font-normal text-xl md:text-[1.35rem] leading-body text-ink space-y-7">
                  {founderLetter.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. DLACZEGO TEN SKLEP ────────────────────────────────────────── */}
      <section className="bg-warm-island">
        <div className="mx-auto max-w-editorial px-6 py-16 md:px-12 md:py-20">
          <p className="mb-5 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
            Misja
          </p>
          <h2 className="mb-12 font-serif font-normal leading-editorial text-ink text-3xl md:text-4xl">
            Dlaczego powstał<br />ten sklep.
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {WHY_POINTS.map(({ Icon, step, title, body }) => (
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

      {/* ── 4. JAK DZIAŁAMY ──────────────────────────────────────────────── */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-editorial px-6 py-16 md:px-12 md:py-20">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12">

            <div className="md:col-span-5">
              <p className="mb-5 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
                Filozofia
              </p>
              <h2 className="font-serif font-normal leading-editorial text-ink text-3xl md:text-4xl">
                Jak działamy.
              </h2>
            </div>

            <div className="md:col-span-7">
              <p className="mb-6 text-base leading-body text-ink-muted">
                Każdy produkt w sklepie przechodzi przez ten sam filtr: skład, bezpieczeństwo,
                dopasowanie do rasy i etapu życia. Nie sprzedajemy wszystkiego — sprzedajemy
                to, co polecilibyśmy własnemu zwierzęciu.
              </p>
              <p className="mb-10 text-base leading-body text-ink-muted">
                Nasz Panel Cyfrowych Kuratorów analizuje tysiące badań żywieniowych,
                żebyś nie musiał. Nie zastępuje to wizyty u weterynarza — daje Ci wiedzę,
                z którą idziesz do gabinetu przygotowany.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="/eksperci"
                  className="inline-flex items-center gap-2 rounded-button border border-border-warm px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-terracotta hover:text-terracotta"
                >
                  Poznaj Kuratorów
                  <ArrowRight size={14} strokeWidth={1.5} />
                </a>
                <a
                  href="/standardy-jakosci"
                  className="inline-flex items-center gap-2 rounded-button border border-border-warm px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-terracotta hover:text-terracotta"
                >
                  Nasze standardy jakości
                  <ArrowRight size={14} strokeWidth={1.5} />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 5. CTA ───────────────────────────────────────────────────────── */}
      <section className="bg-warm-island">
        <div className="mx-auto max-w-editorial px-6 py-16 md:px-12 md:py-20 flex flex-col items-center text-center">
          <p className="mb-4 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
            Zacznij teraz
          </p>
          <h2 className="mb-6 font-serif font-normal leading-editorial text-ink text-3xl md:text-4xl max-w-lg">
            Twój pupil czeka<br />na właściwy wybór.
          </h2>
          <p className="mb-10 max-w-md text-base leading-body text-ink-muted">
            Sprawdź produkty, które przeszły naszą weryfikację. Każdy z nich
            ma rozłożony skład i wyjaśnienie, dlaczego jest właściwy.
          </p>
          <a
            href="/produkty"
            className="inline-flex items-center gap-2.5 rounded-button bg-terracotta px-8 py-4 text-base font-medium text-card-warm transition-colors hover:bg-terracotta-hover"
          >
            Sprawdź nasze produkty
            <ArrowRight size={16} strokeWidth={1.5} />
          </a>
        </div>
      </section>

    </main>
  )
}
