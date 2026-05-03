import Link from "next/link";
import { ShieldCheck, Award, Stethoscope } from "lucide-react";

const shopLinks = [
  { label: "Produkty", href: "/produkty" },
  { label: "Dlaczego Premium?", href: "/dlaczego-premium" },
  { label: "AI Quiz zdrowotny", href: "/quiz" },
  { label: "Nasi eksperci", href: "/eksperci" },
  { label: "Certyfikaty", href: "/certyfikaty" },
];

const infoLinks = [
  { label: "Regulamin", href: "/regulamin" },
  { label: "Polityka prywatności", href: "/polityka-prywatnosci" },
  { label: "Zwroty i reklamacje", href: "/zwroty" },
  { label: "Kontakt", href: "/kontakt" },
];

const accountLinks = [
  { label: "Zaloguj się", href: "/konto/logowanie" },
  { label: "Mój profil", href: "/konto" },
  { label: "Moje alerty", href: "/konto/alerty" },
  { label: "Historia zakupów", href: "/konto" },
];

const trustSignals = [
  { icon: ShieldCheck, label: "Skład weryfikowany przez weterynarzy" },
  { icon: Award, label: "Certyfikaty weterynaryjne widoczne przy każdym produkcie" },
  { icon: Stethoscope, label: "Polecane przez specjalistów, sprawdzone na składnikach" },
];

export function Footer() {
  return (
    <footer className="bg-warm-island border-t border-border-warm mt-auto">
      {/* Główna sekcja */}
      <div className="mx-auto max-w-shell px-6 md:px-12 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 md:gap-8 lg:gap-16">

          {/* Kolumna brandu */}
          <div className="max-w-xs">
            <Link
              href="/"
              className="font-serif text-xl text-ink tracking-tight"
            >
              Nobile
            </Link>
            <p className="mt-4 text-sm text-ink-muted leading-body">
              Bo Twój pupil jest członkiem rodziny — i zasługuje na to, co najlepsze.
            </p>
            <Link
              href="/quiz"
              className="inline-block mt-6 text-sm text-terracotta hover:text-terracotta-hover transition-colors border-b border-terracotta/40 hover:border-terracotta pb-0.5"
            >
              Nie wiesz, od czego zacząć? Quiz zdrowotny zajmie 3 minuty.
            </Link>
          </div>

          {/* Kolumna: Sklep */}
          <div>
            <p className="text-[11px] font-medium text-ink-subtle tracking-eyebrow uppercase mb-5">
              Sklep
            </p>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-muted hover:text-ink transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolumna: Informacje */}
          <div>
            <p className="text-[11px] font-medium text-ink-subtle tracking-eyebrow uppercase mb-5">
              Informacje
            </p>
            <ul className="space-y-3">
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-muted hover:text-ink transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolumna: Konto */}
          <div>
            <p className="text-[11px] font-medium text-ink-subtle tracking-eyebrow uppercase mb-5">
              Konto
            </p>
            <ul className="space-y-3">
              {accountLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-muted hover:text-ink transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust signals */}
        <div className="mt-14 pt-8 border-t border-border-warm grid grid-cols-1 sm:grid-cols-3 gap-5">
          {trustSignals.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="shrink-0 w-8 h-8 rounded-tag bg-moss/9 flex items-center justify-center">
                <Icon size={15} className="text-moss" />
              </div>
              <span className="text-xs text-ink-muted leading-snug">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pasek prawny */}
      <div className="border-t border-border-warm">
        <div className="mx-auto max-w-shell px-6 md:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-ink-subtle">
            &copy; {new Date().getFullYear()} Nobile. Wszelkie prawa zastrzeżone.
          </p>
          <p className="text-xs text-ink-subtle text-center sm:text-right">
            Raporty zdrowotne mają charakter informacyjny — najlepszą diagnozę postawi weterynarz Twojego pupila.
          </p>
        </div>
      </div>
    </footer>
  );
}
