---
title: PRD – Skalowalny Sklep Dropshippingowy | Premium & Luxury Pet Care
version: '3.0'
date: 29.04.2026
stack: Next.js 14 + Supabase + Vercel
market: Polska (B2C)
segment: Premium / Luxury Pet Care — Pet Humanization
---

# PRODUCT REQUIREMENTS DOCUMENT

## Skalowalny Sklep Dropshippingowy — Segment Premium & Luxury Pet Care

**Stack technologiczny:** Next.js 14 (App Router) + Supabase + Vercel

**Rynek docelowy:** Polska (B2C) — przygotowany na ekspansję

**Segment produktowy:** Premium / Luxury Pet Care (trend Pet Humanization)

**Bramka płatności:** PayU (BLIK, karty, przelew)

**Integracja hurtowni:** Droplo / BaseLinker (agregator wielu dostawców)

**Wersja dokumentu:** 3.0 — zaktualizowana o strategię Premium

**Data aktualizacji:** 29.04.2026

---

## 1. Cel projektu (Vision)

Stworzenie skalowalnego sklepu dropshippingowego skierowanego do klientów indywidualnych (B2C) na rynku polskim, pozycjonowanego **wyłącznie w segmencie Premium i Luxury Pet Care**. Sklep nie konkuruje ceną — konkuruje zaufaniem, prestiżem i poczuciem bezpieczeństwa, jakie daje właścicielowi zwierzęcia.

Produkt odpowiada na globalny trend **Pet Humanization**: zwierzę jest pełnoprawnym członkiem rodziny, a jego zdrowie i komfort są traktowane z taką samą powagą jak zdrowie dziecka. Nasz klient nie szuka najtańszej opcji — szuka **najlepszej**.

**Kluczowe założenia**

- **Premium positioning:** Każdy element sklepu — od UX po copywriting — ma komunikować jakość, bezpieczeństwo i prestiż.
- **Darmowy start:** Vercel Free + Supabase Free tier pokrywają MVP; architektura gotowa na szybki scaling.
- **SEO-first:** Next.js App Router z SSG/ISR, JSON-LD, meta tags zoptymalizowane pod frazy premium.
- **Trust-building by design:** Certyfikaty, recenzje weterynarzy, raporty zdrowotne i AI-alerty jako główne wyróżniki.
- **Skalowalność:** Architektura gotowa na Docker + Coolify od pierwszego dnia.

---

## 2. Grupa Docelowa (Target Audience)

### 2.1 Profil Segmentu: Premium / Luxury Pet Care

