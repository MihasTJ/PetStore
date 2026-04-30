# Design Guide — Premium Pet Care

**Wersja:** 1.0
**Data:** kwiecień 2026
**Primary persona:** Anna (Pet Mama, średnie dochody, wrażliwa na autentyczność)
**Brand split:** 60% Editorial Warm Premium / 25% Warm Education / 15% Stonowana Tech-Wellness

---

## 1. Filozofia designu

Sklep nie sprzedaje produktów dla zwierząt. Sprzedaje **spokój ducha właścicielom, którzy traktują pupila jak członka rodziny**. Każda decyzja wizualna podporządkowana jest jednej grupie pytań klientki: „Czy to jest bezpieczne dla mojego pupila? Czy daję mu to, co najlepsze? Czy ten sklep mnie rozumie?".

Trzy słowa, które opisują styl:

- **Ciepło** — beż, terakota, naturalne światło, fragmenty domowych kontekstów. Nic klinicznego, nic stockowego.
- **Spokój** — dużo whitespace'u, asymetria zamiast siatki, oszczędność słów. Premium nie krzyczy.
- **Autentyczność** — realne zdjęcia od klientów, imiona pupili w mikrokopii, recenzje filtrowane po rasie. Zero generycznych pet-shop wzorców.

**Inspiracje:** Aesop i Le Labo (editorial premium, paleta, typografia), The Farmer's Dog (pet-native ciepło, edukacja), Hims/Whoop (subtelnie — tylko w sekcjach AI Quiz i raporty zdrowotne).

**Anty-inspiracje (czego NIE robimy):** Zooplus, PetSmart, Pupil.pl (pet-shop generyczność), Chewy (zatłoczenie, kupony), Apple czysty (zbyt klinicznie chłodny dla emocjonalnej decyzji).

### Brand split — trzy strefy ekranów

Każdy ekran w sklepie należy do jednej z trzech stref. Strefa decyduje o estetyce.

| Strefa | Udział | Gdzie | Wibe |
|---|---|---|---|
| **Editorial Warm Premium** | 60% | Landing, kategorie, hero, footer, część emocjonalna strony produktu | Aesop / Le Labo — beż, serify, dużo światła |
| **Warm Education** | 25% | „Dlaczego Premium?", breakdown składu, „Co mówi weterynarz", artykuły, recenzje | The Farmer's Dog — cieplejsze tła, ilustracje, więcej tekstu |
| **Stonowana Tech-Wellness** | 15% | AI Quiz, raport zdrowotny, profil pupila, AI Alerty, dashboard klienta | Hims / Whoop **stonowane** — subtelne wykresy, zero neonów |

---

## 2. Kolory

### Paleta główna

Brand jest **ciepły**. Każda biel jest złamana w stronę kości słoniowej, każda czerń w stronę grafitu. Zero czystych kolorów spektralnych.

| Rola | Opis | Reference hex |
|---|---|---|
| Tło bazowe (canvas) | Ciepła kość słoniowa, nie czysta biel | `#FAF7F2` |
| Tło kart / sekcji jaśniejszych | Czystsza, jeszcze cieplejsza biel | `#FDFBF7` |
| Tło wysp Warm Education | Cieplejszy beż, kontrast z bazą | `#F0E8DC` |
| Tło wysp Tech-Wellness | Lekko ciemniejsze, stonowany piasek | `#EDE7DD` |
| **Primary accent** (terakota / rust) | CTA, linki, podkreślenia, focus | `#B8654A` |
| Primary accent — hover | Lekko ciemniejszy | `#9F5239` |
| **Secondary accent** (zieleń mchu) | Trust signals, ikony „zweryfikowane", certyfikaty | `#3D4F3D` |
| **Tekst główny** (grafit) | Body, nagłówki | `#2A2A28` |
| **Tekst pomocniczy** (ciepły szary) | Etykiety, daty, opisy | `#6B6862` |
| Tekst tertiary | Captions, fineprint | `#A19D95` |
| Linia podziału / border | Bardzo subtelna, ciepła | `#E8E2D6` |
| Stan błędu | Przygaszony rdzawy (nie czerwony!) | `#B53D2E` |
| Stan sukcesu | Stonowana zieleń mchu | `#3D4F3D` (ten sam co secondary) |

