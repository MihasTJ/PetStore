import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Polityka prywatności — Nobile Pet Care",
  description: "Informacje o przetwarzaniu danych osobowych w sklepie Nobile Pet Care. Twoje prawa, pliki cookie, bezpieczeństwo danych.",
}

const SECTIONS = [
  {
    id: "administrator",
    title: "1. Administrator danych",
    content: [
      `Administratorem danych osobowych zbieranych za pośrednictwem Sklepu jest właściciel sklepu Nobile Pet Care (dalej: „Administrator”), dostępny pod adresem e-mail: kontakt@nobilepetcare.pl.`,
      "W sprawach dotyczących ochrony danych osobowych można skontaktować się z Administratorem pod adresem: kontakt@nobilepetcare.pl.",
    ],
  },
  {
    id: "jakie-dane",
    title: "2. Jakie dane zbieramy",
    content: [
      "**Dane podawane przy zamówieniu:** imię, nazwisko, adres e-mail, adres dostawy, numer NIP (opcjonalnie, do faktury VAT).",
      "**Dane konta klienta (opcjonalne):** jak wyżej, a ponadto profil pupila (imię, gatunek, rasa, wiek, waga, notatki zdrowotne).",
      "**Dane z AI Quizu zdrowotnego:** informacje o pupilu wypełniane dobrowolnie w quizie (gatunek, rasa, wiek, aktywność, dieta, obserwowane objawy). Dane te przetwarzane są wyłącznie w celu wygenerowania personalizowanego raportu informacyjnego.",
      "**Dane techniczne:** adres IP, dane przeglądarki i systemu operacyjnego, historia wizyt (wyłącznie w zagregowanej formie do analizy ruchu).",
    ],
  },
  {
    id: "cel",
    title: "3. Cel i podstawa przetwarzania",
    content: [
      "**Realizacja zamówień** — przetwarzanie niezbędne do wykonania umowy sprzedaży (art. 6 ust. 1 lit. b RODO).",
      "**Prowadzenie konta klienta** — przetwarzanie niezbędne do wykonania umowy o świadczenie usług drogą elektroniczną (art. 6 ust. 1 lit. b RODO).",
      "**Generowanie raportów zdrowotnych z AI Quizu** — zgoda Klienta wyrażona przed przystąpieniem do quizu (art. 6 ust. 1 lit. a RODO). Raport ma charakter informacyjny i nie stanowi porady weterynaryjnej.",
      "**Obsługa reklamacji i zwrotów** — wypełnienie obowiązku prawnego (art. 6 ust. 1 lit. c RODO).",
      "**Wystawianie faktur VAT** — wypełnienie obowiązku prawnego (art. 6 ust. 1 lit. c RODO).",
      "**Marketing bezpośredni (newsletter)** — zgoda Klienta (art. 6 ust. 1 lit. a RODO). Możliwość wypisania się w każdej chwili jednym kliknięciem.",
      "**Analiza statystyczna ruchu** — prawnie uzasadniony interes Administratora (art. 6 ust. 1 lit. f RODO), wyłącznie dane zagregowane.",
    ],
  },
  {
    id: "czas-przechowywania",
    title: "4. Czas przechowywania danych",
    content: [
      "Dane związane z zamówieniami przechowywane są przez okres 5 lat od końca roku kalendarzowego, w którym dokonano zakupu (wymogi podatkowe).",
      "Dane konta klienta przechowywane są do momentu usunięcia konta lub złożenia żądania usunięcia danych, nie dłużej niż 5 lat od ostatniej aktywności.",
      "Dane z AI Quizu powiązane z kontem przechowywane są razem z profilem pupila. W przypadku usunięcia konta są usuwane.",
      "Dane marketingowe (zgody na newsletter) przechowywane są do momentu wycofania zgody.",
    ],
  },
  {
    id: "odbiorcy",
    title: "5. Odbiorcy danych",
    content: [
      "Dane osobowe Klientów mogą być przekazywane wyłącznie podmiotom niezbędnym do realizacji usługi: operatorowi płatności PayU S.A. (przetwarzanie płatności), firmom kurierskim InPost S.A. i DPD Polska (dostawa), platformie Supabase Inc. (infrastruktura bazy danych i hostingu) — wyłącznie w zakresie koniecznym do świadczenia usługi.",
      "Administrator nie sprzedaje danych osobowych Klientów podmiotom trzecim.",
      "Administrator nie przekazuje danych do podmiotów ubezpieczeniowych, weterynaryjnych ani reklamowych bez wyraźnej zgody Klienta.",
      "Dane mogą być przekazywane do państw trzecich (poza EOG) wyłącznie na podstawie odpowiednich zabezpieczeń (standardowe klauzule umowne). Dotyczy to Supabase Inc. (USA).",
    ],
  },
  {
    id: "prawa",
    title: "6. Twoje prawa",
    content: [
      "**Prawo dostępu** — możesz zażądać informacji o przetwarzanych przez nas danych osobowych.",
      "**Prawo do sprostowania** — możesz żądać poprawienia nieprawidłowych lub niekompletnych danych.",
      `**Prawo do usunięcia** — możesz żądać usunięcia danych („prawo do bycia zapomnianym"), z wyjątkiem danych wymaganych przepisami prawa.`,
      "**Prawo do ograniczenia przetwarzania** — możesz żądać ograniczenia przetwarzania danych w określonych przypadkach.",
      "**Prawo do przenoszenia danych** — możesz otrzymać swoje dane w ustrukturyzowanym formacie.",
      "**Prawo do sprzeciwu** — możesz sprzeciwić się przetwarzaniu opartemu na prawnie uzasadnionym interesie (np. analityka).",
      "**Prawo do cofnięcia zgody** — w każdej chwili, bez wpływu na zgodność z prawem przetwarzania przed jej cofnięciem.",
      "Aby skorzystać z powyższych praw, skontaktuj się pod adresem: kontakt@nobilepetcare.pl. Odpowiedź zostanie udzielona w ciągu 30 dni.",
      "Masz prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (UODO), ul. Stawki 2, 00-193 Warszawa.",
    ],
  },
  {
    id: "cookies",
    title: "7. Pliki cookie",
    content: [
      "Sklep używa plików cookie niezbędnych do działania (sesja, koszyk) oraz analitycznych (Google Analytics, Vercel Analytics) — wyłącznie po wyrażeniu zgody.",
      "Cookie sesji i koszyka są technicznie niezbędne i nie wymagają zgody.",
      "Cookie analityczne można zaakceptować lub odrzucić za pomocą banera cookie wyświetlanego przy pierwszej wizycie.",
      "Możesz w każdej chwili zmienić ustawienia cookie w przeglądarce lub wycofać zgodę.",
    ],
  },
  {
    id: "bezpieczenstwo",
    title: "8. Bezpieczeństwo danych",
    content: [
      "Wszystkie dane przesyłane są szyfrowanym połączeniem HTTPS.",
      "Dostęp do danych osobowych w bazie danych chroniony jest polityką Row Level Security — każdy użytkownik widzi wyłącznie swoje dane.",
      "Dane płatnicze przetwarzane są wyłącznie przez PayU S.A. Sprzedawca nie przechowuje numerów kart płatniczych.",
      "W przypadku naruszenia ochrony danych Administrator poinformuje UODO w ciągu 72 godzin, a Klientów — niezwłocznie po stwierdzeniu naruszenia, jeśli może ono powodować wysokie ryzyko dla ich praw.",
    ],
  },
  {
    id: "zmiany",
    title: "9. Zmiany polityki prywatności",
    content: [
      "Administrator zastrzega sobie prawo do zmian niniejszej Polityki prywatności. Zmiany wchodzą w życie z dniem opublikowania na stronie.",
      "O istotnych zmianach Klienci posiadający konto będą informowani e-mailem.",
      "Polityka prywatności obowiązuje od dnia 01.06.2026.",
    ],
  },
]

