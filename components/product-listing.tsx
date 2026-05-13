import { ProductCard } from "./product-card"
import { getProducts } from "@/lib/supabase/queries/products"

function fmtPrice(n: number) {
  return n.toFixed(2).replace(".", ",") + " zł"
}

export async function ProductListing() {
  let products: Awaited<ReturnType<typeof getProducts>> = []

  try {
    products = await getProducts({ limit: 6 })
  } catch {
    return null
  }

  if (!products || products.length === 0) return null

  return (
    <section id="produkty" className="bg-canvas">
      <div className="mx-auto max-w-editorial px-3 py-10 sm:px-6 sm:py-20 md:px-12 md:py-28">

        {/* Section header */}
        <div className="mb-14 md:mb-16">
          <p className="mb-5 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
            Dla twojego pupila
          </p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <h2 className="font-serif font-normal leading-editorial text-ink text-4xl md:text-5xl">
                Tylko produkty z weryfikacją<br />
                składu. Żadnych kompromisów.
              </h2>
            </div>
            <div className="md:col-span-4 md:col-start-9 md:flex md:items-end">
              <p className="text-base leading-body text-ink-muted">
                Każdy produkt w naszym sklepie przeszedł
                analizę składu przez Kuratorów marki.
                Zamawiasz z wiedzą, że to naprawdę bezpieczne.
              </p>
            </div>
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
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
              healthTags={product.health_tags}
              isPremiumVerified={product.is_premium_verified}
              hasExpertEndorsement={(product.expert_tags ?? []).length > 0}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
