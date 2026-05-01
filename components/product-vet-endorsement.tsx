import { ShieldCheck } from "lucide-react";

export function ProductVetEndorsement() {
  return (
    <section className="bg-canvas">
      <div className="mx-auto max-w-editorial px-6 py-16 md:px-12 md:py-20">

        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-8 md:col-start-3">

            <p className="mb-8 inline-flex items-center gap-2 text-xs font-medium tracking-eyebrow text-moss uppercase">
              <ShieldCheck size={14} />
              Rekomenduje ekspert
            </p>

            <blockquote className="font-serif font-normal italic leading-body text-ink text-2xl md:text-3xl">
              „Ten skład jest jednym z najbardziej transparentnych, jakie widziałam
              w suplementach dla psów dużych ras. Polecam szczególnie psim seniorom
              z predyspozycją do problemów stawowych — naturalny, bez wypełniaczy,
              bezpieczny przy długotrwałym stosowaniu."
            </blockquote>

            <div className="mt-10 flex items-center gap-5">
              <div
                className="shrink-0 w-14 h-14 rounded-full bg-warm-island flex items-center justify-center overflow-hidden"
                aria-label="Zdjęcie weterynarza"
              >
                <p className="text-[8px] text-center leading-snug text-ink-subtle px-1">
                  Realne zdjęcie weterynarza w gabinecie
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-ink">
                  dr n. wet. Anna Kowalska
                </p>
                <p className="mt-0.5 text-xs leading-body text-ink-muted">
                  Specjalistka ds. żywienia zwierząt, Klinika Weterynaryjna Varsovia, Warszawa
                </p>
              </div>
            </div>

          </div>
        </div>

        <p className="mt-14 text-xs text-center text-ink-subtle">
          Opinia eksperta dotyczy konkretnego produktu. Skonsultuj z weterynarzem swojego pupila, czy ten suplement jest odpowiedni dla jego indywidualnych potrzeb.
        </p>

      </div>
    </section>
  );
}
