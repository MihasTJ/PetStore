import { ShieldCheck, BadgeCheck, RotateCcw, Truck } from "lucide-react";

const signals = [
  {
    icon: ShieldCheck,
    headline: "Skład zweryfikowany weterynaryjnie",
    sub: "Każdy produkt przeszedł weryfikację eksperta przed trafieniem do sklepu",
  },
  {
    icon: BadgeCheck,
    headline: "Polecane przez specjalistów",
    sub: "Weterynarze stosują te produkty u własnych pacjentów",
  },
  {
    icon: RotateCcw,
    headline: "Zwrot bez pytań — 30 dni",
    sub: "Jeśli pupil nie zaakceptuje produktu, zwracamy pełną kwotę",
  },
  {
    icon: Truck,
    headline: "Dostawa ubezpieczona",
    sub: "Każde zamówienie pakowane z troską i ubezpieczone w transporcie",
  },
];

export function TrustStrip() {
  return (
    <section className="bg-warm-island border-t border-border-warm">
      <div className="mx-auto max-w-editorial px-6 py-10 md:px-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {signals.map(({ icon: Icon, headline, sub }) => (
            <div key={headline} className="flex items-start gap-3">
              <Icon
                size={20}
                className="mt-0.5 shrink-0 text-moss"
              />
              <div>
                <p className="text-sm font-medium text-ink">{headline}</p>
                <p className="mt-1 text-xs leading-body text-ink-muted">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
