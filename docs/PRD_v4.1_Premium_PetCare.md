---
title: PRD – Skalowalny Sklep Dropshippingowy | Premium & Luxury Pet Care
version: '4.1'
date: 06.05.2026
edition: Trust-First Edition
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

**Wersja dokumentu:** 4.1 — Trust-First Edition (rozszerzona strategia budowania zaufania)

**Data aktualizacji:** 06.05.2026

> **Changelog v3 → v4:** Rezygnacja z używania tytułów medycznych (dr, lek. wet.) dla osób niezweryfikowanych. Wprowadzenie **Panelu Cyfrowych Kuratorów** — wirtualnych ekspertów marki (Wiktor, Julia) wygenerowanych przez AI. Nowy system odznak jakości (Standard PureCare, Wybór Ekspertów, Atest Czystego Składu). Zaktualizowane tabele DB (`brand_experts`, `expert_endorsements`). Zaostrzony disclaimer prawny.

> **Changelog v4 → v4.1:** Dodana strategia budowania zaufania na bootstrap (brak klientów na start). Wprowadzony **List Założycielski** jako sekcja na homepage + strona `/o-nas`. Trzyetapowa strategia Go-to-Market (Faza 0: właściciel testuje produkty na własnym psie → Faza 1: soft launch → Faza 2: mikro-influencerzy). Recenzje filtrowane po rasie wyciągnięte na pierwszy plan wizualnie (gdy już są). Ukrywanie sekcji recenzji dopóki brak min. 5-10 recenzji. Mikrokopia rozbrajająca lęk Anny w trzech momentach (skład, cena, kasa). Gwarancja zwrotu komunikowana dosłownie przy przycisku „Zapłać". Blog z artykułami autorstwa Wiktora i Julii przesunięty do V2 (slug `/blog` zarezerwowany od początku). Strona `/eksperci` z dumną transparentnością co do cyfrowego charakteru Kuratorów (bez stopki, bez ukrywania).

---

## 1. Cel projektu (Vision)

Stworzenie skalowalnego sklepu dropshippingowego skierowanego do klientów indywidualnych (B2C) na rynku polskim, pozycjonowanego **wyłącznie w segmencie Premium i Luxury Pet Care**. Sklep nie konkuruje ceną — konkuruje zaufaniem, prestiżem i poczuciem bezpieczeństwa, jakie daje właścicielowi zwierzęcia.

Marka pozycjonowana jest jako **„Kurator Dobrostanu"** — nie sprzedaje wyłącznie produktów, ale dostarcza „spokój ducha" (peace of mind) poprzez rygorystyczną selekcję i wsparcie technologii AI.

Produkt odpowiada na globalny trend **Pet Humanization**: zwierzę jest pełnoprawnym członkiem rodziny, a jego zdrowie i komfort są traktowane z taką samą powagą jak zdrowie dziecka. Nasz klient nie szuka najtańszej opcji — szuka **najlepszej**.

**Kluczowe założenia**

- **Premium positioning:** Każdy element sklepu — od UX po copywriting — ma komunikować jakość, bezpieczeństwo i prestiż.
- **Darmowy start:** Vercel Free + Supabase Free tier pokrywają MVP; architektura gotowa na szybki scaling.
- **SEO-first:** Next.js App Router z SSG/ISR, JSON-LD, meta tags zoptymalizowane pod frazy premium.
- **Trust-building by design:** Odznaki jakości, Panel Cyfrowych Kuratorów, raporty zdrowotne i AI-alerty jako główne wyróżniki.
- **Skalowalność:** Architektura gotowa na Docker + Coolify od pierwszego dnia.
- **Zgodność prawna by design:** Brak tytułów medycznych dla osób niezweryfikowanych; transparentność co do cyfrowego charakteru ekspertów marki.

---

## 2. Grupa Docelowa (Target Audience)

### 2.1 Profil Segmentu: Premium / Luxury Pet Care — Pet Humanization