function bold(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-medium text-ink">{part}</strong> : part
  )
}

export default function PolitykaPrywatnosciPage() {
  return (
    <main className="bg-canvas">

      <section className="mx-auto max-w-editorial px-6 pt-20 pb-12 md:px-12 md:pt-32 md:pb-16">
        <p className="mb-8 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
          Dokumenty prawne
        </p>
        <h1 className="font-serif font-normal leading-editorial text-ink text-5xl md:text-6xl">
          Polityka<br />prywatności
        </h1>
        <p className="mt-6 text-sm text-ink-subtle">
          Wersja z dnia 01.06.2026
        </p>
      </section>

      <section className="bg-canvas">
        <div className="mx-auto max-w-editorial px-6 pb-24 md:px-12 md:pb-32">
          <div className="grid grid-cols-1 gap-0 md:grid-cols-12">

            <nav className="hidden md:block md:col-span-3 md:pr-8" aria-label="Spis treści">
              <div className="sticky top-28">
                <p className="mb-4 text-[11px] font-medium tracking-eyebrow text-ink-muted uppercase">
                  Spis treści
                </p>
                <ul className="flex flex-col gap-2">
                  {SECTIONS.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="text-xs text-ink-subtle hover:text-ink transition-colors leading-relaxed"
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>

            <div className="md:col-span-8 md:col-start-5 space-y-12">
              {SECTIONS.map((s) => (
                <div key={s.id} id={s.id} className="scroll-mt-28">
                  <h2 className="font-serif font-normal text-2xl text-ink mb-5 leading-snug">
                    {s.title}
                  </h2>
                  <ol className="flex flex-col gap-4 list-none">
                    {s.content.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="shrink-0 mt-0.5 font-tnum text-[11px] text-ink-subtle w-5 text-right">
                          {i + 1}.
                        </span>
                        <p className="text-sm leading-body text-ink-muted">{bold(item)}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

    </main>
  )
}