### Tagi zdrowotne / kategorie życiowe

Zwierzę nie jest „kategorią" jak „jedzenie" w Home Budget. Mamy **tagi** charakteryzujące pupila i jego potrzeby:

| Tag | Przykładowe zastosowanie | Reference hex (subtelny tint, nigdy pełny) |
|---|---|---|
| Stawy | Suplementy, dieta dla seniorów | `#A87B5C` (przygaszony karmel) |
| Sierść | Karmy z omega-3, suplementy | `#7A6E5A` (oliwka) |
| Waga | Dieta dla zwierząt z nadwagą | `#5C7A6B` (przyglaszony szałwiowy) |
| Zęby | Akcesoria stomatologiczne | `#8B7355` (taupe) |
| Serce | Suplementy z tauryną | `#9C5447` (rdzawy, pochodna primary) |
| Przewód pokarmowy | Probiotyki, karmy lekkostrawne | `#9C8458` (musztardowy stonowany) |

**Zasada:** tagi nigdy nie są w pełnym nasyceniu. To nie są „kategorie krzyczące o uwagę", tylko subtelne signaling. Background tagu używa 8–12% nasycenia.

### Zasady używania kolorów

- **Zero pastelowych pet-shop kolorów.** Pastelowy róż, baby blue, mięta, lawenda → natychmiastowa śmierć premium pozycjonowania.
- **Zero czystej bieli `#FFFFFF`.** Zawsze złamana w kość słoniową.
- **Zero czystej czerni `#000000`.** Zawsze grafit.
- Primary accent (terakota) używamy **oszczędnie** — głównie CTA i fokus. Jeśli pojawia się w 5 miejscach na ekranie, jest go za dużo.
- Secondary accent (mech) używamy do **trust signals**, nigdy do CTA.
- Tekst na kolorowym tle = ciemniejsza wersja tego samego koloru, nigdy szary.

---

## 3. Typografia

### Czcionki

Wszystkie czcionki z **Google Fonts** — zero kosztów licencyjnych.

| Rola | Czcionka | Dlaczego |
|---|---|---|
| **Nagłówki** | **Cormorant Garamond** | Elegancki serif z charakterem, editorial feeling, bardzo czytelny w dużych rozmiarach. Closest free alternative do Canela / Tiempos. |
| **Body, UI** | **Inter** | Geometryczny sans, świetna czytelność w każdym rozmiarze, dobre wsparcie dla języka polskiego, tablarne cyfry wbudowane. |
| **Liczby / ceny** | Inter z `font-feature-settings: "tnum"` | Tabularne cyfry zapewniają wyrównanie kolumn cenowych. |