Nasz klient należy do rosnącego, globalnego ruchu **Pet Humanization** — grupy właścicieli zwierząt, którzy świadomie traktują pupila jako pełnoprawnego członka rodziny („First Child Pet"). W Polsce segment ten dynamicznie rośnie, napędzany przez odkładanie decyzji o posiadaniu dzieci oraz wzrost zamożności klasy średniej i wyższej.

**Charakterystyka psychograficzna:**

- **Status pupila:** Zwierzę to „pierwsze dziecko" (First Child) lub jedyne dziecko w rodzinie. Właściciel mówi o nim w pierwszej osobie: „mój pies potrzebuje", „kot czuje się lepiej". Traktowanie zwierzęcia jako „tylko zwierzęcia" jest dla tej grupy obraźliwe.
- **Motywacje zakupowe:** Skrajna troska o zdrowie i bezpieczeństwo. Klient jest gotowy zapłacić wysoką cenę za produkt lub usługę, która **wykryje problem zanim wystąpi** (filozofia prewencji). Kupuje „spokój ducha" (peace of mind), nie produkt.
- **Podejście do ceny:** Cena jest drugorzędna — liczy się skuteczność, jakość i poczucie, że daje się zwierzęciu **to, co najlepsze na rynku**. Wysoka cena jest często postrzegana jako sygnał jakości.
- **Stosunek do marek:** Lojalny wobec marek, które budują relację i komunikują się językiem eksperta. Nieufny wobec sklepów generycznych. Poszukuje rekomendacji ekspertów i specjalistów.
- **Zachowania zakupowe:** Skłonny do wyrzeczeń we własnym budżecie, by zapewnić zwierzęciu najwyższy standard. Regularnie kupuje produkty premium (karmy, suplementy, akcesoria premium). Aktywny w mediach społecznościowych — chętnie dzieli się zakupami i sukcesami zdrowotnymi pupila.

### 2.2 Market Psychology — Mapa Emocjonalna Klienta

Rozumienie psychologii klienta jest kluczem do projektowania każdej funkcji sklepu:

| Emocja / Stan | Trigger | Jak sklep odpowiada |
|---|---|---|
| **Lęk o zdrowie** | „Co jeśli produkt jest szkodliwy?" | Odznaki jakości (Standard PureCare, Atest Czystego Składu), skład weryfikowany przez Panel Kuratorów, AI-alert przy potencjalnym zagrożeniu |
| **Potrzeba kontroli** | „Chcę wiedzieć wszystko o tym, co daję pupilowi" | Pełna transparentność składu, raporty zdrowotne, historia zakupów z wpływem na zdrowie |
| **Duma i prestiż** | „Daję mojemu zwierzęciu to, co najlepsze" | Social sharing, odznaki „Premium Owner", ekskluzywne edycje limitowane |
| **Poczucie winy** | „Czy robię wystarczająco dużo?" | Rekomendacje prewencyjne, przypomnienia o uzupełnieniu suplementów, personalizowane plany dobrostanu |
| **Przynależność** | „Chcę być częścią społeczności ludzi, którzy dbają o zwierzęta" | Program ambasadorski, recenzje społeczności, funkcje social sharing |
| **Zaufanie do eksperta** | „Czy to polecają specjaliści?" | Endorsementy Panelu Cyfrowych Kuratorów widoczne przy każdym produkcie, odznaki jakości |

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
- Dostęp do najnowszych, premium produktów niedostępnych w zwykłych sklepach
- Personalizowane rekomendacje dla konkretnej rasy, wieku i wagi psa
- Wygodny, szybki zakup (zapisane adresy, karty, Apple Pay/BLIK) bez konieczności każdorazowego researchu
- Możliwość pochwalenia się zakupem — unboxing experience, eleganckie opakowanie

**Frustracje:**
- Sklepy, które nie oferują filtrowania po rasie lub specjalnych potrzebach zdrowotnych
- Brak informacji o składzie i odznakach jakości (musi sam weryfikować)
- Generyczny wygląd stron — brak poczucia premium
- Brak możliwości oceny czy produkt jest odpowiedni dla konkretnego zwierzęcia

**Scenariusz zakupowy:**
Marek szuka suplementu na stawy dla Maxa (7 lat). Wchodzi na stronę, filtruje po rasie i wieku psa. System AI rekomenduje produkt z odznaką „Wybór Ekspertów" (rekomendowany przez Panel Cyfrowych Kuratorów) i ocenami od właścicieli golden retrieverów. Marek dodaje do koszyka, płaci Apple Pay/BLIK. Otrzymuje PDF z raportem profilaktycznym i planem suplementacji. Udostępnia zakup na IG Stories z tagiem sklepu.

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
- Intensywnie researuje przed zakupem — czyta składy, porównuje, szuka recenzji ekspertów
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
Anna widzi reklamę na Instagramie — „Sprawdź, czy dieta Twojej Zuzi jest kompletna". Klika w link, który prowadzi do bezpłatnego AI quizu zdrowotnego dla Zuzi (3 lata, kastrowana kotka). Quiz generuje raport (z disclaimerem informacyjnym) i rekomenduje konkretny produkt z odznaką „Atest Czystego Składu", wyjaśniając dlaczego jest bezpieczny. Anna widzi cenę — to wydatek, ale strona wyjaśnia: „Ta ilość wystarczy na 3 miesiące — 8 zł dziennie za zdrowie Twojej Zuzi". Kupuje. Następnego dnia dostaje e-mail z „Profilem Dobrostanu Zuzi" i przypomnieniem za 3 miesiące.

---

## 4. Strategia Ekspercka (Legal & Trust) — Panel Cyfrowych Kuratorów

> **Kluczowa zmiana w v4:** Zgodnie z wymogami prawnymi i etyką marki Premium, **rezygnujemy z używania tytułów medycznych** (dr, lek. wet.) dla osób niezweryfikowanych. Budujemy autorytet w oparciu o transparentny **Panel Cyfrowych Kuratorów**.

### 4.1 Wirtualni Eksperci Marki

W sekcji `/eksperci` prezentujemy postacie wygenerowane przez AI, które pełnią rolę opiekunów standardów sklepu:

| Ekspert | Rola | Specjalizacja |
|---|---|---|
| **Wiktor** | Główny Analityk Formuł Żywieniowych | Technologiczna weryfikacja składów, zgodność z normami żywieniowymi, identyfikacja problematycznych składników |
| **Julia** | Kuratorka Wellness i Harmonii Ras | Personalizacja profilaktyki pod konkretne rasy i etapy życia, dobrostan emocjonalny, dopasowanie produktów do potrzeb behawioralnych |

### 4.2 Transparentność Cyfrowego Charakteru Ekspertów — Dumna, nie ukryta

> **Zasada wiodąca v4.1:** Cyfrowy charakter Kuratorów to **atut, nie wstyd**. Komunikujemy go z dumą jako innowację technologiczną — ale wyłącznie na stronie `/eksperci`, nie w stopce każdej podstrony.

**Co implementujemy:**

- **Strona `/eksperci`** zawiera jednoznaczną, pozytywnie sformułowaną informację o cyfrowym charakterze Wiktora i Julii. Nie jest to ukryte w stopce — to integralna część narracji o ekspertach.
- **Sformułowanie wzorcowe:** *„Wiktor i Julia to cyfrowi Kuratorzy — syntetyzujemy tysiące badań żywieniowych i danych o rasach, żebyś nie musiał. To nie zastępuje weterynarza, ale daje Ci wiedzę, z którą idziesz do gabinetu przygotowany."*
- **Link do `/eksperci`** musi być widoczny w głównej nawigacji lub w stałym elemencie strony (np. belka trust signals). Nie może być schowany.
- **Na karcie produktu** przy endorsementie Kuratora zawsze widoczny link/ikona prowadząca do `/eksperci` — np. „Wybór Wiktora — Analityka Formuł" + mała ikona „i" / link.
- **Bezwzględny zakaz** używania słów „lekarz", „weterynarz", „klinika", „dr", „lek. wet." w kontekście Wiktora i Julii — w copy, alt-tekstach, JSON-LD, e-mailach.
- **Brak sformułowań sugerujących biologiczną osobę** — np. „nasz ekspert zbadał osobiście", „specjalista odwiedził producenta" — nawet bez tytułu medycznego.

**Dlaczego ten model jest prawnie bezpieczny:**

Polskie prawo (i unijna dyrektywa o nieuczciwych praktykach rynkowych) wymaga, żeby konsument **nie był wprowadzony w błąd** co do natury podmiotu wystawiającego rekomendację. Nie wymaga jednak, żeby informacja była powtórzona na każdej podstronie. Wystarczy, że:
1. Informacja jest dostępna i łatwa do znalezienia (jeden klik z karty produktu).
2. Sam opis ekspertów nigdzie nie sugeruje, że to ludzie.
3. Komunikaty o rekomendacji są neutralne („Wybór Wiktora") i prowadzą do strony, na której wyjaśniamy kim Wiktor jest.

**Plan ewolucji (V2+):** W kolejnej fazie marka planuje pozyskać prawdziwego weterynarza-partnera (np. konsultacje przy klinice, zewnętrzny audyt metodologii). Wówczas Panel Cyfrowych Kuratorów zostanie rozszerzony o ludzkiego eksperta — co zostanie zakomunikowane jako naturalny rozwój marki: *„Nasz Panel Kuratorów zyskał pierwszego ludzkiego partnera."*

### 4.3 Zasady Komunikacji Eksperckiej

- ✅ „Wybór Ekspertów" / „Rekomendacja Panelu Kuratorów" / „Wybrane przez Wiktora"
- ✅ „Analityk Formuł" / „Kuratorka Wellness"
- ❌ „Polecane przez weterynarza" / „dr Kowalska poleca" / „Klinika rekomenduje"
- Każdy raport zdrowotny i każda rekomendacja zawiera klauzulę: *„Analiza ma charakter informacyjny i nie zastępuje konsultacji u lekarza weterynarii."*

---

## 5. Strategia Budowania Zaufania (Bootstrap Trust) — v4.1

> **Problem do rozwiązania:** Na starcie sklep nie ma klientów, więc nie ma recenzji. Anna szuka opinii „od równych sobie", ale ich jeszcze nie ma. Wiktor i Julia jako AI nie mają licencji ani reputacji do stracenia. Trzeba zbudować zaufanie z innych źródeł.

### 5.1 List Założycielski — Twój głos jako twórcy

To **najsilniejszy element całej strategii zaufania na start**. Anna nie ufa markom — ufa ludziom. Jeśli zobaczy, że za sklepem stoi konkretna osoba, która karmi własnego psa tymi produktami i pokazuje efekty, to dokładnie ten rodzaj autentyczności, której szuka.

**Lokalizacja w sklepie:**

- **Sekcja na stronie głównej (obowiązkowa, V1):** Zaraz po hero i listingu featured produktów. Anna nie musi nigdzie klikać — po prostu to widzi przy scrollowaniu.
- **Strona `/o-nas` (obowiązkowa, V1):** Pełna wersja Listu Założycielskiego z większą ilością zdjęć, dłuższą historią, szczegółami filozofii marki. Link z sekcji na homepage („Przeczytaj całą historię").

**Format sekcji na homepage:**

- Jedno zdjęcie — właściciel z psem, naturalne, **niekoniecznie profesjonalne** (autentyczność > polish)
- 3–5 zdań tekstu, pierwsza osoba, zero korporacyjnego języka
- CTA: „Przeczytaj całą historię" → `/o-nas`

**Sformułowanie wzorcowe (do dostosowania przez właściciela):**

> *„Mam psa od 7 lat i przez większość tego czasu nie wiedziałem, co mu właściwie daję. Pewnego dnia przeczytałem skład karmy, którą kupowałem od lat — i przestałem ją kupować. Ten sklep powstał, żeby inni nie musieli przez to przechodzić."*

**Zasady copywritingu Listu Założycielskiego:**

- Pierwsza osoba liczby pojedynczej („ja", „mój pies")
- Konkretny moment przełomowy (nie ogólniki typu „zawsze kochałem zwierzęta")
- Imię własnego psa — buduje paralelę z Maxem/Zuzią klienta
- Brak języka sprzedażowego — to ma być wyznanie, nie pitch
- Odwołanie do tej samej frustracji, którą czuje Anna („nie wiedziałem, co daję")

### 5.2 Strategia Go-to-Market w Trzech Fazach

| Faza | Czas | Co się dzieje | Cel zaufania |
|---|---|---|---|
| **Faza 0 — Pre-launch (Eat your own dog food)** | T-2 do T-0 miesięcy przed launchem | Właściciel zamawia produkty do siebie, testuje na własnym psie, dokumentuje (zdjęcia, wideo, obserwacje), pisze pierwsze szczere opinie (również krytyczne) | Pierwszy autentyczny content; Lista Założycielska oparta na realnym doświadczeniu |
| **Faza 1 — Soft launch** | Miesiące 1–3 po launchu | Sklep działa, pierwsze organiczne zamówienia, zbieranie recenzji od pierwszych klientów, dopracowywanie UX na podstawie real-life feedback | Pierwsze recenzje od „równych sobie" — przebijają próg minimum 5–10 recenzji potrzebnych do odsłonięcia sekcji |
| **Faza 2 — Growth (mikro-influencerzy)** | Miesiąc 3+ | Współpraca z mikro-influencerami ze zwierzakami (Instagram/TikTok, do 50k followersów); barter lub niska opłata za szczerą recenzję ze zdjęciem pupila | Skalowanie zasięgu; recenzje z autorytetem, ale bez koszmaru cenowego dużych kont |
| **Faza 3 — Trust expansion (V2+)** | Miesiąc 6+ | Pozyskanie prawdziwego weterynarza-partnera (konsultacje przy klinice, audyt metodologii Kuratorów AI); rozszerzenie Panelu o ludzkiego eksperta | Najwyższy poziom zaufania; komunikacja: „Nasz Panel zyskał pierwszego ludzkiego partnera" |

**Dlaczego ta kolejność jest właściwa:**

- Najpierw sprawdzasz, czy produkt działa i czy sklep technicznie funkcjonuje (Faza 0 + 1) — zanim ściągniesz ruch z zewnątrz (Faza 2). Odwrotna kolejność to ryzyko, że coś pójdzie nie tak przy dużym ruchu i spalisz okazję u influencera.
- List Założycielski w Fazie 0 buduje narrację „sklep, który zna swój produkt" — to zupełnie inna marka niż „sklep, który sprzedaje rzeczy, których nie zna".

### 5.3 Recenzje — Strategia „No Review, No Section"

> **Zasada:** Lepiej brak sekcji niż pusta sekcja, która krzyczy „nikt tu nie kupuje".

**Reguły implementacji:**

- **Próg odsłonięcia:** Sekcja recenzji na karcie produktu nie wyświetla się, dopóki produkt nie ma minimum **5 recenzji** od zweryfikowanych zakupów.
- **Dopóki nie ma recenzji klientów:** Sekcja zastąpiona blokiem **„Co mówią dane o tej formule"** — autorstwa Wiktora, oparty na opisie składników i ich właściwości. To utrzymuje narrację eksperckości bez kłamstwa o popularności.
- **Beta-testerzy jako kickstarter:** Przed launchem (Faza 0) zaproszenie 5–10 osób z grup na Facebooku („Właściciele kotów Polsce", grupy ras) na darmowy produkt w zamian za szczerą recenzję ze zdjęciem pupila. Cel: minimum 5 recenzji na top 3–5 produktów w dniu otwarcia.
- **Po przekroczeniu progu:** Pełna sekcja recenzji z filtrem rasy i wieku — wizualnie wyciągnięta na pierwszy plan (nad opisem produktu lub tuż pod galerią), bo to najsilniejszy trust signal dla Anny.

### 5.4 Mikrokopia Rozbrajająca Lęk Anny — Trzy Momenty Wahania

Anna waha się najmocniej w trzech miejscach. Każdy z nich wymaga dedykowanej mikrokopii.

**Moment 1: Strona produktu — sekcja składu**

- **Lęk:** „Co jeśli to ma jakiś szkodliwy składnik?"
- **Mikrokopia:** Każdy składnik klikalny + tooltip z neutralnym opisem („Tauryna — niezbędna dla zdrowia serca kotów"). Nad sekcją etykieta: *„Skład rozłożony na czynniki pierwsze — bez tajemnic."*
- **Sygnał wizualny:** Zielona ikona przy każdym składniku, który przeszedł walidację Standardu PureCare.

**Moment 2: Strona produktu — komunikacja ceny**

- **Lęk:** „To strasznie drogie, czy na pewno mnie stać?"
- **Mikrokopia (już w aktualnym brieferze właściciela):** „1,33 zł dziennie — tyle co kawa, dla zdrowia [imię pupila]." Format: cena za dzień użytkowania, porównanie do trywialnego wydatku.
- **Czego unikamy:** Sformułowań, które brzmią jak usprawiedliwienie kosztu („to wystarczy na długo"). Reframing > rationalization.

**Moment 3: Checkout — przycisk „Zapłać"**

- **Lęk:** „A co jeśli pupil nie polubi tego produktu? Stracę pieniądze."
- **Mikrokopia:** Bezpośrednio nad lub pod przyciskiem płatności: *„Twój pupil nie polubił produktu? Zwrot bez pytań w ciągu 14 dni."* Z ikoną tarczy/gwarancji.
- **Wymóg techniczny:** Ten komunikat MUSI być widoczny **bez scrollowania** w widoku checkout — nie w regulaminie, nie w FAQ, nie w stopce. Dosłownie obok przycisku.

### 5.5 Co świadomie odkładamy na V2+

- **Blog z artykułami autorstwa Wiktora i Julii** — wymaga regularnej operacji contentowej, SEO pod konkretne frazy, czasu na indeksację. Na MVP zbyt obciążające. **Slug `/blog` zostaje zarezerwowany od początku** w architekturze routingu, żeby uniknąć bolesnej przebudowy.
- **Prawdziwy weterynarz-partner** — Faza 3, po osiągnięciu pierwszego progu sprzedaży i stabilizacji metodologii Kuratorów AI.
- **Program lojalnościowy „Strażnik Dobrostanu"** — V2 (już zapisane w Non-Goals).

---

## 6. User Stories

### Klient (B2C) — Premium Pet Owner

- Jako właściciel psa chcę filtrować produkty po rasie, wieku i wadze zwierzęcia, żeby mieć pewność, że wybieram odpowiedni produkt.
- Jako Pet Parent chcę widzieć przy każdym produkcie odznakę jakości (Standard PureCare / Wybór Ekspertów / Atest Czystego Składu), żeby mieć pewność, że to bezpieczne.
- Jako klient premium chcę zobaczyć pełny skład produktu z wyjaśnieniem każdego składnika, żeby świadomie podjąć decyzję.
- Jako Anna chcę otrzymać AI raport zdrowotny mojego zwierzęcia po zakupie, żeby wiedzieć, czy podejmuję właściwą decyzję — z jasnym disclaimerem, że nie zastępuje on konsultacji weterynaryjnej.
- Jako Marek chcę mieć możliwość udostępnienia zakupu lub oceny produktu na mediach społecznościowych, żeby podzielić się ze społecznością.
- Jako klient chcę zapłacić BLIKiem lub Apple Pay, bo cenię wygodę i szybkość.
- Jako stały klient chcę mieć historię zakupów z profilami dobrostanu moich zwierząt, żeby śledzić ich postępy.
- Jako Pet Parent chcę otrzymywać spersonalizowane przypomnienia o uzupełnieniu suplementów lub zmianie produktu, żeby nie przegapić ważnego momentu w cyklu dobrostanu zwierzęcia.
- Jako klient chcę widzieć recenzje od zweryfikowanych właścicieli tej samej rasy, bo to najbardziej wiarygodna opinia.

### Administrator

- Jako admin chcę edytować opisy i nazwy produktów bez utraty zmian przy kolejnym imporcie.
- Jako admin chcę widzieć zamówienia i ich statusy w jednym miejscu.
- Jako admin chcę być powiadamiany e-mailem o każdym nowym zamówieniu.
- Jako admin chcę zarządzać odznakami jakości (Standard PureCare, Wybór Ekspertów, Atest Czystego Składu) dla każdego produktu.
- Jako admin chcę zarządzać endorsementami Panelu Cyfrowych Kuratorów (Wiktor, Julia) i przypisywać je do produktów.
- Jako admin chcę zarządzać quizem zdrowotnym AI i mapowaniem pytań na produkty.
- Jako admin chcę widzieć analitykę: które produkty są najczęściej rekomendowane przez AI i jaką mają konwersję.
- Jako admin chcę importować produkty z kilku hurtowni przez jedno API i oznaczać wybrane jako „Premium Verified".

---

## 7. Funkcjonalności (Features)

### 7.1 Import produktów

- Integracja z agregatorem (Droplo lub BaseLinker) jako pojedynczy punkt wejścia dla wszystkich hurtowni
- Obsługiwane źródła: polskie hurtownie dropship (Droplo, Sky-shop), zagraniczne (AliExpress), specjalistyczne hurtownie pet care premium
- Synchronizacja co 6 godzin przez Vercel Cron Job
- Logika aktualizacji: ceny i stany magazynowe są nadpisywane, opisy SEO i odznaki jakości — nigdy
- Tabela `import_logs` z historią synchronizacji i błędami
- **[PREMIUM]** Flaga `is_premium_verified` — admin ręcznie oznacza produkty, które przeszły weryfikację składu i otrzymały odznakę jakości

### 7.2 Edytor SEO i treści Premium w panelu admina

- Nadpisywanie nazwy, opisu, slug URL, meta description dla każdego produktu
- Widok oryginalnych danych z hurtowni obok edytowanych (tryb porównania)
- Upload zdjęć do Supabase Storage (maks. 5 MB, formaty: WebP, JPG, PNG)
- **[PREMIUM]** Edytor sekcji „Dlaczego Premium?" — pole na narrację o jakości produktu, historię producenta, metodę produkcji
- **[PREMIUM]** Zarządzanie odznakami jakości: przypisywanie produktu do jednej lub wielu odznak (Standard PureCare / Wybór Ekspertów / Atest Czystego Składu) z datą weryfikacji
- **[PREMIUM]** Endorsement Panelu Cyfrowych Kuratorów: wybór eksperta (Wiktor / Julia), cytat (max 280 znaków), data walidacji
- **[PREMIUM]** Mapa składu: opcjonalny interaktywny breakdown składu produktu z opisem każdego składnika

### 7.3 Frontend sklepu — Doświadczenie Premium

- Listing produktów: filtrowanie po kategorii, cenie, dostępności
- **[PREMIUM]** Zaawansowane filtrowanie: gatunek zwierzęcia, rasa, wiek, waga, stan zdrowia (np. „wrażliwy żołądek", „stawy", „sierść")
- **[PREMIUM]** Filtr „Wybór Ekspertów" — wyświetla tylko produkty z endorsementem Panelu Cyfrowych Kuratorów
- Strona produktu: h1, meta description, JSON-LD (Product schema), galeria zdjęć
- **[PREMIUM]** Sekcja „Bezpieczeństwo i jakość" widoczna na karcie produktu (ikony odznak jakości + szczegóły kryteriów)
- **[PREMIUM]** Sekcja „Rekomenduje Panel Kuratorów" z miniaturą eksperta (Wiktor / Julia), cytatem **i linkiem/ikoną „i" prowadzącą do `/eksperci`** (transparentność jednym kliknięciem)
- **[PREMIUM v4.1]** **Sekcja składu z klikalnymi tooltipami** — każdy składnik ma tooltip z neutralnym opisem („Tauryna — niezbędna dla zdrowia serca kotów"); etykieta nad sekcją: *„Skład rozłożony na czynniki pierwsze — bez tajemnic."*; zielona ikona przy składnikach walidowanych przez Standard PureCare
- **[PREMIUM v4.1]** **Komunikacja ceny w formacie dziennym** — przy cenie produktu obowiązkowo: *„X zł dziennie — tyle co kawa, dla zdrowia [imię pupila]"* (kalkulacja: cena ÷ liczba dni użytkowania na podstawie kalkulatora dawkowania)
- **[PREMIUM v4.1]** **Hierarchia trust signals na karcie produktu** — recenzje z filtrem rasy wyciągnięte wizualnie na pierwszy plan (nad opisem produktu lub tuż pod galerią), gdy przekroczony próg min. 5 recenzji; przed progiem zastąpione blokiem „Co mówią dane o tej formule" autorstwa Wiktora
- **[PREMIUM]** Kalkulator dawkowania: waga i wiek zwierzęcia → dzienna dawka produktu
- **[PREMIUM]** Odznaka „Premium Verified" na miniaturce produktu na listingu
- Przycisk „Kup teraz" nieaktywny gdy stock = 0
- Core Web Vitals: LCP < 2.5s (Next.js Image optimization, ISR)

### 7.4 System Odznak Jakości (Trust Badges)

Sklep posiada własny system odznak widocznych na kartach produktów:

| Odznaka | Kryterium | Kto przyznaje |
|---|---|---|
| **Standard PureCare** | Produkt bez sztucznych konserwantów i wypełniaczy | Walidacja składu w panelu admina |
| **Wybór Ekspertów** | Produkt rekomendowany przez Panel Cyfrowych Kuratorów (Wiktor / Julia) | Przypisanie endorsementu w panelu admina |
| **Atest Czystego Składu** | Potwierdzenie pełnej transparentności składników | Walidacja dokumentacji w panelu admina |

Produkt może otrzymać 1, 2 lub 3 odznaki jednocześnie. Odznaki są widoczne:
- Na miniaturce produktu (listing)
- Na karcie produktu w sekcji „Bezpieczeństwo i jakość"
- W stopce e-maili transakcyjnych
- Na stronie `/standardy-jakosci` — opis każdej odznaki i kryteriów

### 7.5 AI Health Quiz & Personalizacja (Kluczowa Funkcja Premium)

Jest to główny wyróżnik sklepu, odpowiadający bezpośrednio na potrzebę „peace of mind" obu person.

- **Quiz zdrowotny:** Krok po kroku zbiera dane o zwierzęciu (gatunek, rasa, wiek, waga, aktywność, obecna dieta, obserwowane objawy lub problemy)
- **Wynik quizu:** Spersonalizowany raport oparty o **„Standard Jakości Premium PetCare"** — z oceną aktualnego stanu i obszarami do poprawy. Rekomendacje **nie stanowią diagnozy medycznej**.
- **Rekomendacje produktów:** AI mapuje profil dobrostanu na konkretne produkty ze sklepu z wyjaśnieniem, dlaczego ten produkt odpowiada potrzebom tego konkretnego zwierzęcia
- **Profil dobrostanu zwierzęcia:** Zapisywany w koncie klienta, aktualizowany przy każdym zakupie i kolejnym wypełnieniu quizu
- **AI Alert System:** Automatyczne powiadomienia e-mail/push gdy:
  - Zbliża się koniec suplementu (na podstawie historii zakupów i dawkowania)
  - Wiek zwierzęcia wchodzi w nowy etap życia wymagający zmiany diety
  - W asortymencie pojawia się produkt lepiej dopasowany do profilu zwierzęcia
  - Wykryto potencjalny obszar uwagi na podstawie profilu (np. rasa predysponowana do problemów stawowych — alert po 5. roku życia)
- **Baza danych ras:** Informacje o predyspozycjach popularnych ras psów i kotów
- **Disclaimer (obowiązkowy w każdym raporcie):** *„Analiza ma charakter informacyjny i nie zastępuje konsultacji u lekarza weterynarii."*
- Panel admina: podgląd najczęstszych profili dobrostanu, konwersja rekomendacji AI → zakup

### 7.6 Koszyk i checkout

- Koszyk działający bez rejestracji (zapisywany w localStorage)
- Dwie ścieżki: zakup jako gość (tylko e-mail + adres) lub z kontem (zalecane dla dostępu do profilu dobrostanu)
- Wybór dostawy: InPost Paczkomat (Geowidget), kurier DPD, inne
- **[PREMIUM]** Opcja „Premium Packaging" przy kasie: eleganckie opakowanie z personalizowaną karteczką (+X PLN)
- **[PREMIUM v4.1]** **Gwarancja zwrotu — dosłownie przy przycisku „Zapłać"** (widoczna bez scrollowania): *„Twój pupil nie polubił produktu? Zwrot bez pytań w ciągu 14 dni."* z ikoną tarczy/gwarancji. **Wymóg krytyczny:** komunikat NIE może być w regulaminie, FAQ ani stopce — musi być w bezpośrednim sąsiedztwie CTA płatności.
- Opcja podania NIP do faktury VAT

### 7.7 Płatności (PayU)

- Metody: BLIK, karty kredytowe/debetowe, przelew online
- Webhook PayU aktualizuje status zamówienia w Supabase
- Strona potwierdzenia zamówienia po udanej płatności
- **[PREMIUM]** Strona potwierdzenia zawiera: personalizowane „Dziękujemy, że dbasz o [imię pupila]" + link do pobrania raportu dobrostanu PDF

### 7.8 Maile transakcyjne — Premium Touch

- Klient: potwierdzenie zamówienia (produkty, kwota, adres, nr referencyjny)
- Admin: powiadomienie o nowym zamówieniu
- Dostawca e-mail: Resend lub SendGrid (SMTP przez Supabase Edge Functions)
- **[PREMIUM]** E-mail powitalny po rejestracji: „Witaj w rodzinie [Nazwa Sklepu] — razem zadbamy o [imię pupila]"
- **[PREMIUM]** E-mail po zakupie (D+1): „Raport dobrostanu dla [imię pupila]" — PDF z profilem i planem suplementacji + disclaimer informacyjny
- **[PREMIUM]** E-mail prewencyjny (oparty o AI Alert): personalizowane powiadomienie z rekomendacją produktu i wyjaśnieniem

### 7.9 Program Lojalności & Social Sharing (Premium Community)

- **[PREMIUM V2]** Program „Strażnik Dobrostanu": punkty za zakupy, recenzje produktów, polecenia znajomych
- **[PREMIUM]** Social Sharing: przycisk „Podziel się z innymi Pet Parents" na stronie produktu i po zakupie — generuje gotową grafikę do IG/Facebook ze zdjęciem produktu i oceną
- **[PREMIUM V2]** Odznaki „Premium Owner": osiągnięcia za regularne dbanie o dobrostan zwierzęcia (np. „6 miesięcy suplementacji", „Prewencja stawów u seniora")
- **[PREMIUM]** Sekcja recenzji z filtrem rasy — „Co mówią właściciele golden retrieverów"
- **[PREMIUM]** Możliwość dodania zdjęcia pupila do recenzji — buduje autentyczność i social proof

### 7.10 Trust Signals i Strony Zaufania

- **[PREMIUM]** Globalna belka trust signals: ikony odznak jakości, „Wybór Ekspertów", „Bezpieczny skład"
- **[PREMIUM]** Strona `/standardy-jakosci` z opisem każdej odznaki i kryteriów
- **[PREMIUM v4.1]** Strona `/eksperci` — Panel Cyfrowych Kuratorów (Wiktor, Julia) z biogramami i **dumnie skomunikowaną** informacją o cyfrowym charakterze (integralna część narracji, nie ukryta w stopce)
- **[PREMIUM v4.1]** **Strona `/o-nas`** — pełna wersja Listu Założycielskiego z większą ilością zdjęć, dłuższą historią, szczegółami filozofii marki; link prowadzi tu z sekcji homepage
- **[PREMIUM v4.1]** **Sekcja „List Założycielski" na homepage** (zaraz po hero) — zdjęcie właściciela z psem, 3-5 zdań w pierwszej osobie, CTA „Przeczytaj całą historię" → `/o-nas`
- **[PREMIUM]** Badge „Wybierane najczęściej przez naszych Kuratorów" (jeśli poparte danymi)
- **[PREMIUM]** Ikona „Skład zweryfikowany" przy każdym składniku na stronie produktu

---

## 8. Gap Analysis — Funkcje Premium vs. Obecny Standard

Poniższa tabela pokazuje, jakie funkcje są wymagane, by sklep był postrzegany jako „Premium Must-Have" przez zidentyfikowane persony.

| Obszar | Standard (obecny) | Premium Gap | Priorytet |
|---|---|---|---|
| **Filtrowanie produktów** | Kategoria, cena, dostępność | Rasa, wiek, waga, stan zdrowia | 🔴 Krytyczny |
| **Strona produktu** | Zdjęcia, opis, cena | Odznaki jakości, endorsement Panelu Kuratorów, kalkulator dawki, skład z opisem | 🔴 Krytyczny |
| **Personalizacja** | Brak | AI Quiz, profil dobrostanu zwierzęcia, historia zakupów | 🔴 Krytyczny |
| **Alerty i prewencja** | Brak | AI Alert System: koniec suplementu, nowy etap życia, obszary uwagi rasy | 🔴 Krytyczny |
| **Trust signals** | Brak | Odznaki jakości (3 typy), endorsementy Panelu Cyfrowych Kuratorów, strona /eksperci | 🔴 Krytyczny |
| **Post-purchase** | E-mail z numerem zamówienia | Raport dobrostanu PDF, personalizowane „Dziękujemy", plan suplementacji | 🟠 Wysoki |
| **Social sharing** | Brak | Generowanie grafik IG, odznaki właścicielskie, recenzje z filtrem rasy | 🟠 Wysoki |
| **Premium packaging** | Standardowa dostawa | Opcja premium opakowania z karteczką personalną | 🟠 Wysoki |
| **Edukacja** | Opis produktu z hurtowni | Sekcja „Dlaczego Premium?", breakdown składu, artykuły edukacyjne | 🟠 Wysoki |
| **Program lojalnościowy** | Non-goal w V1 | Program „Strażnik Dobrostanu" z punktami i odznakami | 🟡 V2 |
| **Subskrypcja** | Brak | Autodelivery suplementów co X tygodni | 🟡 V2 |

---

## 9. Tone of Voice & Strategia Komunikacji

### 9.1 Filozofia Komunikacji

Sklep nie sprzedaje produktów dla zwierząt — **sprzedaje spokój ducha właścicielom**. Każde słowo na stronie powinno odpowiadać na pytanie: „Czy to jest bezpieczne dla mojego zwierzęcia i czy daję mu to, co najlepsze?"

Język korzyści zastępuje język funkcji:
- ❌ „Suplement z glukozaminą 500 mg"
- ✅ „Twój pies wstanie rano bez bólu — naturalnie, bezpiecznie, ze składem zweryfikowanym przez Panel Kuratorów"

### 9.2 Filary Tone of Voice

**1. Empatia, nie sprzedaż**
Mówimy jak ktoś, kto rozumie, że to nie jest „tylko pies". Używamy imienia zwierzęcia (Max, Zuzia) wszędzie tam, gdzie to możliwe. Nigdy nie minimalizujemy przywiązania.

**2. Ekspertyza technologiczna, nie sprzedawca**
Edukujemy, zanim prosimy o zakup. Raport dobrostanu → rekomendacja → zakup. Mówimy o „precyzyjnej analizie", „standardach czystości" i „biologicznej zgodności".

**3. Prestiż przez minimalizm, nie przez pompowanie**
Premium nie krzyczy. „Curated for Excellence" zamiast „NAJLEPSZY PRODUKT!!!". Używamy spokojnych, pewnych sformułowań.

**4. Bezpieczeństwo jako główna obietnica**
Każdy opis produktu musi zawierać jasną odpowiedź na pytanie: „Czy to jest bezpieczne?" — zanim klient zapyta.

**5. Prewencja, nie reakcja**
Język przyszłości: „Zapobiegnij problemom stawowym zanim się pojawią", „Zacznij dbać o wzrok kota w 5. roku życia". Klient kupuje profilaktykę, nie leczenie.

**6. [v4] Transparentność co do AI**
Nigdy nie udajemy, że wirtualni eksperci to prawdziwe osoby. Cyfrowy charakter Panelu Kuratorów to atut, nie wstyd — pozycjonujemy to jako innowacyjną technologię w służbie dobrostanu.

### 9.3 Przykłady Języka Korzyści

| Element | Język Generyczny | Język Premium (v4) |
|---|---|---|
| **Hero headline** | „Sklep z akcesoriami dla zwierząt" | „Twój pupil zasługuje na to, co najlepsze. My to wiemy." |
| **CTA na listingu** | „Kup teraz" | „Dodaj do troski o [Imię pupila]" |
| **Opis produktu** | „Karma z łososiem" | „Karma premium z norweskiego łososia — każda porcja to pełnowartościowy posiłek, bez kompromisów w składzie" |
| **Po zakupie** | „Dziękujemy za zamówienie" | „Doskonały wybór dla Twojego przyjaciela. Raport dobrostanu dla [Imię] czeka w Twojej skrzynce." |
| **Alert AI** | „Przypomnienie o uzupełnieniu zapasów" | „[Imię] kończy za 5 dni suplement na stawy — czas zamówić kolejną porcję troski" |
| **Trust signal** | „Certyfikowany produkt" | „Skład zweryfikowany przez Wiktora — Głównego Analityka Formuł Żywieniowych" |
| **Empty state koszyka** | „Twój koszyk jest pusty" | „Twój koszyk jeszcze czeka — [Imię] pewnie też" |
| **Endorsement** | „dr Kowalska poleca" ❌ | „Wybór Julii — Kuratorki Wellness i Harmonii Ras" ✅ |

### 9.4 UX Principles — Projektowanie dla Premium Pet Ownerów

**Zasada 1: Zero Anxiety Design**
Każdy ekran powinien obniżać lęk, nie go zwiększać. Informacja o bezpieczeństwie składu widoczna bez klikania. Odznaka jakości — tuż przy zdjęciu. Endorsement Kuratora — przed ceną.

**Zasada 2: Personalizacja jest obowiązkiem, nie funkcją**
Klient nie powinien nigdy widzieć produktów, które nie są dopasowane do jego zwierzęcia. Jeśli wiadomo, że ma kota, sklep nigdy nie pokazuje karmy dla psów jako pierwszej.

**Zasada 3: Transparentność składu jako USP**
Clickable ingredienty z wyjaśnieniem. „Tauryna — niezbędna dla zdrowia serca kotów" zamiast samej nazwy. To buduje zaufanie i edukuje jednocześnie.

**Zasada 4: Premium Packaging Experience — Online**
Strona potwierdzenia zamówienia to nie receipt. To moment dumy: piękne zdjęcie produktu, personalizowane podziękowanie, preview raportu dobrostanu. Checkout to kulminacja, nie formalność.

**Zasada 5: Social Proof od „równych sobie"**
Recenzje filtrowane po rasie i wieku zwierzęcia. „Co piszą właściciele 7-letnich golden retrieverów" jest 10x bardziej wiarygodne niż „4.8/5 z 1200 opinii".

---

## 10. Non-Goals (Czego nie robimy w V1)

- Wielowalutowość (zostajemy przy PLN)
- Aplikacja mobilna (PWA można dodać w V2)
- Integracja z marketplace Allegro — sprzedaż na własnej domenie jest priorytetem V1
- Program lojalnościowy z punktami (wchodzi w V2 jako „Strażnik Dobrostanu")
- Subskrypcja / autodelivery (V2)
- Pełna analityka AI backendu — w V1 wystarczy quiz z regułami; prawdziwe ML wchodzi w V2
- Własny silnik ML rekomendacji (V1 używa reguł opartych o dane quizu)
- **[v4.1]** Blog z artykułami autorstwa Wiktora i Julii — V2 (slug `/blog` zarezerwowany od początku w architekturze routingu)
- **[v4.1]** Prawdziwy weterynarz-partner — Faza 3 strategii Go-to-Market (po stabilizacji metodologii Kuratorów AI i osiągnięciu pierwszego progu sprzedaży); w V1 i V2 polegamy wyłącznie na Panelu Cyfrowych Kuratorów (zgodność prawna)

---

## 11. Architektura techniczna

### 11.1 Tech Stack

| Warstwa | Technologia | Uzasadnienie |
|---|---|---|
| **Frontend** | Next.js 14 (App Router) + Tailwind CSS + Shadcn/UI | SSG/ISR dla SEO, Server Components dla szybkości |
| **Backend** | Next.js Server Actions + Supabase Edge Functions | Bez osobnego serwera, zero cold start |
| **Baza danych** | Supabase (PostgreSQL) + RLS | Relacyjna, RLS zapewnia bezpieczeństwo danych |
| **Auth** | Supabase Auth | Gotowe UI, obsługa sesji |
| **Storage** | Supabase Storage | Zdjęcia produktów + dokumentacja odznak + CDN |
| **AI Engine** | Custom rules engine + Supabase Edge Functions | Lekki silnik reguł bez zewnętrznych API w V1 |
| **AI Avatary Ekspertów** | Generowane statycznie (PNG/WebP) i hostowane w Supabase Storage | Stałe twarze Wiktora i Julii w całym sklepie |
| **Płatności** | PayU REST API | BLIK, karty, przelew — standard w Polsce |
| **Import** | Droplo API / BaseLinker API | Jeden agregator dla wielu hurtowni |
| **E-mail** | Resend lub SendGrid | Szablony HTML premium, darmowy tier na start |
| **Hosting** | Vercel (docelowo Docker + Coolify) | Darmowy start, łatwa migracja na VPS |
| **Monitoring** | Vercel Analytics + Google Search Console | SEO + performance bez dodatkowych kosztów |

### 11.2 Schemat bazy danych (Supabase/PostgreSQL) — v4

Kluczowe tabele i relacje — wersja zaktualizowana o Panel Cyfrowych Kuratorów i odznaki jakości:

| Tabela | Kluczowe kolumny |
|---|---|
| **products** | id, supplier_id, external_id, slug, name_seo, description_seo, is_seo_locked, name_original, description_original, price_original, price_sell, stock, status, is_active, **is_premium_verified**, **expert_tags[]**, **quality_badge_ids[]**, images[], category_id, species[], breed_tags[], life_stage[], health_tags[], created_at, updated_at |
| **quality_badges** *(nowa v4)* | id, code (`pure_care` / `expert_choice` / `clean_composition`), name, description, icon_url, criteria_md |
| **product_quality_badges** *(nowa v4)* | id, product_id, badge_id, validated_at, validated_by_admin_id |
| **brand_experts** *(nowa v4)* | id, name (Wiktor / Julia), role (Główny Analityk Formuł Żywieniowych / Kuratorka Wellness i Harmonii Ras), description, ai_generated_avatar_url, specialization_tags[], is_active |
| **expert_endorsements** *(nowa v4 — zastępuje product_endorsements z v3)* | id, product_id, expert_id (FK → brand_experts), quote (max 280 znaków), validation_date, created_at |
| **product_ingredients** | id, product_id, ingredient_name, ingredient_description, is_highlighted, order_index |
| **orders** | id, customer_id (nullable), status, total_amount, payment_id, payment_status, shipping_method, shipping_cost, shipping_address (JSON), premium_packaging (bool), created_at |
| **order_items** | id, order_id, product_id, quantity, price_at_purchase, product_snapshot (JSON) |
| **customers** | id (Supabase Auth UID), email, name, created_at |
| **pet_profiles** | id, customer_id, pet_name, species, breed, birth_date, weight_kg, health_notes, created_at, updated_at |
| **health_reports** | id, pet_profile_id, order_id (nullable), report_pdf_url, quiz_data (JSON), recommendations (JSON), disclaimer_version, created_at |
| **ai_alerts** | id, customer_id, pet_profile_id, alert_type, message, product_id (nullable), is_sent, scheduled_at, sent_at |
| **suppliers** | id, name, api_type, api_key, currency, currency_buffer_pct, last_sync_at, is_active |
| **import_logs** | id, supplier_id, status, products_updated, errors_count, message, created_at |
| **categories** | id, name, slug, parent_id (nullable) |
| **shipping_methods** | id, name, provider, price, weight_limit, is_active |
| **reviews** | id, product_id, customer_id, pet_profile_id, rating, body, pet_photo_url, is_verified_purchase, created_at |

> **Migracja z v3:** Tabela `product_certificates` z v3 zostaje zastąpiona parą `quality_badges` + `product_quality_badges`. Tabela `product_endorsements` z v3 zostaje zastąpiona parą `brand_experts` + `expert_endorsements` (FK do nowej tabeli ekspertów zamiast wolnych pól `vet_name`/`vet_title`).

### 11.3 Polityki RLS (Row Level Security)

- `products`, `quality_badges`, `product_quality_badges`, `brand_experts`, `expert_endorsements`: SELECT publiczny, INSERT/UPDATE/DELETE tylko dla roli admin
- `orders`: SELECT/UPDATE tylko dla właściciela zamówienia lub admina
- `customers`: SELECT/UPDATE tylko dla właściciela (auth.uid() = id) lub admina
- `pet_profiles`: SELECT/UPDATE tylko dla właściciela lub admina
- `health_reports`: SELECT tylko dla właściciela lub admina
- `ai_alerts`: SELECT/UPDATE tylko dla właściciela lub admina
- `import_logs`, `suppliers`, `shipping_methods`: tylko admin

---

## 12. Podział na zadania (Tasks)

| ID | Zadanie | Kryteria akceptacji | Zależności |
|---|---|---|---|
| **T1** | Setup infrastruktury i bazy danych | Supabase projekt skonfigurowany, RLS aktywne, tabele premium + v4 (quality_badges, brand_experts, expert_endorsements) utworzone | — |
| **T2** | Import produktów i synchronizacja | Produkty z Droplo/BaseLinker synchronizują się co 6h, flagi premium działają | T1 |
| **T3** | Frontend sklepu — listing i filtrowanie Premium | Filtrowanie po rasie, wieku, zdrowiu, filtr „Wybór Ekspertów", odznaki jakości na miniaturkach | T1, T2 |
| **T4** | Strona produktu Premium | Odznaki jakości, endorsement Panelu Kuratorów (Wiktor/Julia), kalkulator dawkowania, clickable ingredienty | T1, T2 |
| **T5** | Panel Admina | Edytor opisów SEO, zarządzanie odznakami jakości, endorsementami, składnikami, ekspertami | T1, T2 |
| **T6** | AI Health Quiz | Quiz zbiera dane o zwierzęciu, generuje raport z disclaimerem, rekomenduje produkty ze sklepu | T1, T3 |
| **T7** | Profil dobrostanu i konto klienta | Profil pupila widoczny po zalogowaniu, historia zakupów, zapisane raporty | T1, T6 |
| **T8** | AI Alert System | Automatyczne alerty e-mail: koniec suplementu, nowy etap życia, obszary uwagi rasy | T6, T7 |
| **T9** | Koszyk i checkout | Koszyk działa bez rejestracji, opcja premium packaging przy kasie | T1, T3 |
| **T10** | Płatności (PayU) | BLIK, karty, przelew; webhook aktualizuje status; strona potwierdzenia premium | T9 |
| **T11** | Maile transakcyjne Premium | Potwierdzenie zamówienia, raport dobrostanu PDF e-mailem D+1, alerty AI | T10, T8 |
| **T12** | Social Sharing & Recenzje | Generowanie grafik IG, recenzje z filtrem rasy, **mechanizm „No Review, No Section" (próg min. 5 recenzji), fallback „Co mówią dane o tej formule"** autorstwa Wiktora, możliwość dodania zdjęcia pupila | T3, T4 |
| **T13** | Strony zaufania | /standardy-jakosci, /eksperci (z dumną transparentnością AI — bez stopki, integralna część narracji), globalna belka trust signals | T1 |
| **T14** | Opcje dostawy | InPost Paczkomat (Geowidget), DPD, stawki edytowalne z panelu admina | T9 |
| **T15** *(v4)* | Generowanie awatarów Wiktora i Julii | Stałe pliki PNG/WebP w Supabase Storage, użyte w całym sklepie i e-mailach | T1 |
| **T16** *(v4.1)* | List Założycielski na homepage + strona `/o-nas` | Sekcja na homepage zaraz po hero (zdjęcie właściciela z psem + 3-5 zdań + CTA „Przeczytaj całą historię"); strona `/o-nas` z pełną wersją; oba CMS-owalne z panelu admina | T1 |
| **T17** *(v4.1)* | Mikrokopia rozbrajająca lęk Anny — 3 momenty | Sekcja składu z klikalnymi tooltipami i etykietą „Skład rozłożony na czynniki pierwsze"; komunikat ceny dziennej („1,33 zł dziennie — tyle co kawa, dla zdrowia [imię]"); gwarancja zwrotu **dosłownie przy przycisku „Zapłać"** w checkout (widoczna bez scrollowania) | T4, T9 |
| **T18** *(v4.1)* | Faza 0 — Pre-launch content | Właściciel testuje top 5–10 produktów na własnym psie, dokumentuje (zdjęcia, wideo, obserwacje); zaproszenie 5–10 beta-testerów z grup FB; cel: minimum 5 recenzji na top 3–5 produktów w dniu otwarcia | T2, T12 |
| **T19** *(v4.1)* | Rezerwacja routingu `/blog` | Slug `/blog` zarezerwowany w Next.js routingu z placeholderem „Wkrótce", żeby uniknąć przebudowy w V2 | T1 |

---

## 13. Edge Cases i ryzyka

| Scenariusz | Ryzyko | Mitygacja |
|---|---|---|
| **Zmiana ceny u dostawcy** | Cena w sklepie nieaktualna, strata marży | Synchronizacja co 6h nadpisuje price_original; price_sell = price_original × marża |
| **Brak towaru (stock = 0)** | Klient kupuje produkt niedostępny | is_active = false gdy stock = 0; przycisk CTA nieaktywny; produkt ukryty z listingu |
| **Zmiana opisu SEO przez import** | Praca copywritera stracona | Kolumna description_seo i przypisania odznak nigdy nie są nadpisywane przez skrypt importu |
| **Awaria PayU** | Zamówienie opłacone, status nieopłacony w bazie | Retry webhook (PayU ponawia 3x); endpoint idempotentny po payment_id |
| **Błąd AI Quizu (złe rekomendacje)** | Klient dostaje nieodpowiedni produkt, utrata zaufania | Rekomendacje AI zawsze z disclaimerem „Analiza ma charakter informacyjny i nie zastępuje konsultacji u lekarza weterynarii"; admin może flagować produkty jako „nie dla wszystkich ras" |
| **[v4] Klient kwestionuje cyfrowy charakter ekspertów** | Zarzut wprowadzania w błąd | Strona /eksperci ma jednoznaczną informację o AI; FAQ wyjaśnia metodologię; brak tytułów medycznych w copy |
| **[v4] Naruszenie ochrony tytułów zawodowych** | Roszczenia, kary, utrata wiarygodności | Lint copywritingu w CI: blokada słów „lekarz", „weterynarz", „klinika", „dr", „lek. wet." w treściach związanych z Wiktorem/Julią |
| **Wyciek danych klientów + profili pupili** | Naruszenie RODO, kary finansowe; dane wrażliwe (zdrowie zwierzęcia mogą pośrednio zdradzić dane właściciela) | RLS na wszystkich tabelach; dane osobowe nie w logach; HTTPS only; dane pupili oddzielone od danych płatniczych |
| **Produkt znika z API dostawcy** | Stary link SEO prowadzi do 404; utrata pozycji | status = archived; strona „Produkt chwilowo niedostępny" (HTTP 200); przekierowanie 301 konfigurowalne |
| **Fałszywe recenzje** | Zniszczenie wiarygodności trust signals | Recenzje tylko od zweryfikowanych zakupów; moderacja admina przed publikacją |

---

## 14. Wymagania prawne i bezpieczeństwo

### 14.1 Tabela wymagań prawnych

| Wymaganie | Co zaimplementować | Podstawa prawna |
|---|---|---|
| **Regulamin sklepu** | Strona /regulamin; checkbox przy checkout; wersjonowanie | Art. 8 ustawy o świadczeniu usług drogą elektroniczną |
| **Polityka prywatności (RODO)** | Strona /polityka-prywatnosci; banner cookie consent; formularz usunięcia danych; RLS | RODO (GDPR), Ustawa o ochronie danych osobowych |
| **Prawo do zwrotu (14 dni)** | Strona /zwroty; e-mail potwierdzający zwrot; status zwrotu w panelu admina | Ustawa o prawach konsumenta (art. 27-38) |
| **Reklamacje** | Strona /reklamacje z formularzem; odpowiedź w ciągu 14 dni; historia w panelu | Kodeks cywilny, art. 556-576 (rękojmia) |
| **Faktury VAT** | Opcja NIP przy checkout; generowanie faktury PDF; faktura e-mailem | Ustawa o VAT, art. 106b |
| **Dyrektywa Omnibus** | Transparentność w opiniach (zweryfikowane zakupy) i cenach (najniższa cena z 30 dni przy promocjach) | Dyrektywa Omnibus 2019/2161 |
| **[PREMIUM] Dane zdrowotne** | Dane profilu pupila (pośrednio dane właściciela) — oddzielna klauzula RODO; nie sprzedajemy danych do firm ubezpieczeniowych/weterynaryjnych | RODO art. 13; transparentność przetwarzania |
| **[PREMIUM] Disclaimer AI** | Każdy raport AI Health Quiz: „Analiza ma charakter informacyjny i nie zastępuje konsultacji u lekarza weterynarii" | Ustawa o wyrobach medycznych; ostrożność etyczna |
| **[v4] Ochrona tytułów zawodowych** | Bezwzględny zakaz używania słów „lekarz", „weterynarz", „klinika", „dr", „lek. wet." w kontekście niezweryfikowanych osób/miejsc (Panel Cyfrowych Kuratorów) | Ustawa o zawodzie lekarza weterynarii; przepisy o nieuczciwych praktykach rynkowych |
| **[v4] Transparentność charakteru ekspertów** | Strona /eksperci zawiera jednoznaczną informację o cyfrowym charakterze Wiktora i Julii | Ustawa o przeciwdziałaniu nieuczciwym praktykom rynkowym |

### 14.2 Checklist wdrożeniowy — RODO i v4

- Formularz kontaktowy: checkbox zgody na przetwarzanie danych
- Newsletter: double opt-in, możliwość wypisania się jednym kliknięciem
- Ciasteczka: baner cookie consent przed załadowaniem Google Analytics
- AI Quiz: osobna zgoda na przetwarzanie danych dotyczących pupila
- Dane osobowe: przechowywane wyłącznie przez czas niezbędny + 5 lat (wymogi podatkowe)
- Breach procedure: procedura zgłaszania naruszeń do UODO w ciągu 72h
- Disclaimer AI: „Analiza ma charakter informacyjny i nie zastępuje konsultacji u lekarza weterynarii" — w każdym raporcie i w stopce AI Quizu
- **[v4]** Strona /eksperci: jasna informacja o cyfrowym charakterze Panelu Kuratorów
- **[v4]** Lint copywritingu: automatyczne wykrywanie zakazanych terminów medycznych w treściach związanych z Wiktorem/Julią
- **[v4]** Wszystkie alt-texty awatarów Wiktora i Julii nie zawierają tytułów medycznych

---

## 15. Metryki sukcesu (KPIs)

Projekt uznajemy za sukces, gdy w ciągu 3 miesięcy od launchu osiągamy:

| Metryka | Cel (3 miesiące) | Jak mierzyć |
|---|---|---|
| **Liczba zamówień** | > 20 / miesiąc | Panel admina + Supabase dashboard |
| **Współczynnik konwersji** | > 1.5% sesji → zamówienie | Google Analytics 4 (zdarzenie purchase) |
| **Konwersja AI Quiz → Zakup** | > 25% wypełnień quizu → zamówienie | Custom event w GA4 + Supabase |
| **Ukończenie AI Quizu** | > 60% użytkowników, którzy zaczęli | GA4 funnel + Supabase |
| **Otwarcie raportu dobrostanu (e-mail)** | > 50% open rate | Resend/SendGrid analytics |
| **Recenzje premium (z filtrem rasy)** | > 15 recenzji ze zdjęciem pupila | Supabase reviews table |
| **Błędy importu** | < 1% synchronizacji | Tabela import_logs |
| **Core Web Vitals (LCP)** | < 2.5s na mobile | Google Search Console + PageSpeed Insights |
| **Dostępność serwisu** | > 99.5% uptime | Vercel Status + UptimeRobot |
| **NPS (Net Promoter Score)** | > 60 (benchmark premium e-commerce) | E-mail survey po 14 dniach od zakupu |
| **[v4] Wyświetlenia strony /eksperci** | > 8% sesji | GA4 page views |
| **[v4] Konwersja produktów z odznaką „Wybór Ekspertów"** | +30% vs. produkty bez odznaki | Supabase + GA4 |

---

## 16. Definicja skilli (Wiedza AI)

Agenci AI pracujący nad tym projektem powinni aktywować następujące kompetencje:

- **Next.js Expert** — App Router, Server Components, ISR/SSG dla SEO, Server Actions jako backend, next/image dla optymalizacji zdjęć
- **Supabase Architect** — Projektowanie tabel premium (pet_profiles, health_reports, ai_alerts, brand_experts, expert_endorsements, quality_badges), polityki RLS, Edge Functions dla webhooków i generowania PDF raportów
- **Integration Specialist** — REST API agregatora (Droplo/BaseLinker), PayU REST API, InPost Geowidget API, Resend/SendGrid API
- **SEO Copywriter / Technical SEO** — Frazy long-tail premium pet care, JSON-LD schema.org/Product z odznakami i recenzjami, unikanie duplicate content, **zgodność z zakazem tytułów medycznych**
- **UX/UI Designer (Premium E-commerce)** — Projektowanie Zero Anxiety Design, premium checkout experience, mobile-first dla persona Anny (TikTok/IG), prezentacja Panelu Cyfrowych Kuratorów
- **AI Rules Engine (V1)** — Projektowanie systemu reguł quizu zdrowotnego: mapowanie parametrów pupila → rekomendacje produktów → generowanie PDF raportów z disclaimerem
- **Pet Care Domain Expert** — Predyspozycje zdrowotne ras, etapy życia psów i kotów, suplementacja, diety funkcjonalne — wiedza do budowy bazy ras i reguł AI
- **Legal / Compliance (PL)** — Ustawa o prawach konsumenta (14-dniowy zwrot), RODO (dane zdrowotne pupila), Ustawa o VAT, **ochrona tytułów zawodu lekarza weterynarii**, dyrektywa Omnibus, disclaimer AI
- **[v4] AI Persona Designer** — Spójna prezentacja Wiktora i Julii w całym sklepie (ton wypowiedzi, awatary, cytaty, biogramy) z zachowaniem transparentności co do cyfrowego charakteru
