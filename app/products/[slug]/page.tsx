import { notFound } from "next/navigation"
import { Star, Shield, ShieldCheck, BadgeCheck, Truck, ChevronRight, Info } from "lucide-react"
import Link from "next/link"
import { ProductCertificates } from "@/components/product-certificates"
import { ProductDoseCalculator } from "@/components/product-dose-calculator"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { IngredientCard } from "@/components/ingredient-card"
import { ShareButton } from "@/components/share-button"
import { createClient } from "@/lib/supabase/server"
import { getProductBySlug } from "@/lib/supabase/queries/products"
import type { BrandExpert } from "@/types/database"

type EndorsementWithExpert = {
  id: string
  quote: string
  validation_date: string | null
  brand_experts: Pick<BrandExpert, "id" | "name" | "role" | "ai_generated_avatar_url"> | null
}

type ReviewWithProfile = {
  id: string
  rating: number
  body: string
  created_at: string
  is_verified_purchase: boolean
  pet_profiles: { pet_name: string; breed: string | null } | null
}

function fmtPrice(n: number) {
  return n.toFixed(2).replace(".", ",") + " zł"
}

const TAG_COLORS: Record<string, string> = {
  stawy: "#A87B5C",
  seniory: "#9C5447",
  senior: "#9C5447",
  "duże rasy": "#7A6E5A",
  skóra: "#8B7355",
  sierść: "#7A6E5A",
  serce: "#9C5447",
  glukozamina: "#A87B5C",
  wellness: "#5C7A6B",
}

function tagColor(tag: string) {
  return TAG_COLORS[tag.toLowerCase()] ?? "#A87B5C"
}