Import (Google Fonts):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
```

**Zakaz:** Times New Roman, Arial, Helvetica jako defaulty. Comic Sans (oczywiście). Wszystkie „cute" handwritten fonty (Caveat, Pacifico, Satisfy itd. = pet-shop killer). Płatne czcionki — nie używamy, żeby utrzymać spójność między członkami zespołu.

### Hierarchia tekstu

System działa na kontraście — nie wszystkie teksty mają być tak samo ważne.

| Rodzaj tekstu | Rozmiar | Waga | Czcionka | Przykład zastosowania |
|---|---|---|---|---|
| Hero headline | 56–72px | Regular (400) | Serif | „Twój pupil zasługuje na to, co najlepsze." |
| Section headline | 36–48px | Regular | Serif | Nagłówki sekcji landingu |
| Subheading | 22–28px | Medium (500) | Serif lub Sans | Podtytuły sekcji |
| Body large | 18–20px | Regular | Sans | Pierwszy akapit, wprowadzenia |
| Body | 16px | Regular | Sans | Standardowy tekst |
| Caption / etykieta | 13–14px | Regular | Sans | Etykiety, daty, fineprint |
| Eyebrow / WERSALIKI | 11–12px | Medium, letter-spacing 0.08em | Sans | „CERTYFIKAT WETERYNARYJNY", „POLECANE" |
| Cena (hero) | 28–36px | Medium | Sans (tabular) | Cena na stronie produktu |
| Cena (listing) | 16–18px | Medium | Sans (tabular) | Cena na karcie produktu |

**Kluczowa zasada:** Serif w nagłówkach + sans w body = brand voice. Łamanie tej zasady (np. sans w hero) natychmiast obniża premium feeling.

### Długość linii i leading

- Nagłówki serif: line-height ~1.1–1.2 (ciasno, dla efektu editorial)
- Body sans: line-height ~1.6 (dużo oddechu)
- Maksymalna szerokość kolumny tekstu: ~65 znaków (czytelność)

---

## 4. Mikrokopia (najtańsza, najwyżej-zwrotna sekcja brandu)

To ratuje editorial vibe przed zimnem. Najważniejsza sekcja w całym guide po fotografii.

### Zasada główna — imię pupila w momencie emocjonalnym

Jeśli zalogowany user ma `pet_profile`, w wybranych miejscach UI używamy **imienia pupila** zamiast generycznego copy. Imię pojawia się **raz na ekran w momencie emocjonalnym** (CTA, potwierdzenie, alert), nie w każdym zdaniu.

Fallback dla gościa lub użytkownika bez profilu: **„Twój pupil"** — nigdy „Twoje zwierzę".

### Słownik mikrokopii

| Punkt styku | ❌ Generycznie / zimno | ✅ Editorial Warm Premium |
|---|---|---|
| CTA na karcie produktu | „Dodaj do koszyka" | „Dodaj dla Zuzi" / „Dodaj dla pupila" |
| CTA hero | „Kup teraz" / „Zobacz produkty" | „Zobacz, co polecamy dla Zuzi" / „Sprawdź, co polecamy" |
| Empty state koszyka | „Twój koszyk jest pusty" | „Zuzia jeszcze na coś czeka" / „Pupil jeszcze na coś czeka" |
| Empty state ulubionych | „Brak ulubionych produktów" | „Tu zapiszemy ulubione Zuzi" |
| Po zakupie | „Dziękujemy za zamówienie #2847" | „Doskonały wybór dla Zuzi. Raport zdrowotny czeka w skrzynce." |
| Wysyłka | „Zamówienie wysłane" | „Paczka dla Zuzi w drodze. Przewidywana dostawa: piątek." |
| Out of stock | „Produkt niedostępny" | „Ten produkt chwilowo wyprzedany — damy znać Zuzi, gdy wróci?" |
| AI Alert (e-mail subject) | „Przypomnienie: kończy się Twój suplement" | „Zuzi kończy za 5 dni suplement na stawy" |
| Quiz CTA | „Wypełnij quiz" | „Sprawdź, czego potrzebuje Zuzia" |
| Trust signal | „Certyfikowany produkt" | „Skład zweryfikowany przez weterynarza dr. Kowalską" |
| Disclaimer AI | „To nie jest porada lekarska" | „Raport ma charakter informacyjny — najlepszą diagnozę postawi weterynarz Zuzi" |
| Welcome (nowy user) | „Witamy w sklepie" | „Witaj w rodzinie [Brand] — razem zadbamy o Zuzię" |

### Język korzyści, nie funkcji

- ❌ „Suplement z glukozaminą 500 mg, MSM 250 mg, kolagenem typu II"
- ✅ „Twój pies wstanie rano bez bólu — naturalnie, weterynaryjnie sprawdzone"

Cechy podajemy **pod CTA**, w sekcji „Skład" — nie w hero produktu.

### Język prewencji, nie reakcji

- ❌ „Lecz problemy stawowe Twojego psa"
- ✅ „Zapobiegnij problemom stawowym, zanim się pojawią"
- ✅ „Zacznij dbać o wzrok kota w 5. roku życia — bo wtedy ma to największy sens"

Klient kupuje profilaktykę, nie leczenie. To kluczowy psychologiczny insight z PRD.

### Czego NIE robimy w mikrokopii

- **Zero emoji** w UI i mikrokopiach. 🐾🐶🐱❤️ — wszystko zakaz. Pet-shop killer.
- **Zero wykrzykników** w CTA i alertach. „NAJLEPSZY!!!" → NIE.
- **Zero wersalików w nadmiarze.** Tylko eyebrow labels (mała typografia, letter-spacing).
- **Zero call-center patternu.** „Anna, czy widzisz to, Anna? Anna, mamy dla Ciebie…" — antypattern.
- **Zero infantylnego copy.** „Pieseczek będzie miau!" → NIE. Mówimy z czułością, ale dorośle.

---

## 5. Fotografia (krytyczne dla brandu — Anna sczyta autentyczność w 2 sekundy)

### Co robimy

- **Realne psy/koty** w **domowych kontekstach**: kuchnia, salon, kanapa, parapet, ogród.
- **Naturalne światło** z okna. Lekkie ziarno. Ciepła korekcja kolorystyczna (lekki shift w stronę bursztynu).
- **Fragmenty właściciela**: dłoń głaszcząca, fragment swetra, kąt kuchni — **nigdy całych twarzy**. Anna ma się utożsamić, nie porównywać z modelem.
- **Produkty w lifestyle**: produkt na blacie obok pupila, w naturalnym otoczeniu, w dłoni.
- **Recenzje od klientów**: zdjęcia ich realnych pupili (z imionami i rasą).
- Mały kadr „behind the scenes" cieszy oko Anny — pakowanie, ręka klienta, niedoskonałości.

### Czego NIE robimy

- **Zero stock photos.** Czysty pies rasowy z idealnym futrem na białym tle = Zooplus territory. Anna sczyta to natychmiast.
- **Zero packshot na białym tle** (chyba że sekcja techniczna typu „Skład" gdzie produkt potrzebuje tła neutralnego).
- **Zero studyjnego światła / flash.** To czyta się jako reklama, nie editorial.
- **Zero hipernasyconego „Instagram filtra".** Szumi jako amatorszczyzna albo agresywny marketing.
- **Zero psów w bandanach z napisami / ubrankach z brandem.** Cringe, czyta się jako amerykański pet-shop.
- **Zero memowych poz** (pies z wystawionym językiem, kot „grumpy"). Editorial premium nie żartuje ze swoich bohaterów.

### Hierarchia typu zdjęcia

1. **Hero**: jedno duże, editorialowe zdjęcie pupila w domu lub naturze (ciepłe światło, asymetryczna kompozycja)
2. **Sekcje produktów**: zdjęcia lifestyle (produkt + pupil + naturalne otoczenie)
3. **Recenzje**: zdjęcia od klientów, square format, z imieniem pupila i rasą jako podpis
4. **Eksperci**: zdjęcia weterynarzy w realnych gabinetach (nie studyjne portrety korpo)

---

## 6. Zaokrąglenia i kształty

Brand jest miękki, ale nie childish. Zaokrąglenia są **wyraźne, ale nie pillowe**.

| Element | Radius | Reference px |
|---|---|---|
| Główne karty | Średnio-duże | `24px` |
| Karty produktów (listing) | Średnie | `20px` |
| Buttony primary / secondary | Małe-średnie | `10–12px` |
| Pole formularza | Małe | `8px` |
| Tagi / chipy | Małe | `6–8px` |
| Avatary / circular badges | Pełne | `50%` (tylko dla zdjęć ludzi/pupili) |
| Obrazy w sekcjach editorial | Subtelnie | `4–8px` lub `0` (dla efektu „magazine") |

**Zakaz:**
- Radius `999px` na buttonach lub tagach (= „childish app", wbrew premium)
- Ostrych kątów (`0`) w UI elementach (oprócz obrazów editorial — patrz wyżej)
- Mieszania radiusów w podobnych elementach (jedna karta `24px`, druga `12px` na tym samym ekranie)

---

## 7. Cienie i głębia

Brand jest **editorial premium**, więc cienie używane są **oszczędnie**. Aesop praktycznie nie ma cieni. My mamy, ale subtelnie.

Zasady:
- Cień jest **ciepły** (lekki tint terakoty lub grafitu), nigdy chłodny / niebieski / czysto czarny.
- Krycie **4–8%** (ledwo widoczne, ale wyczuwalne).
- **Duże rozmycie** (blur 20–40px), żadnych twardych krawędzi.
- Cienie głównie na: kartach produktów (delikatne uniesienie nad canvas), modalach / popoverach, AI Alert badge'ach.
- **Brak cieni** na: nagłówkach, tekście, ikonach, buttonach (chyba że focus state).

Reference shadow:

```css
/* Default elevation */
box-shadow: 0 4px 20px 0 rgba(184, 101, 74, 0.06);

