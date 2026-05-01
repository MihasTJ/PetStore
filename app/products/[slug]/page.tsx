import { ShoppingBag, Star, Shield, Truck } from "lucide-react";
import { ProductCertificates } from "@/components/product-certificates";
import { ProductVetEndorsement } from "@/components/product-vet-endorsement";
import { ProductDoseCalculator } from "@/components/product-dose-calculator";

// Mock — docelowo dane z Supabase przez params.slug
const product = {
  name: "Suplement stawowy Senior+ dla psa",
  subtitle: "Glukozamina, MSM i kolagen — naturalna ochrona stawów dużych ras",
  price: "149,00 zł",
  priceNote: "Wystarczy na 3 miesiące — ok. 1,66 zł dziennie",
  rating: 4.8,
  reviewCount: 127,
  isAvailable: true,
  isPremiumVerified: true,
  healthTags: ["Stawy", "Senior", "Duże rasy"],
  ingredients: [
    {
      name: "Glukozamina HCl",
      amount: "500 mg",
      description:
        "Wspomaga regenerację chrząstki stawowej i spowalnia jej degradację — kluczowa dla psów po 5. roku życia.",
    },
    {
      name: "MSM (metylosulfonylometan)",
      amount: "250 mg",
      description:
        "Naturalny związek siarki o działaniu przeciwzapalnym — redukuje sztywność po przebudzeniu.",
    },
    {
      name: "Kolagen typ II",
      amount: "100 mg",
      description:
        "Wspiera elastyczność tkanki łącznej i spowalnia procesy zwyrodnieniowe stawów.",
    },
    {
      name: "Omega-3 (EPA+DHA)",
      amount: "200 mg",
      description:
        "Tłuszcze z oleju ryb zimnomorskich — działanie przeciwzapalne, wsparcie dla stawów i sierści.",
    },
  ],
};

const tagColors: Record<string, string> = {
  Stawy: "#A87B5C",
  Senior: "#9C5447",
  "Duże rasy": "#7A6E5A",
};

