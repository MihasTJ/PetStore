import { ProductCard, type Product } from "./product-card";

const products: Product[] = [
  {
    id: 1,
    slug: "suplement-stawy-glukozamina-kolagen",
    name: "Suplement na stawy z glukozaminą i kolagenem",
    description:
      "Dla psów od 5. roku życia predysponowanych do problemów stawowych. Naturalny skład, bez wypełniaczy — wstanie rano bez bólu.",
    price: "89,00 zł",
    weight: "250 g / ok. 3 miesiące",
    healthTags: ["joints"],
    isPremiumVerified: true,
    hasVetEndorsement: true,
  },
  {
    id: 2,
    slug: "karma-premium-losos-norweski-kot",
    name: "Karma premium z norweskiego łososia",
    description:
      "Pełnowartościowy posiłek bez kompromisów w składzie. Kwasy omega-3 dla zdrowej sierści i elastycznej skóry kota.",
    price: "64,00 zł",
    weight: "400 g",
    healthTags: ["coat", "gut"],
    isPremiumVerified: true,
    hasVetEndorsement: true,
  },
  {
    id: 3,
    slug: "probiotyk-jelitowy-wrazliwe-koty",
    name: "Probiotyk jelitowy dla wrażliwych kotów",
    description:
      "Przywraca równowagę mikrobioty w 14 dni. Bezpieczny po antybiotykoterapii i przy zmianie diety.",
    price: "72,00 zł",
    weight: "60 kapsułek",
    healthTags: ["gut"],
    isPremiumVerified: false,
    hasVetEndorsement: true,
  },
];

export function ProductListing() {
  return (
    <section id="produkty" className="bg-canvas">
      <div className="mx-auto max-w-editorial px-6 py-20 md:px-12 md:py-28">

        {/* Section header */}
        <div className="mb-14 md:mb-16">
          <p className="mb-5 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
            Dla twojego pupila
          </p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <h2 className="font-serif font-normal leading-editorial text-ink text-4xl md:text-5xl">
                Tylko produkty z weryfikacją
                <br />
                weterynaryjną. Żadnych kompromisów ze składem.
              </h2>
            </div>
            <div className="md:col-span-4 md:col-start-9 md:flex md:items-end">
              <p className="text-base leading-body text-ink-muted">
                Każdy produkt w naszym sklepie przeszedł
                weryfikację składu przez weterynarza.
                Zamawiasz z wiedzą, że to naprawdę bezpieczne.
              </p>
            </div>
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

      </div>
    </section>
  );
}