/* Hover */
box-shadow: 0 6px 28px 0 rgba(184, 101, 74, 0.10);

/* Focused */
box-shadow: 0 0 0 3px rgba(184, 101, 74, 0.15);
```

---

## 8. Przestrzeń i rytm

Brand **oddycha**. Anna kupuje editorial premium właśnie dlatego, że szuka ucieczki od zatłoczonych pet-shopów.

- **Karty mają hojny wewnętrzny padding** (24–40px). Treść nigdy nie dotyka krawędzi.
- **Sekcje oddzielane przestrzenią**, nie liniami. Linie używamy **bardzo rzadko** (np. między rzędami w tabeli składników).
- **Maksymalna szerokość kontenera**: ~1200–1280px na desktopie. Hero często węższe (~960px) dla efektu „magazine".
- **Asymetria zamiast siatki 12-kolumnowej** w sekcjach editorialowych. Hero, „o nas", artykuły — nieoczywiste kompozycje.
- **Mobile zachowuje whitespace.** Częsty błąd: desktop oddycha, mobile gęsty jak Allegro. To zabija premium feeling u Anny, która kupuje z TikToka. Mobile padding sekcji: min. 24px.

Skala odstępów (Tailwind-friendly):

| Token | Wartość | Zastosowanie |
|---|---|---|
| `space-1` | 4px | Bardzo małe odstępy (między ikoną a tekstem) |
| `space-2` | 8px | Małe odstępy |
| `space-4` | 16px | Standardowe odstępy między elementami |
| `space-6` | 24px | Padding kart, odstępy między blokami |
| `space-8` | 32px | Padding dużych kart, odstępy sekcji |
| `space-12` | 48px | Odstępy między sekcjami |
| `space-20` | 80px | Odstępy między dużymi sekcjami landingu |

---

## 9. Ikony

Aplikacja używa biblioteki **Lucide** — minimalnych, jednolinijnych ikon konturowych. Stroke-width: `1.5px` (cieńszy niż domyślne `2px` — bardziej editorial).

**Zasady:**
- Ikony **trust signals** (certyfikat, weterynarz, zweryfikowane) używają koloru secondary (mech).
- Ikony CTA / focusu używają koloru primary (terakota).
- Ikony pomocnicze (nawigacja, formularze) używają koloru tekstu pomocniczego.
- **Zero kolorowych ilustracji w stylu Storyset / undraw.io.** To czyta się jako „startup MVP", nie premium.
- **Zero emoji jako ikony** (nawet jeśli wygląda fajnie w dev mode).
- Tagi zdrowotne (stawy, serce, sierść) mogą mieć ikonę w **kolorowym kwadracie z subtelnym tintem** — rozmiar 32–40px, radius 8px, tint 8–12%.

---

## 10. Nawigacja

Nawigacja główna to **prosty tekst, bardzo cicho**. Editorial premium nie krzyczy — nawigacja jest narzędziem, treść jest bohaterem.

- Logo po lewej (serif, niewielkie).
- Linki nawigacji w środku lub po prawej, body sans, regular weight.
- Aktywna sekcja: subtelne podkreślenie kolorem primary (cienka linia 1–2px) **lub** lekki shift koloru tekstu.
- **Zero przycisków, kafelek, dropdownów-mega menu.** Mega menu = Allegro/Amazon = zabija editorial.
- Koszyk i konto: subtelne ikony Lucide, licznik koszyka jako mała kropka primary nad ikoną (zero badge'y w stylu Material Design).

Sticky header — TAK, ale **z transparentnym tłem na top, a tłem `#FAF7F2` po scrollu**. Subtelne przejście.