export default function ProductPage() {
  return (
    <main className="bg-canvas">

      {/* ── HERO PRODUKTU ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-shell px-6 py-16 md:px-12 md:py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">

          {/* Galeria */}
          <div className="md:col-span-5">
            <div className="aspect-square w-full rounded-[6px] bg-warm-island flex items-center justify-center px-8">
              <p className="text-center text-sm leading-body text-ink-subtle italic">
                [ Zdjęcie lifestyle ]<br />
                <span className="not-italic text-xs">
                  Produkt w naturalnym otoczeniu — blat, pies w tle.
                  Naturalne światło. Format 1:1.
                </span>
              </p>
            </div>

            {/* Miniatury */}
            <div className="mt-3 grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-field bg-warm-island/70 flex items-center justify-center"
                >
                  <span className="text-[10px] text-ink-subtle">{i}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info produktu */}
          <div className="md:col-span-6 md:col-start-7">

            {/* Trust badge */}
            {product.isPremiumVerified && (
              <div className="mb-6 inline-flex items-center gap-2 rounded-tag px-3 py-1.5"
                style={{ backgroundColor: "rgba(61,79,61,0.08)" }}>
                <Shield size={13} className="text-moss" />
                <span className="text-xs font-medium text-moss tracking-eyebrow uppercase">
                  Premium Verified
                </span>
              </div>
            )}

            {/* Tagi zdrowotne */}
            <div className="mb-5 flex flex-wrap gap-2">
              {product.healthTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-tag px-2.5 py-1 text-[11px] font-medium"
                  style={{
                    backgroundColor: `${tagColors[tag] ?? "#A87B5C"}18`,
                    color: tagColors[tag] ?? "#A87B5C",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="font-serif font-normal leading-editorial text-ink text-3xl md:text-4xl lg:text-[2.75rem]">
              {product.name}
            </h1>
            <p className="mt-4 text-base leading-body text-ink-muted">
              {product.subtitle}
            </p>

            {/* Ocena */}
            <div className="mt-5 flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.round(product.rating) ? "text-terracotta fill-terracotta" : "text-border-warm fill-border-warm"}
                  />
                ))}
              </div>
              <span className="text-sm text-ink-muted">
                {product.rating} · {product.reviewCount} opinii właścicieli
              </span>
            </div>

            {/* Cena */}
            <div className="mt-8 pb-8 border-b border-border-warm">
              <p className="font-tnum text-[2rem] font-medium text-ink leading-none">
                {product.price}
              </p>
              <p className="mt-2 text-sm text-ink-muted">{product.priceNote}</p>
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                disabled={!product.isAvailable}
                className="inline-flex items-center justify-center gap-2 rounded-button bg-terracotta px-8 py-4 text-base font-medium text-card-warm transition-colors hover:bg-terracotta-hover disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={17} />
                Dodaj dla pupila
              </button>
            </div>

            {/* Delivery trust */}
            <div className="mt-6 flex items-center gap-2 text-sm text-ink-muted">
              <Truck size={15} className="text-ink-subtle shrink-0" />
              <span>Wysyłka w 24h · Darmowy zwrot w 30 dni bez pytań</span>
            </div>

          </div>
        </div>
      </section>

      {/* ── SKŁAD (Warm Education) ───────────────────────────────────── */}
      <section className="bg-warm-island">
        <div className="mx-auto max-w-editorial px-6 py-16 md:px-12 md:py-20">

          <p className="mb-5 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
            Skład i działanie
          </p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-5">
              <h2 className="font-serif font-normal leading-editorial text-ink text-3xl md:text-4xl">
                Każdy składnik<br />
                jest tu z powodu.
              </h2>
              <p className="mt-6 text-base leading-body text-ink-muted">
                Żadnych wypełniaczy, żadnych substancji "dla objętości".
                Każdy składnik ma konkretne, udokumentowane działanie dla zdrowia stawów.
              </p>
            </div>

            <div className="md:col-span-6 md:col-start-7 space-y-4">
              {product.ingredients.map((ing) => (
                <div
                  key={ing.name}
                  className="bg-card-warm rounded-card-sm p-5 shadow-warm"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <p className="text-sm font-medium text-ink">{ing.name}</p>
                    <span className="shrink-0 font-tnum text-xs text-ink-subtle bg-warm-island rounded-tag px-2 py-1">
                      {ing.amount}
                    </span>
                  </div>
                  <p className="text-[13px] leading-body text-ink-muted">
                    {ing.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── CERTYFIKATY ─────────────────────────────────────────────── */}
      <ProductCertificates />

      {/* ── ENDORSEMENT WETERYNARZA ─────────────────────────────────── */}
      <ProductVetEndorsement />

      {/* ── KALKULATOR DAWKI ────────────────────────────────────────── */}
      <ProductDoseCalculator />

      {/* ── RECENZJE (placeholder) ──────────────────────────────────── */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-editorial px-6 py-16 md:px-12 md:py-20">

          <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <p className="mb-5 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
                Opinie właścicieli
              </p>
              <h2 className="font-serif font-normal leading-editorial text-ink text-3xl md:text-4xl">
                Co mówią właściciele<br />
                podobnych ras.
              </h2>
            </div>
            <div className="md:col-span-4 md:col-start-9 md:flex md:items-end">
              <p className="text-base leading-body text-ink-muted">
                Wyświetlamy opinie filtrowane po rasie i wieku zwierzęcia — bo zdanie
                właściciela golden retrievera waży więcej niż anonimowe "5 gwiazdek".
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[
              {
                pet: "Max, golden retriever, 8 lat",
                text: "Po 6 tygodniach Max wstaje rano bez tej charakterystycznej sztywności. Nie spodziewałam się tak szybkiego efektu.",
                author: "Karolina W.",
              },
              {
                pet: "Bruno, labrador, 7 lat",
                text: "Skład jest jednym z bardziej transparentnych na rynku — to był główny powód zakupu. Bruno toleruje bez problemu.",
                author: "Tomasz K.",
              },
              {
                pet: "Simba, owczarek, 9 lat",
                text: "Weterynarz sam polecił ten produkt po obejrzeniu składu. Nie ma tu niczego zbędnego.",
                author: "Marta R.",
              },
            ].map((review) => (
              <div
                key={review.author}
                className="bg-card-warm rounded-card-sm p-6 shadow-warm flex flex-col"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} className="text-terracotta fill-terracotta" />
                  ))}
                </div>
                <p className="text-sm leading-body text-ink flex-1 mb-5">
                  „{review.text}"
                </p>
                <div className="pt-4 border-t border-border-warm">
                  <p className="text-xs font-medium text-ink">{review.author}</p>
                  <p className="text-[11px] text-ink-subtle mt-0.5">{review.pet}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </main>
  );
}
