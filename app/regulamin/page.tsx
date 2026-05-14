import type { Metadata } from "next"
import { TableOfContents } from "./table-of-contents"

export const metadata: Metadata = {
  title: "Regulamin — Nobile Pet Care",
  description: "Regulamin sklepu internetowego Nobile Pet Care. Warunki zamawiania, płatności i dostawy.",
}

const SECTIONS = [
  {
    id: "definicje",
    title: "§1. Definicje",
    content: [
      "**Sklep** — sklep internetowy prowadzony pod domeną nobilepetcare.pl przez Sprzedawcę.",
      "**Sprzedawca** — właściciel sklepu, dane kontaktowe: kontakt@nobilepetcare.pl.",
      "**Klient** — osoba fizyczna, osoba prawna lub jednostka organizacyjna nieposiadająca osobowości prawnej, która zawiera umowę sprzedaży ze Sprzedawcą.",
      "**Konsument** — Klient będący osobą fizyczną, dokonujący zakupu niezwiązanego bezpośrednio z jego działalnością gospodarczą lub zawodową.",
      "**Zamówienie** — oświadczenie woli Klienta zmierzające do zawarcia umowy sprzedaży, określające rodzaj i liczbę produktów.",
      "**Produkt** — towar dostępny w Sklepie, będący przedmiotem umowy sprzedaży.",
      "**Koszyk** — element Sklepu, w którym Klient może gromadzić wybrane Produkty przed złożeniem Zamówienia.",
    ],
  },
  {
    id: "postanowienia-ogolne",
    title: "§2. Postanowienia ogólne",
    content: [
      "Sklep prowadzi sprzedaż detaliczną produktów dla zwierząt domowych za pośrednictwem sieci Internet.",
      "Niniejszy Regulamin określa zasady korzystania ze Sklepu, składania Zamówień, dostarczania zamówionych Produktów, uiszczania płatności, uprawnień Klienta do anulowania Zamówienia i odstąpienia od umowy oraz zasady składania i rozpatrywania reklamacji.",
      "Do korzystania ze Sklepu niezbędne jest posiadanie urządzenia z dostępem do Internetu i przeglądarką internetową. Sklep nie pobiera żadnych opłat za korzystanie z treści.",
      "Klient zobowiązany jest do korzystania ze Sklepu w sposób zgodny z prawem i dobrymi obyczajami, z poszanowaniem dóbr osobistych oraz praw własności intelektualnej osób trzecich.",
    ],
  },
  {
    id: "zamowienia",
    title: "§3. Składanie i realizacja zamówień",
    content: [
      "Zamówienia można składać 24 godziny na dobę, 7 dni w tygodniu przez stronę internetową Sklepu.",
      "Złożenie Zamówienia następuje po: wybraniu Produktów i dodaniu ich do Koszyka, wypełnieniu formularza zamówienia (imię, nazwisko, adres e-mail, adres dostawy), wybraniu metody dostawy i płatności, zaakceptowaniu Regulaminu oraz kliknięciu przycisku „Zamów dla pupila”.",
      "Po złożeniu Zamówienia Klient otrzymuje e-mail potwierdzający jego przyjęcie. Umowa sprzedaży zostaje zawarta z chwilą potwierdzenia przyjęcia Zamówienia przez Sprzedawcę.",
      "Sprzedawca zastrzega sobie prawo do odmowy realizacji Zamówienia w przypadku podania przez Klienta nieprawdziwych danych, podejrzenia działania niezgodnego z Regulaminem lub niedostępności Produktu u dostawcy.",
      "Czas realizacji Zamówienia wynosi zazwyczaj 1–3 dni robocze od zaksięgowania płatności. O statusie Zamówienia Klient informowany jest e-mailem.",
    ],
  },
  {
    id: "ceny",
    title: "§4. Ceny i płatności",
    content: [
      "Wszystkie ceny podane w Sklepie są cenami brutto (zawierają podatek VAT) wyrażonymi w złotych polskich (PLN).",
      "Ceny nie zawierają kosztów dostawy. Koszt dostawy jest każdorazowo podawany w trakcie składania Zamówienia.",
      "Dostępne metody płatności: BLIK, karta kredytowa/debetowa, przelew online — realizowane za pośrednictwem systemu PayU.",
      "Płatność powinna zostać zrealizowana niezwłocznie po złożeniu Zamówienia. W przypadku braku płatności w ciągu 24 godzin Zamówienie może zostać anulowane.",
      "Sprzedawca wystawia paragon, który przesyłany jest na adres e-mail podany w zamówieniu. W celu otrzymania faktury VAT zamiast paragonu należy podać NIP podczas składania Zamówienia.",
      "Przy produktach objętych promocją cenową prezentowana jest informacja o najniższej cenie tego Produktu w ciągu ostatnich 30 dni, zgodnie z dyrektywą Omnibus.",
    ],
  },
  {
    id: "dostawa",
    title: "§5. Dostawa",
    content: [
      "Dostawa realizowana jest na terytorium Rzeczypospolitej Polskiej.",
      "Dostępne formy dostawy: InPost Paczkomat 24h oraz kurier DPD.",
      "Koszt dostawy zależy od wybranej metody i jest podawany w trakcie składania Zamówienia.",
      "Czas dostawy wynosi zazwyczaj 1–2 dni robocze od momentu nadania przesyłki.",
      "Klient zobowiązany jest do sprawdzenia stanu przesyłki przy odbiorze. W przypadku stwierdzenia uszkodzenia, Klient powinien sporządzić protokół szkody w obecności kuriera.",
    ],
  },
  {
    id: "odstapienie",
    title: "§6. Prawo odstąpienia od umowy",
    content: [
      "Konsument ma prawo odstąpić od umowy sprzedaży zawartej na odległość bez podawania przyczyn w terminie 14 dni od dnia otrzymania Produktu.",
      "Oświadczenie o odstąpieniu należy złożyć pisemnie na adres e-mail: kontakt@nobilepetcare.pl lub za pomocą formularza dostępnego na stronie /zwroty.",
      "Zwracany Produkt powinien być odesłany w stanie niezmienionym, kompletny, w oryginalnym opakowaniu, niezwłocznie, nie później niż w ciągu 14 dni od dnia złożenia oświadczenia o odstąpieniu.",
      "Sprzedawca zwróci Klientowi wszystkie płatności, w tym koszt najtańszej dostępnej metody dostawy, w ciągu 14 dni od dnia otrzymania oświadczenia o odstąpieniu. Zwrot nastąpi na rachunek bankowy, z którego dokonano płatności.",
      "Koszty zwrotu Produktu do Sklepu ponosi Klient.",
      "Prawo odstąpienia od umowy nie przysługuje w odniesieniu do: Produktów szybko psujących się lub mających krótki termin przydatności, Produktów dostarczanych w zapieczętowanym opakowaniu, których po otwarciu nie można zwrócić ze względów higienicznych.",
    ],
  },
  {
    id: "reklamacje-short",
    title: "§7. Reklamacje",
    content: [
      "Sprzedawca odpowiada wobec Konsumenta za wady fizyczne i prawne sprzedanego Produktu na zasadach określonych w Kodeksie cywilnym (rękojmia).",
      "Reklamację należy złożyć e-mailem na adres kontakt@nobilepetcare.pl lub za pomocą formularza dostępnego na stronie /reklamacje.",
      "Sprzedawca rozpatruje reklamację w terminie 14 dni od jej otrzymania. Brak odpowiedzi w tym terminie oznacza uznanie reklamacji za zasadną.",
      "Szczegółowe zasady składania reklamacji dostępne są na stronie /reklamacje.",
    ],
  },
  {
    id: "dane-osobowe",
    title: "§8. Ochrona danych osobowych",
    content: [
      "Administratorem danych osobowych Klientów jest Sprzedawca.",
      "Dane osobowe przetwarzane są wyłącznie w celu realizacji Zamówień, obsługi konta i ewentualnych reklamacji.",
      "Szczegółowe informacje dotyczące przetwarzania danych osobowych zawarte są w Polityce Prywatności dostępnej na stronie /polityka-prywatnosci.",
    ],
  },
  {
    id: "postanowienia-koncowe",
    title: "§9. Postanowienia końcowe",
    content: [
      "W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie mają przepisy prawa polskiego, w szczególności: Kodeksu cywilnego, ustawy o świadczeniu usług drogą elektroniczną, ustawy o prawach konsumenta.",
      "Sprzedawca zastrzega sobie prawo do zmian w Regulaminie. Zamówienia złożone przed datą wejścia w życie zmian realizowane są na dotychczasowych zasadach.",
      "Wszelkie spory między Sprzedawcą a Konsumentem rozstrzygane są przez sąd właściwy dla miejsca zamieszkania Konsumenta. Konsument może skorzystać z pozasądowych sposobów rozpatrywania reklamacji i dochodzenia roszczeń (platforma ODR: ec.europa.eu/consumers/odr).",
      "Regulamin obowiązuje od dnia 01.06.2026.",
    ],
  },
]

function bold(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-medium text-ink">{part}</strong> : part
  )
}

export default function RegulaMinPage() {
  return (
    <main className="bg-canvas">

      <section className="mx-auto max-w-editorial px-6 pt-20 pb-12 md:px-12 md:pt-32 md:pb-16">
        <p className="mb-8 text-xs font-medium tracking-eyebrow text-ink-muted uppercase">
          Dokumenty prawne
        </p>
        <h1 className="font-serif font-normal leading-editorial text-ink text-5xl md:text-6xl">
          Regulamin
        </h1>
        <p className="mt-6 text-sm text-ink-subtle">
          Wersja z dnia 01.06.2026
        </p>
      </section>

      <section className="bg-canvas">
        <div className="mx-auto max-w-editorial px-6 pb-24 md:px-12 md:pb-32">
          <div className="grid grid-cols-1 gap-0 md:grid-cols-12">

            <TableOfContents sections={SECTIONS} />

            {/* Treść */}
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
