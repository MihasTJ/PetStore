import { Suspense } from "react"
import Link from "next/link"
import { ShieldCheck, ArrowRight } from "lucide-react"
import { getProducts } from "@/lib/supabase/queries/products"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "./product-filters"

export const metadata = {
  title: "Produkty Premium — Nobile Pet Care",
  description:
    "Suplementy i karmy z weryfikowanym składem dla Twojego pupila. Każdy produkt analizowany przez Panel Kuratorów marki.",
}

function fmtPrice(n: number) {
  return n.toFixed(2).replace(".", ",") + " zł"
}

export default async function ProduktyPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams

  const species    = typeof sp.gatunek === "string" ? sp.gatunek : undefined
  const tagsRaw    = typeof sp.tagi    === "string" ? sp.tagi    : ""
  const healthTags = tagsRaw ? tagsRaw.split(",").filter(Boolean) : undefined
  const isPremium  = sp.premium === "1"

  let products: Awaited<ReturnType<typeof getProducts>> = []
  try {
    products = await getProducts({
      species:            species || undefined,
      health_tags:        healthTags?.length ? healthTags : undefined,
      is_premium_verified: isPremium || undefined,
    })
  } catch {
    products = []
  }

  const hasFilters = Boolean(species || healthTags?.length || isPremium)

  return (
    <main className="bg-canvas min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-editorial px-6 pt-28 pb-10 md:px-12 md:pt-36 md:pb-14">
        <p className="mb-6 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
          Kolekcja Premium
        </p>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <h1 className="font-serif font-normal leading-editorial text-ink text-4xl md:text-5xl lg:text-[3.25rem]">
              Tylko produkty<br />z weryfikacją składu.
            </h1>
          </div>
          <div className="md:col-span-4 md:col-start-9 md:flex md:items-end">
            <p className="text-base leading-body text-ink-muted">
              Każdy produkt przeszedł analizę składu przez Kuratorów marki.
              Zamawiasz z wiedzą, że to naprawdę bezpieczne dla Twojego pupila.
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-2.5">
          <ShieldCheck size={14} className="text-moss shrink-0" strokeWidth={1.5} />
          <span className="text-sm text-ink-muted">
            <span className="font-medium text-ink">{products.length}</span>
            {" "}
            {products.length === 1 ? "produkt" : products.length < 5 ? "produkty" : "produktów"}
            {" "}· analizowanych przez Panel Kuratorów
          </span>
        </div>
      </section>

      {/* ── FILTRY (sticky pod nawigacją) ────────────────────────────── */}
      <div className="sticky top-[64px] z-30 border-y border-border-warm bg-warm-island/96 backdrop-blur-sm">
        <div className="mx-auto max-w-editorial px-6 md:px-12">
          <Suspense fallback={<div className="h-[54px]" />}>
            <ProductFilters />
          </Suspense>
        </div>
      </div>

      {/* ── SIATKA PRODUKTÓW ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-editorial px-6 py-12 md:px-12 md:py-16">

        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                slug={product.slug}
                name={product.name_seo}
                description={product.description_seo ?? ""}
                price={fmtPrice(product.price_sell)}
                priceNumeric={product.price_sell}
                weight={product.usage_days ? `${product.usage_days} porcji` : ""}
                healthTags={product.health_tags ?? []}
                isPremiumVerified={product.is_premium_verified}
                hasExpertEndorsement={(product.expert_tags ?? []).length > 0}
              />
            ))}
          </div>
        ) : (
          /* ── EMPTY STATE ─────────────────────────────────────────── */
          <div className="py-24 text-center">
            <div
              className="mx-auto mb-8 flex items-center justify-center rounded-full"
              style={{ width: 64, height: 64, backgroundColor: "rgba(184,101,74,0.08)" }}
            >
              <ShieldCheck size={24} className="text-terracotta" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif font-normal text-2xl text-ink mb-3">
              {hasFilters
                ? "Brak produktów dla wybranych filtrów"
                : "Produkty wkrótce"}
            </h2>
            <p className="text-sm leading-body text-ink-muted mb-8 max-w-sm mx-auto">
              {hasFilters
                ? "Spróbuj usunąć filtry lub przeglądaj całą kolekcję."
                : "Właśnie kompletujemy kolekcję produktów z weryfikowanym składem. Wróć wkrótce."}
            </p>
            {hasFilters ? (
              <Link
                href="/produkty"
                className="inline-flex items-center gap-2 rounded-button border border-border-warm px-6 py-3 text-sm font-medium text-ink hover:border-terracotta hover:text-terracotta transition-colors"
              >
                Pokaż wszystkie produkty
              </Link>
            ) : (
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-button bg-terracotta px-6 py-3 text-sm font-medium text-card-warm hover:bg-terracotta-hover transition-colors"
              >
                Wróć na stronę główną
                <ArrowRight size={14} strokeWidth={1.5} />
              </Link>
            )}
          </div>
        )}

      </section>

      {/* ── TRUST FOOTER ─────────────────────────────────────────────── */}
      <section className="bg-warm-island">
        <div className="mx-auto max-w-editorial px-6 py-14 md:px-12 md:py-16">

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {TRUST_POINTS.map(({ title, body }) => (
              <div key={title}>
                <div className="mb-3 flex items-center gap-2">
                  <span className="block w-1.5 h-1.5 rounded-full bg-moss shrink-0" />
                  <span className="text-[11px] font-medium tracking-eyebrow uppercase text-moss">
                    {title}
                  </span>
                </div>
                <p className="text-sm leading-body text-ink-muted">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-border-warm flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
            <span className="text-xs text-ink-subtle">Dowiedz się więcej:</span>
            <Link
              href="/standardy-jakosci"
              className="text-xs text-ink-muted hover:text-terracotta transition-colors"
            >
              Nasze standardy jakości →
            </Link>
            <Link
              href="/eksperci"
              className="text-xs text-ink-muted hover:text-terracotta transition-colors"
            >
              Kim są Kuratorzy marki →
            </Link>
          </div>

        </div>
      </section>

    </main>
  )
}

const TRUST_POINTS = [
  {
    title: "Weryfikowany skład",
    body:  "Każdy składnik przeanalizowany przez Panel Kuratorów. Żadnych wypełniaczy ukrytych pod naukowymi nazwami.",
  },
  {
    title: "Dopasowane do pupila",
    body:  "Nie sprzedajemy wszystkiego. Sprzedajemy to, co polecilibyśmy własnemu zwierzęciu na konkretnym etapie życia.",
  },
  {
    title: "Zwrot bez pytań",
    body:  "Jeśli Twój pupil nie zaakceptuje produktu — zwracamy pełną kwotę w ciągu 14 dni. Bez formularzy.",
  },
]
