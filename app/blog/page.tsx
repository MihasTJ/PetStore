import Link from "next/link"
import { ArrowRight, BookOpen, Leaf, HeartPulse } from "lucide-react"

export const metadata = {
  title: "Blog — Nobile Pet Care",
  description:
    "Artykuły o zdrowiu, żywieniu i dobrostanie psów i kotów. Wkrótce — autorstwa Wiktora i Julii z Panelu Kuratorów.",
}

const UPCOMING = [
  {
    Icon: Leaf,
    label: "Żywienie",
    title: "Glukozamina, MSM, kolagen — czym się różnią i kiedy sięgnąć po każdy z nich",
    author: "Wiktor",
  },
  {
    Icon: HeartPulse,
    label: "Prewencja",
    title: "5. rok życia psa — dlaczego to moment, w którym warto zmienić dietę",
    author: "Julia",
  },
  {
    Icon: BookOpen,
    label: "Przewodnik",
    title: "Jak czytać skład karmy: 7 składników, które powinny wzbudzić Twój niepokój",
    author: "Wiktor",
  },
]

export default function BlogPage() {
  return (
    <main className="bg-canvas min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-editorial px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-20">
        <p className="mb-6 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
          Wiedza
        </p>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <h1 className="font-serif font-normal leading-editorial text-ink text-4xl md:text-5xl lg:text-[3.25rem]">
              Artykuły, które<br />pomogą Ci decydować.
            </h1>
          </div>
          <div className="md:col-span-4 md:col-start-9 md:flex md:items-end">
            <p className="text-base leading-body text-ink-muted">
              Wiktor i Julia z Panelu Kuratorów przygotowują artykuły o żywieniu,
              prewencji i składach. Rzetelnie, bez reklamy.
            </p>
          </div>
        </div>
      </section>

      {/* ── COMING SOON ──────────────────────────────────────────────── */}
      <section className="bg-warm-island border-y border-border-warm">
        <div className="mx-auto max-w-editorial px-6 py-16 md:px-12 md:py-20">

          <div className="max-w-xl">
            <span className="inline-block mb-4 rounded-tag border border-terracotta/30 bg-terracotta/6 px-3 py-1 text-[11px] font-medium text-terracotta uppercase tracking-eyebrow">
              Wkrótce
            </span>
            <h2 className="font-serif font-normal text-2xl md:text-3xl text-ink mb-4">
              Sekcja w przygotowaniu
            </h2>
            <p className="text-base leading-body text-ink-muted mb-8">
              Blog Nobile otworzymy, gdy Wiktor i Julia będą gotowi z pierwszymi
              artykułami. Chcemy, żeby każdy tekst był rzeczywiście przydatny —
              nie wypełniaczem pod SEO. Na razie znajdziesz ich rekomendacje
              bezpośrednio na kartach produktów.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/produkty"
                className="inline-flex items-center gap-2 rounded-button bg-terracotta px-5 py-2.5 text-sm font-medium text-card-warm hover:bg-terracotta-hover transition-colors"
              >
                Przeglądaj produkty
                <ArrowRight size={14} strokeWidth={1.5} />
              </Link>
              <Link
                href="/eksperci"
                className="inline-flex items-center gap-2 rounded-button border border-border-warm px-5 py-2.5 text-sm font-medium text-ink-muted hover:border-terracotta/50 hover:text-ink transition-colors"
              >
                Kim są Wiktor i Julia
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── ZAPOWIEDZI ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-editorial px-6 py-16 md:px-12 md:py-20">

        <p className="mb-10 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
          Tematy w kolejce
        </p>

        <div className="grid grid-cols-1 gap-px bg-border-warm md:grid-cols-3">
          {UPCOMING.map(({ Icon, label, title, author }) => (
            <div
              key={title}
              className="bg-canvas p-8 flex flex-col gap-4"
            >
              <div className="flex items-center gap-2">
                <Icon size={13} className="text-moss shrink-0" strokeWidth={1.5} />
                <span className="text-[11px] font-medium tracking-eyebrow text-moss uppercase">
                  {label}
                </span>
              </div>
              <p className="font-serif font-normal text-lg leading-snug text-ink">
                {title}
              </p>
              <p className="mt-auto text-[11px] text-ink-subtle">
                Kurator: {author}
              </p>
            </div>
          ))}
        </div>

      </section>

    </main>
  )
}