Nasz klient należy do rosnącego, globalnego ruchu **Pet Humanization** — grupy właścicieli zwierząt, którzy świadomie traktują pupila jako pełnoprawnego członka rodziny. W Polsce segment ten dynamicznie rośnie, napędzany przez odkładanie decyzji o posiadaniu dzieci (zjawisko „First Child Pet") oraz wzrost zamożności klasy średniej i wyższej.

**Charakterystyka psychograficzna:**

- **Status pupila:** Zwierzę to „pierwsze dziecko" (First Child) lub jedyne dziecko w rodzinie. Właściciel mówi o nim w pierwszej osobie: „mój pies potrzebuje", „kot czuje się lepiej". Traktowanie zwierzęcia jako „tylko zwierzęcia" jest dla tej grupy obraźliwe.
- **Motywacje zakupowe:** Skrajna troska o zdrowie i bezpieczeństwo. Klient jest gotowy zapłacić wysoką cenę za produkt lub usługę, która **wykryje problem zanim wystąpi** (filozofia prewencji). Kupuje „spokój ducha" (peace of mind), nie produkt.
- **Podejście do ceny:** Cena jest drugorzędna — liczy się skuteczność, jakość i poczucie, że daje się zwierzęciu **to, co najlepsze na rynku**. Wysoka cena jest często postrzegana jako sygnał jakości.
- **Stosunek do marek:** Lojalny wobec marek, które budują relację i komunikują się językiem eksperta. Nieufny wobec sklepów generycznych. Poszukuje rekomendacji weterynarzy i specjalistów.
- **Zachowania zakupowe:** Skłonny do wyrzeczeń we własnym budżecie, by zapewnić zwierzęciu najwyższy standard. Regularnie kupuje produkty premium (karmy weterynaryjne, suplementy, akcesoria premium). Aktywny w mediach społecznościowych — chętnie dzieli się zakupami i sukcesami zdrowotnymi pupila.

### 2.2 Market Psychology — Mapa Emocjonalna Klienta

Rozumienie psychologii klienta jest kluczem do projektowania każdej funkcji sklepu:

| Emocja / Stan | Trigger | Jak sklep odpowiada |
|---|---|---|
| **Lęk o zdrowie** | „Co jeśli produkt jest szkodliwy?" | Certyfikaty weterynaryjne, skład weryfikowany przez eksperta, AI-alert przy potencjalnym zagrożeniu |
| **Potrzeba kontroli** | „Chcę wiedzieć wszystko o tym, co daję pupilowi" | Pełna transparentność składu, raporty zdrowotne, historia zakupów z wpływem na zdrowie |
| **Duma i prestiż** | „Daję mojemu zwierzęciu to, co najlepsze" | Social sharing, odznaki „Premium Owner", ekskluzywne edycje limitowane |
| **Poczucie winy** | „Czy robię wystarczająco dużo?" | Rekomendacje prewencyjne, przypomnienia o uzupełnieniu suplementów, personalizowane plany zdrowotne |
| **Przynależność** | „Chcę być częścią społeczności ludzi, którzy dbają o zwierzęta" | Program ambasadorski, recenzje społeczności, funkcje social sharing |
| **Zaufanie do eksperta** | „Czy to polecają weterynarz?" | Endorsementy weterynaryjne widoczne przy każdym produkcie, certyfikaty jakości |

---

## 3. Persony (User Personas)

### Persona 1: Marek — Zamożny Profesjonalista

> *„Mój golden retriever Max jest ze mną wszędzie. Chcę, żeby żył długo i był zdrowy. Nie patrzę na cenę — patrzę na jakość."*

**Dane demograficzne:**
- Wiek: 34–45 lat
- Zawód: Manager wyższego szczebla / przedsiębiorca / specjalista IT
- Dochód: 15 000–30 000+ PLN netto miesięcznie
- Lokalizacja: Warszawa, Kraków, Trójmiasto, Wrocław
- Zwierzę: Duży pies rasowy (golden retriever, labrador, border collie) lub kot rasy (maine coon, ragdoll)

**Charakterystyka:**
- Traktuje zakupy dla psa jak inwestycję w jakość życia — zarówno zwierzęcia, jak i swoją własną (zdrowy pies = spokojniejszy właściciel)
- Aktywnie śledzi technologie: smartwatche dla psów, aplikacje monitorujące zdrowie, diety funkcjonalne
- Ceni prestiż marki i design produktu — estetyka opakowania ma znaczenie
- Kupuje często online, oczekuje UX porównywalnego z Apple Store lub premium fashion e-commerce
- Chętnie dzieli się zdjęciami psa na Instagramie (Dognstagram) z opisem produktów

**Cele i potrzeby:**
- Dostęp do najnowszych, premium produktów weterynaryjnych niedostępnych w zwykłych sklepach
- Personalizowane rekomendacje dla konkretnej rasy, wieku i wagi psa
- Wygodny, szybki zakup (zapisane adresy, karty) bez konieczności każdorazowego researchu
- Możliwość pochwalenia się zakupem — unboxing experience, eleganckie opakowanie

**Frustracje:**
- Sklepy, które nie oferują filtrowania po rasie lub specjalnych potrzebach zdrowotnych
- Brak informacji o składzie i certyfikatach (musi sam weryfikować)
- Generyczny wygląd stron — brak poczucia premium
- Brak możliwości oceny czy produkt jest odpowiedni dla konkretnego zwierzęcia

**Scenariusz zakupowy:**
Marek szuka suplementu na stawy dla Maxa (7 lat). Wchodzi na stronę, filtruje po rasie i wieku psa. System AI rekomenduje produkt z certyfikatem weterynaryjnym i ocenami od właścicieli golden retrieverów. Marek dodaje do koszyka, płaci Apple Pay (BLIK). Otrzymuje PDF z raportem zdrowotnym i profilaktycznym planem suplementacji. Udostępnia zakup na IG Stories z tagiem sklepu.

---

### Persona 2: Anna — Oddana Pet Mama o Średnich Dochodach

> *„Nie stać mnie na wszystko dla siebie, ale dla mojej Zuzi oszczędzać nie będę. To moja rodzina."*

**Dane demograficzne:**
- Wiek: 26–38 lat
- Zawód: Nauczycielka, pracownik biurowy, specjalista mid-level, freelancer
- Dochód: 4 500–8 000 PLN netto miesięcznie
- Lokalizacja: Miasta średniej wielkości i duże (Łódź, Poznań, Katowice, też Warszawa)
- Zwierzę: Kot (mieszaniec lub rasa), mały/średni pies, królik, świńka morska

**Charakterystyka:**
- Świadomie rezygnuje z własnych przyjemności (wakacje, ubrania), by kupić zwierzęciu premium produkty
- Bardzo aktywna w mediach społecznościowych — TikTok, Instagram, grupy na Facebooku („Właściciele kotów Polsce")
- Intensywnie researuje przed zakupem — czyta składy, porównuje, szuka recenzji weterynarzowi
- Bardzo wrażliwa na autentyczność marki — szybko wykrywa „greenwashing" i fałszywy premium
- Motywowana strachem: „co jeśli coś jej zaszkodzi" jest silniejszym motywatorem niż prestiż

**Cele i potrzeby:**
- Pewność, że produkt jest bezpieczny i przetestowany — najważniejsza potrzeba
- Transparentność składu i informacja o potencjalnych alergenach
- Alerty prewencyjne: powiadomienie, gdy wiek lub waga zwierzęcia zbliża się do progu zdrowotnego wymagającego zmiany diety/suplementacji
- Program lojalnościowy lub subskrypcja, który pozwoli na zakup premium w rozsądnej cenie regularnie
- Edukacja: chce rozumieć, dlaczego ten produkt jest lepszy

**Frustracje:**
- Wysokie ceny bez wyjaśnienia, co je uzasadnia
- Brak edukacji w opisach produktów — same cechy, zero kontekstu zdrowotnego
- Strach, że dopiero po zakupie dowie się, że produkt ma zły skład
- Poczucie winy, gdy nie może pozwolić sobie na droższy produkt

**Scenariusz zakupowy:**
Anna widzi reklamę na Instagramie — „Sprawdź, czy dieta Twojego kota jest kompletna". Klika w link, który prowadzi do bezpłatnego AI quizu zdrowotnego dla Zuzi (3 lata, kastrowana kotka). Quiz generuje raport i rekomenduje konkretny produkt z certyfikatem weterynaryjnym, wyjaśniając dlaczego jest bezpieczny. Anna widzi cenę — to wydatek, ale strona wyjaśnia: „Ta ilość wystarczy na 3 miesiące — 8 zł dziennie za zdrowie Twojej Zuzi". Kupuje. Następnego dnia dostaje e-mail z „Profilem zdrowotnym Zuzi" i przypomnieniem za 3 miesiące.

---

## 4. User Stories

### Klient (B2C) — Premium Pet Owner

- Jako właściciel psa chcę filtrować produkty po rasie, wieku i wadze zwierzęcia, żeby mieć pewność, że wybieram odpowiedni produkt.
- Jako Pet Parent chcę widzieć przy każdym produkcie certyfikat weterynaryjny lub endorsement eksperta, żeby mieć pewność, że to bezpieczne.
- Jako klient premium chcę zobaczyć pełny skład produktu z wyjaśnieniem każdego składnika, żeby świadomie podjąć decyzję.
- Jako Anna chcę otrzymać AI raport zdrowotny mojego zwierzęcia po zakupie, żeby wiedzieć czy robię właściwą decyzję.
- Jako Marek chcę mieć możliwość udostępnienia zakupu lub oceny produktu na mediach społecznościowych, żeby podzielić się ze społecznością.
- Jako klient chcę zapłacić BLIKiem lub Apple Pay, bo cenię wygodę i szybkość.
- Jako stały klient chcę mieć historię zakupów z profilami zdrowotnymi moich zwierząt, żeby śledzić ich postępy.
- Jako Pet Parent chcę otrzymywać spersonalizowane przypomnienia o uzupełnieniu suplementów lub zmianie produktu, żeby nie przegapić ważnego momentu w cyklu zdrowia zwierzęcia.
- Jako klient chcę widzieć recenzje od zweryfikowanych właścicieli tej samej rasy, bo to najbardziej wiarygodna opinia.

### Administrator

- Jako admin chcę edytować opisy i nazwy produktów bez utraty zmian przy kolejnym imporcie.
- Jako admin chcę widzieć zamówienia i ich statusy w jednym miejscu.
- Jako admin chcę być powiadamiany e-mailem o każdym nowym zamówieniu.
- Jako admin chcę zarządzać certyfikatami i endorsementami weterynaryjnymi dla każdego produktu.
- Jako admin chcę zarządzać quizem zdrowotnym AI i mapowaniem pytań na produkty.
- Jako admin chcę widzieć analitykę: które produkty są najczęściej rekomendowane przez AI i jaką mają konwersję.
- Jako admin chcę importować produkty z kilku hurtowni przez jedno API i oznaczać wybrane jako „Premium Verified".

---

## 5. Funkcjonalności (Features)

### 5.1 Import produktów

- Integracja z agregatorem (Droplo lub BaseLinker) jako pojedynczy punkt wejścia dla wszystkich hurtowni
- Obsługiwane źródła: polskie hurtownie dropship (Droplo, Sky-shop), zagraniczne (AliExpress), specjalistyczne hurtownie pet care premium
- Synchronizacja co 6 godzin przez Vercel Cron Job
- Logika aktualizacji: ceny i stany magazynowe są nadpisywane, opisy SEO i certyfikaty — nigdy
- Tabela `import_logs` z historią synchronizacji i błędami
- **[PREMIUM]** Flaga `is_premium_verified` — admin ręcznie oznacza produkty, które przeszły weryfikację składu i posiadają certyfikat

### 5.2 Edytor SEO i treści Premium w panelu admina

- Nadpisywanie nazwy, opisu, slug URL, meta description dla każdego produktu
- Widok oryginalnych danych z hurtowni obok edytowanych (tryb porównania)
- Upload zdjęć do Supabase Storage (maks. 5 MB, formaty: WebP, JPG, PNG)
- **[PREMIUM]** Edytor sekcji „Dlaczego Premium?" — pole na narrację o jakości produktu, historię producenta, metodę produkcji
- **[PREMIUM]** Zarządzanie certyfikatami: upload pliku PDF certyfikatu, nazwa jednostki certyfikującej, data ważności
- **[PREMIUM]** Endorsement weterynaryjny: imię weterynarza/eksperta, tytuł, zdjęcie, cytat (max 280 znaków)
- **[PREMIUM]** Mapa składu: opcjonalny interaktywny breakdown składu produktu z opisem każdego składnika

### 5.3 Frontend sklepu — Doświadczenie Premium

- Listing produktów: filtrowanie po kategorii, cenie, dostępności
- **[PREMIUM]** Zaawansowane filtrowanie: gatunek zwierzęcia, rasa, wiek, waga, stan zdrowia (np. „wrażliwy żołądek", „stawy", „sierść")
- **[PREMIUM]** Filtr „Polecane przez weterynarzy" — wyświetla tylko produkty z endorsementem eksperta
- Strona produktu: h1, meta description, JSON-LD (Product schema), galeria zdjęć
- **[PREMIUM]** Sekcja „Certyfikaty i bezpieczeństwo" widoczna na karcie produktu (ikony certyfikatów + link do PDF)
- **[PREMIUM]** Sekcja „Rekomenduje ekspert" z miniaturą weterynarza i cytatem
- **[PREMIUM]** Kalkulator dawkowania: waga i wiek zwierzęcia → dzienna dawka produktu
- **[PREMIUM]** Odznaka „Premium Verified" na miniaturce produktu na listingu
- Przycisk „Kup teraz" nieaktywny gdy stock = 0
- Core Web Vitals: LCP < 2.5s (Next.js Image optimization, ISR)

### 5.4 AI Health Quiz & Personalizacja (Kluczowa Funkcja Premium)

Jest to główny wyróżnik sklepu, odpowiadający bezpośrednio na potrzebę „peace of mind" obu person.

- **Quiz zdrowotny:** Krok po kroku zbiera dane o zwierzęciu (gatunek, rasa, wiek, waga, aktywność, obecna dieta, obserwowane objawy lub problemy)
- **Wynik quizu:** Spersonalizowany raport zdrowotny z oceną aktualnego stanu i obszarami do poprawy
- **Rekomendacje produktów:** AI mapuje profil zdrowotny na konkretne produkty ze sklepu z wyjaśnieniem, dlaczego ten produkt odpowiada potrzebom tego konkretnego zwierzęcia
- **Profil zdrowotny zwierzęcia:** Zapisywany w koncie klienta, aktualizowany przy każdym zakupie i kolejnym wypełnieniu quizu
- **AI Alert System:** Automatyczne powiadomienia e-mail/push gdy:
  - Zbliża się koniec suplementu (na podstawie historii zakupów i dawkowania)
  - Wiek zwierzęcia wchodzi w nowy etap życia wymagający zmiany diety
  - W asortymencie pojawia się produkt lepiej dopasowany do profilu zwierzęcia
  - Wykryto potencjalne ryzyko zdrowotne na podstawie profilu (np. rasa predysponowana do problemów stawowych — alert po 5. roku życia)
- **Baza danych ras:** Informacje o predyspozycjach zdrowotnych popularnych ras psów i kotów
- Panel admina: podgląd najczęstszych profili zdrowotnych, konwersja rekomendacji AI → zakup

### 5.5 Koszyk i checkout

- Koszyk działający bez rejestracji (zapisywany w localStorage)
- Dwie ścieżki: zakup jako gość (tylko e-mail + adres) lub z kontem (zalecane dla dostępu do profilu zdrowotnego)
- Wybór dostawy: InPost Paczkomat (Geowidget), kurier DPD, inne
- **[PREMIUM]** Opcja „Premium Packaging" przy kasie: eleganckie opakowanie z personalizowaną karteczką (+X PLN)
- **[PREMIUM]** Wyraźny komunikat przy kasie: „Twój zakup jest objęty gwarancją satysfakcji — jeśli Twój pupil nie zaakceptuje produktu, zwrot bez pytań"
- Opcja podania NIP do faktury VAT

### 5.6 Płatności (PayU)

- Metody: BLIK, karty kredytowe/debetowe, przelew online
- Webhook PayU aktualizuje status zamówienia w Supabase
- Strona potwierdzenia zamówienia po udanej płatności
- **[PREMIUM]** Strona potwierdzenia zawiera: personalizowane „Dziękujemy, że dbasz o [imię pupila]" + link do pobrania raportu zdrowotnego PDF

### 5.7 Maile transakcyjne — Premium Touch

- Klient: potwierdzenie zamówienia (produkty, kwota, adres, nr referencyjny)
- Admin: powiadomienie o nowym zamówieniu
- Dostawca e-mail: Resend lub SendGrid (SMTP przez Supabase Edge Functions)
- **[PREMIUM]** E-mail powitalny po rejestracji: „Witaj w rodzinie [Nazwa Sklepu] — razem zadbamy o [imię pupila]"
- **[PREMIUM]** E-mail po zakupie (D+1): „Raport zdrowotny dla [imię pupila]" — PDF z profilem zdrowotnym i planem suplementacji
- **[PREMIUM]** E-mail prewencyjny (oparty o AI Alert): personalizowane powiadomienie z rekomendacją produktu i wyjaśnieniem

### 5.8 Program Lojalności & Social Sharing (Premium Community)

- **[PREMIUM V2]** Program „Strażnik Zdrowia": punkty za zakupy, recenzje produktów, polecenia znajomych
- **[PREMIUM]** Social Sharing: przycisk „Podziel się z innymi Pet Parents" na stronie produktu i po zakupie — generuje gotową grafikę do IG/Facebook z zdjęciem produktu i oceną
- **[PREMIUM V2]** Odznaki „Premium Owner": osiągnięcia za regularne dbanie o zdrowie zwierzęcia (np. „6 miesięcy suplementacji", „Prewencja stawów u seniora")
- **[PREMIUM]** Sekcja recenzji z filtrem rasy — „Co mówią właściciele golden retrieverów"
- **[PREMIUM]** Możliwość dodania zdjęcia pupila do recenzji — buduje autentyczność i social proof

### 5.9 Certyfikaty i Trust Signals (Widoczne w Całym Sklepie)

- **[PREMIUM]** Globalna belka trust signals: ikony certyfikatów, „Weterynaryjnie zweryfikowane", „Bezpieczny skład"
- **[PREMIUM]** Strona `/certyfikaty` z listą wszystkich certyfikatów sklepu i weryfikowanych produktów
- **[PREMIUM]** Badge „#1 Wybór weterynarzy" lub „Polecane przez specjalistów" (jeśli poparte danymi)
- **[PREMIUM]** Strona `/nasi-eksperci` — lista weterynarzy-partnerów z biogramami
- **[PREMIUM]** Ikona „Skład zweryfikowany" przy każdym składniku na stronie produktu

---

## 6. Gap Analysis — Funkcje Premium vs. Obecny Standard

Poniższa tabela pokazuje, jakie funkcje są wymagane, by sklep był postrzegany jako „Premium Must-Have" przez zidentyfikowane persony.

| Obszar | Standard (obecny) | Premium Gap | Priorytet |
|---|---|---|---|
| **Filtrowanie produktów** | Kategoria, cena, dostępność | Rasa, wiek, waga, stan zdrowia | 🔴 Krytyczny |
| **Strona produktu** | Zdjęcia, opis, cena | Certyfikaty, endorsement weterynarza, kalkulator dawki, skład z opisem | 🔴 Krytyczny |
| **Personalizacja** | Brak | AI Quiz, profil zdrowotny zwierzęcia, historia zakupów zdrowotnych | 🔴 Krytyczny |
| **Alerty i prewencja** | Brak | AI Alert System: koniec suplementu, nowy etap życia, ryzyko zdrowotne rasy | 🔴 Krytyczny |
| **Trust signals** | Brak | Certyfikaty weterynaryjne, endorsementy ekspertów, strona /nasi-eksperci | 🔴 Krytyczny |
| **Post-purchase** | E-mail z numerem zamówienia | Raport zdrowotny PDF, personalizowane „Dziękujemy", plan suplementacji | 🟠 Wysoki |
| **Social sharing** | Brak | Generowanie grafik IG, odznaki właścicielskie, recenzje z filtrem rasy | 🟠 Wysoki |
| **Premium packaging** | Standardowa dostawa | Opcja premium opakowania z karteczką personalną | 🟠 Wysoki |
| **Edukacja** | Opis produktu z hurtowni | Sekcja „Dlaczego Premium?", breakdown składu, artykuły edukacyjne | 🟠 Wysoki |
| **Program lojalnościowy** | Non-goal w V1 | Program „Strażnik Zdrowia" z punktami i odznakami | 🟡 V2 |
| **Subskrypcja** | Brak | Autodelivery suplementów co X tygodni | 🟡 V2 |

---

## 7. Tone of Voice & Strategia Komunikacji

### 7.1 Filozofia Komunikacji

Sklep nie sprzedaje produktów dla zwierząt — **sprzedaje spokój ducha właścicielom**. Każde słowo na stronie powinno odpowiadać na pytanie: „Czy to jest bezpieczne dla mojego zwierzęcia i czy daję mu to, co najlepsze?"

Język korzyści zastępuje język funkcji:
- ❌ „Suplement z glukozaminą 500 mg"
- ✅ „Twój pies wstanie rano bez bólu — naturalnie, bezpiecznie, weterynaryjnie sprawdzone"

### 7.2 Filary Tone of Voice

**1. Empatia, nie sprzedaż**
Mówimy jak ktoś, kto rozumie, że to nie jest „tylko pies". Używamy imienia zwierzęcia wszędzie tam, gdzie to możliwe. Nigdy nie minimalizujemy przywiązania.

**2. Ekspert, nie sprzedawca**
Edukujemy, zanim prosimy o zakup. Raport zdrowotny → rekomendacja → zakup. Nie odwrotnie.

**3. Prestiż przez minimalizm, nie przez pompowanie**
Premium nie krzyczy. Używamy spokojnych, pewnych sformułowań. Nie „NAJLEPSZY PRODUKT!!!". Tak: „Wybierany przez weterynarzy w 12 krajach."

**4. Bezpieczeństwo jako główna obietnica**
Każdy opis produktu musi zawierać jasną odpowiedź na pytanie: „Czy to jest bezpieczne?" — zanim klient zapyta.

**5. Prewencja, nie reakcja**
Język przyszłości: „Zapobiegnij problemom stawowym zanim się pojawią", „Zacznij dbać o wzrok kota w 5. roku życia". Klient kupuje profilaktykę, nie leczenie.

### 7.3 Przykłady Języka Korzyści

| Element | Język Generyczny | Język Premium |
|---|---|---|
| **Hero headline** | „Sklep z akcesoriami dla zwierząt" | „Twój pupil zasługuje na to, co najlepsze. My to wiemy." |
| **CTA na listingu** | „Kup teraz" | „Dodaj do troski o [Imię pupila]" |
| **Opis produktu** | „Karma z łososiem" | „Karma premium z norweskiego łososia — każda porcja to pełnowartościowy posiłek, bez kompromisów w składzie" |
| **Po zakupie** | „Dziękujemy za zamówienie" | „Doskonały wybór dla Twojego przyjaciela. Raport zdrowotny dla [Imię] czeka w Twojej skrzynce." |
| **Alert AI** | „Przypomnienie o uzupełnieniu zapasów" | „[Imię] kończy za 5 dni suplement stawy — czas zamówić kolejną porcję troski" |
| **Trust signal** | „Certyfikowany produkt" | „Skład zweryfikowany przez weterynarza dr. Kowalską — bezpieczny dla ras predysponowanych do alergii" |
| **Empty state koszyka** | „Twój koszyk jest pusty" | „Twój koszyk jeszcze czeka — [Imię] pewnie też" |

### 7.4 UX Principles — Projektowanie dla Premium Pet Ownerów

**Zasada 1: Zero Anxiety Design**
Każdy ekran powinien obniżać lęk, nie go zwiększać. Informacja o bezpieczeństwie składu widoczna bez klikania. Certyfikat — tuż przy zdjęciu. Recenzja weterynarza — przed ceną.

**Zasada 2: Personalizacja jest obowiązkiem, nie funkcją**
Klient nie powinien nigdy widzieć produktów, które nie są dopasowane do jego zwierzęcia. Jeśli wiadomo, że ma kota, sklep nigdy nie pokazuje karmy dla psów jako pierwszej.

**Zasada 3: Transparentność składu jako USP**
Clickable ingredienty z wyjaśnieniem. „Tauryna — niezbędna dla zdrowia serca kotów" zamiast samej nazwy. To buduje zaufanie i edukuje jednocześnie.

**Zasada 4: Premium Packaging Experience — Online**
Strona potwierdzenia zamówienia to nie receipt. To moment dumy: piękne zdjęcie produktu, personalizowane podziękowanie, preview raportu zdrowotnego. Checkout to kulminacja, nie formalność.

**Zasada 5: Social Proof od „równych sobie"**
Recenzje filtrowane po rasie i wieku zwierzęcia. „Co piszą właściciele 7-letnich golden retrieverów" jest 10x bardziej wiarygodne niż „4.8/5 z 1200 opinii".

---

## 8. Non-Goals (Czego nie robimy w V1)

- Wielowalutowość (zostajemy przy PLN)
- Aplikacja mobilna (PWA można dodać w V2)
- Integracja z marketplace Allegro — sprzedaż na własnej domenie jest priorytetem V1
- Program lojalnościowy z punktami (wchodzi w V2 jako „Strażnik Zdrowia")
- Subskrypcja / autodelivery (V2)
- Pełna analityka AI backendu — w V1 wystarczy quiz z regułami; prawdziwe ML wchodzi w V2
- Własny silnik ML rekomendacji (V1 używa reguł opartych o dane quizu)

---

## 9. Architektura techniczna

### 9.1 Tech Stack

| Warstwa | Technologia | Uzasadnienie |
|---|---|---|
| **Frontend** | Next.js 14 (App Router) + Tailwind CSS + Shadcn/UI | SSG/ISR dla SEO, Server Components dla szybkości |
| **Backend** | Next.js Server Actions + Supabase Edge Functions | Bez osobnego serwera, zero cold start |
| **Baza danych** | Supabase (PostgreSQL) + RLS | Relacyjna, RLS zapewnia bezpieczeństwo danych |
| **Auth** | Supabase Auth | Gotowe UI, obsługa sesji |
| **Storage** | Supabase Storage | Zdjęcia produktów + certyfikaty PDF + CDN |
| **AI Quiz** | Supabase Edge Functions + reguły JSON (V1) | Lekki silnik reguł bez zewnętrznych API |
| **Płatności** | PayU REST API | BLIK, karty, przelew — standard w Polsce |
| **Import** | Droplo API / BaseLinker API | Jeden agregator dla wielu hurtowni |
| **E-mail** | Resend lub SendGrid | Szablony HTML premium, darmowy tier na start |
| **Hosting** | Vercel (docelowo Docker + Coolify) | Darmowy start, łatwa migracja na VPS |
| **Monitoring** | Vercel Analytics + Google Search Console | SEO + performance bez dodatkowych kosztów |

### 9.2 Schemat bazy danych (Supabase/PostgreSQL)

Kluczowe tabele i relacje — wersja rozszerzona o moduł Premium:

| Tabela | Kluczowe kolumny |
|---|---|
| **products** | id, supplier_id, external_id, slug, name_seo, description_seo, is_seo_locked, name_original, description_original, price_original, price_sell, stock, status, is_active, is_premium_verified, images[], category_id, species[], breed_tags[], life_stage[], health_tags[], created_at, updated_at |
| **product_certificates** | id, product_id, certificate_name, issuing_body, valid_until, file_url, created_at |
| **product_endorsements** | id, product_id, vet_name, vet_title, vet_photo_url, quote, created_at |
| **product_ingredients** | id, product_id, ingredient_name, ingredient_description, is_highlighted, order_index |
| **orders** | id, customer_id (nullable), status, total_amount, payment_id, payment_status, shipping_method, shipping_cost, shipping_address (JSON), premium_packaging (bool), created_at |
| **order_items** | id, order_id, product_id, quantity, price_at_purchase, product_snapshot (JSON) |
| **customers** | id (Supabase Auth UID), email, name, created_at |
| **pet_profiles** | id, customer_id, pet_name, species, breed, birth_date, weight_kg, health_notes, created_at, updated_at |
| **health_reports** | id, pet_profile_id, order_id (nullable), report_pdf_url, quiz_data (JSON), recommendations (JSON), created_at |
| **ai_alerts** | id, customer_id, pet_profile_id, alert_type, message, product_id (nullable), is_sent, scheduled_at, sent_at |
| **suppliers** | id, name, api_type, api_key, currency, currency_buffer_pct, last_sync_at, is_active |
| **import_logs** | id, supplier_id, status, products_updated, errors_count, message, created_at |
| **categories** | id, name, slug, parent_id (nullable) |
| **shipping_methods** | id, name, provider, price, weight_limit, is_active |
| **reviews** | id, product_id, customer_id, pet_profile_id, rating, body, pet_photo_url, is_verified_purchase, created_at |

Polityki RLS (Row Level Security):
- `products`: SELECT publiczny, INSERT/UPDATE/DELETE tylko dla roli admin
- `orders`: SELECT/UPDATE tylko dla właściciela zamówienia lub admina
- `customers`: SELECT/UPDATE tylko dla właściciela (auth.uid() = id) lub admina
- `pet_profiles`: SELECT/UPDATE tylko dla właściciela lub admina
- `health_reports`: SELECT tylko dla właściciela lub admina
- `ai_alerts`: SELECT/UPDATE tylko dla właściciela lub admina
- `import_logs`, `suppliers`, `shipping_methods`: tylko admin

---

## 10. Podział na zadania (Tasks)

| ID | Zadanie | Kryteria akceptacji | Zależności |
|---|---|---|---|
| **T1** | Setup infrastruktury i bazy danych | Supabase projekt skonfigurowany, RLS aktywne, tabele premium utworzone | — |
| **T2** | Import produktów i synchronizacja | Produkty z Droplo/BaseLinker synchronizują się co 6h, flagi premium działają | T1 |
| **T3** | Frontend sklepu — listing i filtrowanie Premium | Filtrowanie po rasie, wieku, zdrowiu, filtr „Polecane przez weterynarzy", odznaki Premium Verified | T1, T2 |
| **T4** | Strona produktu Premium | Certyfikaty, endorsement weterynarza, kalkulator dawkowania, clickable ingredienty widoczne | T1, T2 |
| **T5** | Panel Admina | Edytor opisów SEO, zarządzanie certyfikatami, endorsementami, składnikami | T1, T2 |
| **T6** | AI Health Quiz | Quiz zbiera dane o zwierzęciu, generuje raport, rekomenduje produkty ze sklepu | T1, T3 |
| **T7** | Profil zdrowotny i konto klienta | Profil pupila widoczny po zalogowaniu, historia zakupów, zapisane raporty zdrowotne | T1, T6 |
| **T8** | AI Alert System | Automatyczne alerty e-mail: koniec suplementu, nowy etap życia, ryzyko zdrowotne rasy | T6, T7 |
| **T9** | Koszyk i checkout | Koszyk działa bez rejestracji, opcja premium packaging przy kasie | T1, T3 |
| **T10** | Płatności (PayU) | BLIK, karty, przelew; webhook aktualizuje status; strona potwierdzenia premium | T9 |
| **T11** | Maile transakcyjne Premium | Potwierdzenie zamówienia, raport zdrowotny PDF e-mailem D+1, alerty AI | T10, T8 |
| **T12** | Social Sharing & Recenzje | Generowanie grafik IG, recenzje z filtrem rasy, możliwość dodania zdjęcia pupila | T3, T4 |
| **T13** | Strony zaufania | /certyfikaty, /nasi-eksperci, globalna belka trust signals | T1 |
| **T14** | Opcje dostawy | InPost Paczkomat (Geowidget), DPD, stawki edytowalne z panelu admina | T9 |

---

## 11. Edge Cases i ryzyka

| Scenariusz | Ryzyko | Mitygacja |
|---|---|---|
| **Zmiana ceny u dostawcy** | Cena w sklepie nieaktualna, strata marży | Synchronizacja co 6h nadpisuje price_original; price_sell = price_original × marża |
| **Brak towaru (stock = 0)** | Klient kupuje produkt niedostępny | is_active = false gdy stock = 0; przycisk CTA nieaktywny; produkt ukryty z listingu |
| **Zmiana opisu SEO przez import** | Praca copywritera stracona | Kolumna description_seo i certyfikaty nigdy nie są nadpisywane przez skrypt importu |
| **Awaria PayU** | Zamówienie opłacone, status nieopłacony w bazie | Retry webhook (PayU ponawia 3x); endpoint idempotentny po payment_id |
| **Błąd AI Quizu (złe rekomendacje)** | Klient dostaje nieodpowiedni produkt, utrata zaufania | Rekomendacje AI zawsze z disclaimerem „konsultuj z weterynarzem"; admin może flagować produkty jako „nie dla wszystkich ras" |
| **Niepoprawny certyfikat (przeterminowany)** | Utrata wiarygodności premium | Kolumna valid_until — automatyczny alert adminowy na 30 dni przed wygaśnięciem; widoczny status certyfikatu w panelu |
| **Wyciek danych klientów + profili pupili** | Naruszenie RODO, kary finansowe; dane wrażliwe (zdrowie zwierzęcia mogą pośrednio zdradzić dane właściciela) | RLS na wszystkich tabelach; dane osobowe nie w logach; HTTPS only; dane pupili oddzielone od danych płatniczych |
| **Produkt znika z API dostawcy** | Stary link SEO prowadzi do 404; utrata pozycji | status = archived; strona „Produkt chwilowo niedostępny" (HTTP 200); przekierowanie 301 konfigurowalne |
| **Fałszywe recenzje** | Zniszczenie wiarygodności trust signals | Recenzje tylko od zweryfikowanych zakupów; moderacja admina przed publikacją |

---

## 12. Wymagania prawne (szablony)

| Wymaganie | Co zaimplementować | Podstawa prawna |
|---|---|---|
| **Regulamin sklepu** | Strona /regulamin; checkbox przy checkout; wersjonowanie | Art. 8 ustawy o świadczeniu usług drogą elektroniczną |
| **Polityka prywatności (RODO)** | Strona /polityka-prywatnosci; banner cookie consent; formularz usunięcia danych; RLS | RODO (GDPR), Ustawa o ochronie danych osobowych |
| **Prawo do zwrotu (14 dni)** | Strona /zwroty; e-mail potwierdzający zwrot; status zwrotu w panelu admina | Ustawa o prawach konsumenta (art. 27-38) |
| **Reklamacje** | Strona /reklamacje z formularzem; odpowiedź w ciągu 14 dni; historia w panelu | Kodeks cywilny, art. 556-576 (rękojmia) |
| **Faktury VAT** | Opcja NIP przy checkout; generowanie faktury PDF; faktura e-mailem | Ustawa o VAT, art. 106b |
| **[PREMIUM] Dane zdrowotne** | Dane profilu pupila (pośrednio dane właściciela) — oddzielna klauzula RODO; nie sprzedajemy danych do firm ubezpieczeniowych/weterynaryjnych | RODO art. 13; transparentność przetwarzania |
| **[PREMIUM] Certyfikaty produktów** | Archiwum certyfikatów dostępne publicznie; data ważności widoczna; disclaimer „nie zastępuje porady weterynaryjnej" przy AI raportach | Ustawa o wyrobach medycznych (przy produktach supl.) |

### 12.1 Checklist wdrożeniowy — RODO

- Formularz kontaktowy: checkbox zgody na przetwarzanie danych
- Newsletter: double opt-in, możliwość wypisania się jednym kliknięciem
- Ciasteczka: baner cookie consent przed załadowaniem Google Analytics
- AI Quiz: osobna zgoda na przetwarzanie danych zdrowotnych pupila
- Dane osobowe: przechowywane wyłącznie przez czas niezbędny + 5 lat (wymogi podatkowe)
- Breach procedure: procedura zgłaszania naruszeń do UODO w ciągu 72h
- Disclaimer AI: „Raport zdrowotny ma charakter informacyjny i nie zastępuje konsultacji z weterynarzem"

---

## 13. Metryki sukcesu (KPIs)

Projekt uznajemy za sukces, gdy w ciągu 3 miesięcy od launchu osiągamy:

| Metryka | Cel (3 miesiące) | Jak mierzyć |
|---|---|---|
| **Liczba zamówień** | > 20 / miesiąc | Panel admina + Supabase dashboard |
| **Współczynnik konwersji** | > 1.5% sesji → zamówienie | Google Analytics 4 (zdarzenie purchase) |
| **Konwersja AI Quiz → Zakup** | > 25% wypełnień quizu → zamówienie | Custom event w GA4 + Supabase |
| **Ukończenie AI Quizu** | > 60% użytkowników, którzy zaczęli | GA4 funnel + Supabase |
| **Otwarcie raportu zdrowotnego (e-mail)** | > 50% open rate | Resend/SendGrid analytics |
| **Recenzje premium (z filtrem rasy)** | > 15 recenzji z zdjęciem pupila | Supabase reviews table |
| **Błędy importu** | < 1% synchronizacji | Tabela import_logs |
| **Core Web Vitals (LCP)** | < 2.5s na mobile | Google Search Console + PageSpeed Insights |
| **Dostępność serwisu** | > 99.5% uptime | Vercel Status + UptimeRobot |
| **NPS (Net Promoter Score)** | > 60 (benchmark premium e-commerce) | E-mail survey po 14 dniach od zakupu |

---

## 14. Definicja skilli (Wiedza AI)

Agenci AI pracujący nad tym projektem powinni aktywować następujące kompetencje:

- **Next.js Expert** — App Router, Server Components, ISR/SSG dla SEO, Server Actions jako backend, next/image dla optymalizacji zdjęć
- **Supabase Architect** — Projektowanie tabel premium (pet_profiles, health_reports, ai_alerts), polityki RLS, Edge Functions dla webhooków i generowania PDF raportów
- **Integration Specialist** — REST API agregatora (Droplo/BaseLinker), PayU REST API, InPost Geowidget API, Resend/SendGrid API
- **SEO Copywriter / Technical SEO** — Frazy long-tail premium pet care, JSON-LD schema.org/Product z certyfikatami i recenzjami, unikanie duplicate content
- **UX/UI Designer (Premium E-commerce)** — Projektowanie Zero Anxiety Design, premium checkout experience, mobile-first dla persona Anny (TikTok/IG)
- **AI Rules Engine (V1)** — Projektowanie systemu reguł quizu zdrowotnego: mapowanie parametrów pupila → rekomendacje produktów → generowanie PDF raportów
- **Pet Care Domain Expert** — Predyspozycje zdrowotne ras, etapy życia psów i kotów, suplementacja, diety funkcjonalne — wiedza do budowy bazy ras i reguł AI
- **Legal / Compliance (PL)** — Ustawa o prawach konsumenta (14-dniowy zwrot), RODO (dane zdrowotne pupila), Ustawa o VAT, disclaimer AI (nie zastępuje porady weterynaryjnej)