function avgRating(reviews: ReviewWithProfile[]) {
  if (!reviews.length) return 0
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ preview?: string }>
}) {
  const { slug } = await params
  const { preview } = await searchParams
  const isPreview = preview === "1"

  const product = await getProductBySlug(slug, { preview: isPreview })
  if (!product) notFound()

  const supabase = await createClient()

  // Expert endorsements for this product
  const { data: endorsementsRaw } = await supabase
    .from("expert_endorsements")
    .select("id, quote, validation_date, brand_experts(id, name, role, ai_generated_avatar_url)")
    .eq("product_id", product.id)
    .limit(3)

  const endorsements = (endorsementsRaw ?? []) as EndorsementWithExpert[]

  // Reviews — fetch only when above threshold
  const reviewCount = product.review_count ?? 0
  let reviews: ReviewWithProfile[] = []
  if (reviewCount >= 5) {
    const { data } = await supabase
      .from("reviews")
      .select("id, rating, body, created_at, is_verified_purchase, pet_profiles(pet_name, breed)")
      .eq("product_id", product.id)
      .order("created_at", { ascending: false })
      .limit(6)
    reviews = (data ?? []) as ReviewWithProfile[]
  }

  // Formula fallback author — Wiktor from endorsements or brand_experts table
  type ExpertBasic = { name: string; role: string; ai_generated_avatar_url: string | null }
  let formulaAuthor: ExpertBasic | null = null
  if (reviewCount < 5) {
    const wiktorsEndorsement = endorsements.find(
      e => e.brand_experts?.name?.toLowerCase().includes("wiktor")
    )
    if (wiktorsEndorsement?.brand_experts) {
      formulaAuthor = wiktorsEndorsement.brand_experts
    } else {
      const { data } = await supabase
        .from("brand_experts")
        .select("name, role, ai_generated_avatar_url")
        .eq("is_active", true)
        .ilike("name", "%wiktor%")
        .maybeSingle()
      formulaAuthor = data ?? null
    }
  }

  const wiktorsEndorsement = endorsements.find(
    e => e.brand_experts?.name?.toLowerCase().includes("wiktor")
  ) ?? null
  const highlightedIngredients = product.product_ingredients.filter(i => i.is_highlighted)

  const isAvailable = product.stock > 0
  const avgStars = avgRating(reviews)

  // Omnibus: najniższa cena z 30 dni — wymagana przy promocji
  let lowestPrice30d: number | null = null
  if (product.price_promo !== null && product.price_promo !== undefined) {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const { data: priceHistory } = await supabase
      .from("product_price_history")
      .select("price_sell")
      .eq("product_id", product.id)
      .gte("recorded_at", cutoff)
      .order("price_sell", { ascending: true })
      .limit(1)
    const historicMin = priceHistory?.[0]?.price_sell ?? null
    lowestPrice30d = historicMin !== null
      ? Math.min(Number(historicMin), product.price_sell)
      : product.price_sell
  }

  return (
    <main className="bg-canvas">

      {/* ── BANER PODGLĄDU (widoczny tylko przy ?preview=1) ─────────── */}
      {isPreview && (
        <div style={{ position: "sticky", top: 0, zIndex: 50, background: "#1a1a1a", color: "#fff", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ background: "#B8654A", borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Tryb podglądu
            </span>
            <span style={{ color: "#aaa" }}>
              Status: <strong style={{ color: "#fff" }}>{product.status}</strong>
              {" · "}Widoczny tylko dla admina
            </span>
          </div>
          <a href="/admin" style={{ color: "#B8654A", textDecoration: "none", fontSize: 12 }}>← Wróć do panelu</a>
        </div>
      )}

      {/* ── BREADCRUMB ──────────────────────────────────────────────── */}
      <nav aria-label="Nawigacja okruszkowa" className="mx-auto max-w-editorial px-6 pt-20 md:px-12 md:pt-28">
        <ol className="flex items-center gap-1.5 text-xs text-ink-subtle">
          <li><Link href="/" className="hover:text-ink-muted transition-colors">Sklep</Link></li>
          {product.categories && (
            <>
              <li aria-hidden><ChevronRight size={12} /></li>
              <li>
                <Link href={`/kategoria/${product.categories.slug}`} className="hover:text-ink-muted transition-colors capitalize">
                  {product.categories.name}
                </Link>
              </li>
            </>
          )}
          <li aria-hidden><ChevronRight size={12} /></li>
          <li className="text-ink-muted truncate max-w-[200px]" aria-current="page">
            {product.name_seo}
          </li>
        </ol>
      </nav>

      {/* ── HERO PRODUKTU ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-editorial px-6 py-10 md:px-12 md:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">

          {/* Galeria */}
          <div className="md:col-span-5">
            <div className="aspect-square w-full rounded-[6px] bg-warm-island flex items-center justify-center px-8">
              <p className="text-center text-sm leading-body text-ink-subtle italic">
                [ Zdjęcie lifestyle ]<br />
                <span className="not-italic text-xs">Produkt w naturalnym otoczeniu. Format 1:1.</span>
              </p>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-field bg-warm-island/70 flex items-center justify-center">
                  <span className="text-[10px] text-ink-subtle">{i}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info produktu */}
          <div className="md:col-span-6 md:col-start-7">

            {/* Premium badge */}
            {product.is_premium_verified && (
              <div className="mb-6 inline-flex items-center gap-2 rounded-tag px-3 py-1.5"
                style={{ backgroundColor: "rgba(61,79,61,0.08)" }}>
                <Shield size={13} className="text-moss" />
                <span className="text-xs font-medium text-moss tracking-eyebrow uppercase">
                  Premium Verified
                </span>
              </div>
            )}

            {/* Kategoria + tagi zdrowotne */}
            {(product.categories || product.health_tags.length > 0) && (
              <div className="mb-5 flex flex-wrap gap-2">
                {product.categories && (
                  <span className="rounded-tag px-2.5 py-1 text-[11px] font-medium capitalize text-ink-muted bg-warm-island">
                    {product.categories.name}
                  </span>
                )}
                {product.health_tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-tag px-2.5 py-1 text-[11px] font-medium capitalize"
                    style={{
                      backgroundColor: `${tagColor(tag)}18`,
                      color: tagColor(tag),
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="font-serif font-normal leading-editorial text-ink text-3xl md:text-4xl lg:text-[2.75rem]">
              {product.name_seo}
            </h1>

            {product.description_seo && (
              <p className="mt-4 text-base leading-body text-ink-muted">
                {product.description_seo}
              </p>
            )}

            {/* Ocena — tylko gdy wystarczająco recenzji */}
            {reviewCount >= 5 && reviews.length > 0 && (
              <div className="mt-5 flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.round(avgStars)
                        ? "text-terracotta fill-terracotta"
                        : "text-border-warm fill-border-warm"}
                    />
                  ))}
                </div>
                <span className="text-sm text-ink-muted">
                  {avgStars.toFixed(1)} · {reviewCount} opinii właścicieli
                </span>
              </div>
            )}

            {/* Cena */}
            <div className="mt-8 pb-8 border-b border-border-warm">
              {product.price_promo !== null && product.price_promo !== undefined ? (
                <>
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <p className="font-tnum text-[2rem] font-medium text-terracotta leading-none">
                      {fmtPrice(product.price_promo)}
                    </p>
                    <p className="font-tnum text-xl text-ink-muted line-through leading-none">
                      {fmtPrice(product.price_sell)}
                    </p>
                    <span className="rounded-tag px-2.5 py-1 text-[11px] font-medium text-terracotta"
                      style={{ backgroundColor: "rgba(184,101,74,0.1)" }}>
                      -{Math.round((1 - product.price_promo / product.price_sell) * 100)}%
                    </span>
                  </div>
                  {lowestPrice30d !== null && (
                    <p className="mt-2 text-xs text-ink-subtle">
                      Najniższa cena z ostatnich 30 dni: {fmtPrice(lowestPrice30d)}
                    </p>
                  )}
                  {product.daily_price_pln && (
                    <p className="mt-1.5 text-sm text-ink-muted">
                      {fmtPrice(product.daily_price_pln)} dziennie — tyle co kawa, dla zdrowia Twojego pupila
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="font-tnum text-[2rem] font-medium text-ink leading-none">
                    {fmtPrice(product.price_sell)}
                  </p>
                  {product.daily_price_pln && (
                    <p className="mt-2 text-sm text-ink-muted">
                      {fmtPrice(product.daily_price_pln)} dziennie — tyle co kawa, dla zdrowia Twojego pupila
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Mini trust strip */}
            <div className="mt-6 flex flex-col gap-2.5">
              {[
                { icon: ShieldCheck, label: "Zweryfikowany skład — bez wypełniaczy i konserwantów" },
                { icon: BadgeCheck,  label: "Analizowane przez Kuratorów marki" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <Icon size={15} className="shrink-0 text-moss" />
                  <span className="text-sm text-ink-muted">{label}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <AddToCartButton
                disabled={!isAvailable}
                item={{
                  id: product.id,
                  slug: product.slug,
                  name: product.name_seo,
                  price: product.price_sell,
                  weight: product.usage_days ? `${product.usage_days} porcji` : "",
                  stock: product.stock,
                }}
              />
            </div>

            {/* Delivery */}
            <div className="mt-6 flex items-center gap-2 text-sm text-ink-muted">
              <Truck size={15} className="text-ink-subtle shrink-0" />
              <span>Wysyłka w 24h · Jeśli pupil nie zaakceptuje — zwrot bez pytań</span>
            </div>

            {/* Share */}
            <div className="mt-5">
              <ShareButton
                productName={product.name_seo}
                productSlug={product.slug}
                variant="product"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ── OPINIE (przed sekcją składu — wysoki priorytet) ─────────── */}
      {reviewCount >= 5 ? (
        <section className="bg-canvas">
          <div className="mx-auto max-w-editorial px-6 py-16 md:px-12 md:py-20">

            <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-12">
              <div className="md:col-span-7">
                <p className="mb-5 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
                  Opinie właścicieli
                </p>
                <h2 className="font-serif font-normal leading-editorial text-ink text-3xl md:text-4xl">
                  Co mówią właściciele<br />podobnych ras.
                </h2>
              </div>
              <div className="md:col-span-4 md:col-start-9 md:flex md:items-end">
                <p className="text-base leading-body text-ink-muted">
                  Wyświetlamy opinie filtrowane po rasie i wieku zwierzęcia — bo zdanie
                  właściciela podobnej rasy waży więcej niż anonimowe "5 gwiazdek".
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {reviews.map((review) => {
                const petProfile = review.pet_profiles
                const petLabel = petProfile
                  ? `${petProfile.pet_name}${petProfile.breed ? `, ${petProfile.breed}` : ""}`
                  : "Właściciel"
                const initial = petProfile?.pet_name?.charAt(0) ?? "?"
                const date = new Date(review.created_at).toLocaleDateString("pl-PL", {
                  month: "long", year: "numeric",
                })
                return (
                  <div key={review.id} className="bg-card-warm rounded-card-sm p-6 shadow-warm flex flex-col">
                    <div className="flex items-center gap-3 mb-5">
                      <div
                        className="shrink-0 w-10 h-10 rounded-full bg-warm-island flex items-center justify-center"
                        aria-label={`Pupil: ${petLabel}`}
                      >
                        <span className="text-sm font-medium text-ink-muted">{initial}</span>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-ink">{petLabel}</p>
                        <p className="text-[11px] text-ink-subtle mt-0.5">{date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12}
                          className={i < review.rating ? "text-terracotta fill-terracotta" : "text-border-warm fill-border-warm"}
                        />
                      ))}
                    </div>
                    <p className="text-sm leading-body text-ink flex-1">„{review.body}"</p>
                  </div>
                )
              })}
            </div>

          </div>
        </section>
      ) : (
        /* Fallback: Co mówią dane o tej formule — autorstwa Wiktora */
        <section className="bg-warm-island">
          <div className="mx-auto max-w-editorial px-6 py-16 md:px-12 md:py-20">

            <div className="grid grid-cols-1 gap-12 md:grid-cols-12">

              {/* Lewa kolumna — nagłówek + autor */}
              <div className="md:col-span-5">
                <p className="mb-5 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
                  Analiza formuły
                </p>
                <h2 className="font-serif font-normal leading-editorial text-ink text-3xl md:text-4xl">
                  Co mówią dane<br />o tej formule.
                </h2>

                {/* Wiktor jako autor sekcji */}
                <div className="mt-8 flex items-center gap-4">
                  {formulaAuthor?.ai_generated_avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={formulaAuthor.ai_generated_avatar_url}
                      alt={formulaAuthor.name}
                      className="shrink-0 w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="shrink-0 w-10 h-10 rounded-full bg-canvas flex items-center justify-center">
                      <span className="font-serif text-lg font-normal text-ink-muted">W</span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {formulaAuthor?.name ?? "Wiktor"}
                    </p>
                    <p className="text-xs text-ink-muted">
                      {formulaAuthor?.role ?? "Główny Analityk Formuł Żywieniowych"}
                    </p>
                  </div>
                </div>

                {/* Cytat Wiktora z endorsementu (jeśli istnieje) */}
                {wiktorsEndorsement && (
                  <blockquote className="mt-6 pl-4 border-l-2 border-terracotta/30 font-serif italic text-lg leading-body text-ink">
                    „{wiktorsEndorsement.quote}"
                  </blockquote>
                )}

                <p className="mt-6 flex items-start gap-2 text-xs text-ink-subtle">
                  <Info size={12} className="shrink-0 mt-0.5" />
                  Opinie od właścicieli pojawią się po zebraniu wystarczającej liczby zweryfikowanych zakupów.
                </p>
              </div>

              {/* Prawa kolumna — kluczowe składniki jako dane */}
              <div className="md:col-span-6 md:col-start-7">
                {highlightedIngredients.length > 0 ? (
                  <div className="space-y-3">
                    {highlightedIngredients.map((ing) => (
                      <div
                        key={ing.id}
                        className="bg-canvas rounded-card-sm p-5"
                      >
                        <div className="flex items-center gap-2.5 mb-2">
                          <span className="block w-1.5 h-1.5 rounded-full bg-moss shrink-0" />
                          <p className="text-sm font-medium text-ink">
                            {ing.ingredient_name}
                          </p>
                        </div>
                        {ing.ingredient_description && (
                          <p className="pl-4 text-sm leading-body text-ink-muted">
                            {ing.ingredient_description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : product.description_seo ? (
                  <p className="text-base leading-body text-ink-muted">
                    {product.description_seo}
                  </p>
                ) : (
                  <p className="text-base leading-body text-ink-muted">
                    Szczegółowa analiza składu zostanie opublikowana wkrótce przez Wiktora.
                  </p>
                )}
              </div>

            </div>
          </div>
        </section>
      )}

      {/* ── SKŁAD (Warm Education) ───────────────────────────────────── */}
      <section className={reviewCount >= 5 ? "bg-warm-island" : "bg-canvas"}>
        <div className="mx-auto max-w-editorial px-6 py-16 md:px-12 md:py-20">

          <p className="mb-5 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
            Skład i działanie
          </p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-5">
              <h2 className="font-serif font-normal leading-editorial text-ink text-3xl md:text-4xl">
                Skład rozłożony na czynniki pierwsze — bez tajemnic.
              </h2>
              <p className="mt-6 text-base leading-body text-ink-muted">
                Kliknij w składnik, żeby zobaczyć, co konkretnie robi w tej formule.
              </p>
              {product.product_ingredients.some((i) => i.is_highlighted) && (
                <div className="mt-6 flex items-center gap-2 text-xs text-moss">
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-moss/10">
                    <span className="block w-1.5 h-1.5 rounded-full bg-moss" />
                  </span>
                  Kluczowe składniki aktywne
                </div>
              )}
            </div>

            <div className="md:col-span-6 md:col-start-7 space-y-3">
              {product.product_ingredients.length > 0 ? (
                product.product_ingredients.map((ing) => (
                  <IngredientCard
                    key={ing.id}
                    name={ing.ingredient_name}
                    description={ing.ingredient_description}
                    isHighlighted={ing.is_highlighted}
                  />
                ))
              ) : (
                <p className="text-sm text-ink-subtle">
                  Szczegółowy skład pojawi się wkrótce.
                </p>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* ── CERTYFIKATY ─────────────────────────────────────────────── */}
      <ProductCertificates />

      {/* ── ENDORSEMENT KURATORA (z expert_endorsements + brand_experts) */}
      {endorsements.length > 0 && (
        <section className="bg-canvas">
          <div className="mx-auto max-w-editorial px-6 py-16 md:px-12 md:py-20">

            <p className="mb-8 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
              Rekomendacja Kuratora
            </p>

            <div className="space-y-8">
              {endorsements.map((e) => {
                const expert = e.brand_experts
                return (
                  <div key={e.id} className="grid grid-cols-1 gap-8 md:grid-cols-12">
                    <div className="md:col-span-8 md:col-start-3">

                      <blockquote className="font-serif font-normal italic leading-body text-ink text-2xl md:text-3xl">
                        „{e.quote}"
                      </blockquote>

                      {expert && (
                        <div className="mt-8 flex items-center gap-5">
                          {expert.ai_generated_avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={expert.ai_generated_avatar_url}
                              alt={expert.name}
                              className="shrink-0 w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div
                              className="shrink-0 w-12 h-12 rounded-full bg-warm-island flex items-center justify-center"
                              aria-label={`Avatar ${expert.name}`}
                            >
                              <span className="font-serif text-xl font-normal text-ink-muted">
                                {expert.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-ink">{expert.name}</p>
                            <p className="mt-0.5 text-xs text-ink-muted">{expert.role}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Link do strony kuratorów */}
            <div className="mt-10 text-center">
              <Link
                href="/eksperci"
                className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink transition-colors"
              >
                <Info size={13} className="shrink-0" />
                Kim są nasi Kuratorzy?
              </Link>
            </div>

          </div>
        </section>
      )}

      {/* ── KALKULATOR DAWKI ────────────────────────────────────────── */}
      <ProductDoseCalculator />

    </main>
  )
}
