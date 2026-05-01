import { TrustStrip } from "@/components/trust-strip";
import { ProductListing } from "@/components/product-listing";

export default function Home() {
  return (
    <main className="min-h-screen bg-canvas">
      <section className="mx-auto max-w-editorial px-6 pt-20 pb-24 md:px-12 md:pt-32 md:pb-40">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16 lg:gap-24">
          <div className="md:col-span-7 lg:col-span-6 md:pt-12 lg:pt-20">
            <p className="mb-8 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
              Premium Pet Care
            </p>

            <h1 className="font-serif font-medium leading-editorial text-ink text-5xl md:text-6xl lg:text-7xl">
              Twój pupil zasługuje<br />
              na to, co najlepsze.
            </h1>

            <p className="mt-10 max-w-md text-lg leading-body text-ink-muted">
              Zacznij dbać o jego zdrowie, zanim pojawi się problem — z produktami,
              które wybierają weterynarze, i ze spokojem ducha, który zostaje na lata.
            </p>

            <div className="mt-12">
              <a
                href="#produkty"
                className="inline-flex items-center justify-center rounded-button bg-terracotta px-8 py-4 text-base font-medium text-card-warm transition-colors hover:bg-terracotta-hover"
              >
                Sprawdź, co polecamy
              </a>
            </div>
          </div>

          <div className="md:col-span-5 lg:col-start-8 lg:col-span-5">
            <div className="aspect-[4/5] w-full rounded-[6px] bg-warm-island flex items-center justify-center px-8">
              <p className="text-center text-sm leading-body text-ink-subtle italic">
                [ Placeholder na zdjęcie ]<br />
                <span className="not-italic">
                  Realny pies lub kot w domowym kontekście — kuchnia, kanapa, parapet.
                  Naturalne światło z okna, ciepła korekcja, lekkie ziarno.
                  Fragment dłoni właściciela (sweter, kąt mebla) — nigdy całej twarzy.
                  Format pionowy 4:5.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip />
      <ProductListing />
    </main>
  );
}