---

## 11. AI Quiz, raporty i Tech-Wellness — strefa 15%

Tu jest jedyne miejsce, gdzie brand pozwala sobie na **dane, wykresy i dashboard-feel** — ale stonowane.

Zasady:
- Tło: lekko ciemniejsze (`#EDE7DD`), żeby zasygnalizować „inną strefę".
- Wykresy: linie cienkie (1–1.5px), kolor primary lub secondary, zero gradientów, zero glow.
- Progress bary: cienkie (4–6px), radius pełny (`999px`), kolor primary na tle linii podziału.
- Karty raportu: jak normalne karty, ale z dodatkowym subtelnym wyróżnieniem (np. eyebrow „RAPORT ZDROWOTNY" w kolorze secondary).
- Liczby (np. „87% optymalnej diety"): typograficznie eksponowane, ale **bez krzyku**.
- **Zero neonów, zero glassmorphism, zero ciemnych dashboardów.** To nie jest cyber, to jest „wellness lab" — czyste, spokojne, ufne.

---

## 12. Tryb ciemny

**V1: nie wdrażamy.** Editorial premium brandy (Aesop, Le Labo, Goop) generalnie nie mają dark mode. Brand jest oparty na ciepłej bieli i papierze — dark mode łamie tę metaforę.

V2 (opcjonalnie): jeśli kiedyś, to **tylko w strefie Tech-Wellness** (AI Quiz, dashboard) jako opcja użytkownika. Reszta sklepu zostaje light.

---

## 13. Zasady, których nie łamiemy

- Nigdy nie używamy czystej czerni `#000000` ani czystej bieli `#FFFFFF` — zawsze tintowane (grafit + kość słoniowa).
- Nigdy nie używamy **pastelowych pet-shop kolorów** (różowy, baby blue, mięta, lawenda).
- Nigdy nie używamy **emoji 🐾🐶🐱** w UI ani w mikrokopiach.
- Nigdy nie używamy **stock photos** psów rasowych na białym tle.
- Nigdy nie używamy **ilustrowanych mascot characters** ani „cute" cartoon zwierząt.
- Nigdy nie używamy **gradientów** na tekstach, buttonach ani w hero. (Editorial premium = solid colors.)
- Nigdy nie używamy **glassmorphism** ani **neumorphism**. (Trend, nie brand.)
- Nigdy nie zagnieżdżamy kart wewnątrz kart.
- Nigdy nie używamy **mega menu** ani drop-down kategorii w stylu marketplace.
- Nigdy nie pokazujemy **szarego tekstu na kolorowym tle** — zawsze ciemniejszy odcień tego koloru.
- Nigdy nie animujemy właściwości układu (width, height, margin) — tylko `opacity` i `transform`.
- Nigdy nie używamy **wykrzykników w CTA** ani **WERSALIKÓW W NADMIARZE** (poza eyebrow labels).
- Nigdy nie używamy imienia pupila **więcej niż raz na ekran**. (Jedno wystarczy. Dwa = call-center pattern.)
- Nigdy nie piszemy „Twoje zwierzę". Zawsze „Twój pupil" lub imię.

---

## 14. Quick reference — kluczowe wartości

```css
/* Tła */
--bg-canvas: #FAF7F2;        /* główne tło */
--bg-card: #FDFBF7;          /* karty na canvas */
--bg-warm-island: #F0E8DC;   /* sekcje Warm Education */
--bg-tech-island: #EDE7DD;   /* sekcje Tech-Wellness */

/* Akcenty */
--primary: #B8654A;          /* terakota — CTA, focus */
--primary-hover: #9F5239;
--secondary: #3D4F3D;        /* mech — trust signals */

/* Tekst */
--text-primary: #2A2A28;     /* grafit */
--text-secondary: #6B6862;   /* ciepły szary */
--text-tertiary: #A19D95;    /* fineprint */

/* UI */
--border: #E8E2D6;           /* subtelne podziały */
--error: #B53D2E;            /* przygaszony rdzawy */

/* Cienie */
--shadow-sm: 0 4px 20px 0 rgba(184, 101, 74, 0.06);
--shadow-md: 0 6px 28px 0 rgba(184, 101, 74, 0.10);

/* Radius */
--radius-card: 24px;
--radius-button: 12px;
--radius-tag: 8px;

/* Czcionki (Google Fonts — bez kosztów licencyjnych) */
--font-serif: "Cormorant Garamond", Georgia, serif;
--font-sans: "Inter", system-ui, sans-serif;
```
