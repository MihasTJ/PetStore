---
name: design-review
description: Przegląda zaimplementowany UI sklepu Premium Pet Care i porównuje go z design guide projektu. Wyłapuje odchylenia od ustalonego stylu — generyczną mikrokopię ("Dodaj do koszyka" zamiast "Dodaj dla Zuzi"), pet-shopowe pastele, stock photos zamiast realnych zdjęć, brak balansu 60/40 między Editorial Warm Premium a wyspami Warm Education i Tech-Wellness, pułapki segmentu (cute illustrations, paw prints, emoji 🐾). Używaj po ukończeniu widoku lub gdy ekran „nie czuje się premium" / „nie zatrzymałby Anny".
user-invocable: true
argument-hint: "[widok lub komponent do przejrzenia, np. 'strona produktu' albo 'AI Quiz']"
---

Przejrzyj wskazany fragment UI i oceń go względem design guide projektu Premium Pet Care. Znajdź konkretne odchylenia i zaproponuj poprawki.

## Przygotowanie

1. Znajdź `design-guide.md` w projekcie (zwykle w `docs/`). Przeczytaj go w całości — to Twoja jedyna miara „poprawności". Jeśli plik nie istnieje, zatrzymaj się i powiedz to użytkownikowi przed jakąkolwiek oceną.
2. Zidentyfikuj pliki do przejrzenia: widoki, komponenty React, CSS/Tailwind tokens, mikrokopie (button labels, empty states, e-mail templates).
3. Jeśli możliwe — zrób screenshot przez Playwright MCP i oceń też wizualnie, nie tylko przez kod. Mikrokopia i fotografia są w tym projekcie krytyczne i często da się je ocenić tylko wizualnie.
4. Zanim zaczniesz audyt, przypomnij sobie kim jest **primary persona — Anna**. Pytanie kontrolne dla każdej decyzji: „Czy ten ekran zatrzymałby Annę, czy by ją odstraszył?".

## Co sprawdzać

### 1. Balans 60/40 (najważniejsze pierwsze)

Każdy ekran należy do jednej z trzech stref. Najpierw określ, która to strefa, potem oceniaj według jej zasad:

- **Editorial Warm Premium (60%)** — landing, kategorie, hero, footer, „o nas", strona produktu (część emocjonalna). Tu obowiązuje pełen Aesop-mode: dużo whitespace, serif w nagłówkach, beż/terakota/grafit, fotografia editorialowa.
- **Warm Education (25%)** — sekcje „Dlaczego Premium?", breakdown składu, „Co mówi weterynarz", strony edukacyjne, recenzje społeczności. Tu wchodzą cieplejsze tła, ilustracje, więcej tekstu, recenzje z imionami pupili.
- **Stonowana Tech-Wellness (15%)** — AI Quiz, raport zdrowotny, profil pupila, AI Alerty, dashboard klienta. Tu wchodzą subtelne wykresy, badge'e certyfikatów, lekko ciemniejsze tło dla kontrastu — **bez neonów i cyber-feelu**.

Pytania kontrolne:
- Czy ekran nie zmieszał stref bez powodu (np. neon-wykres w hero zamiast w AI Quizie)?
- Czy strefa Editorial nie wpadła w „cute" (ilustracje, pastele, emoji)?
- Czy strefa Tech-Wellness nie wpadła w „cyber" (neony, ciemne tła z świecącymi akcentami, glassmorphism)?

### 2. Mikrokopia i brand voice

To w tym projekcie **najważniejsze** — pojedyncza zła mikrokopia psuje cały editorial vibe.

Pytania kontrolne:
- Czy buttony używają imienia pupila tam, gdzie user jest zalogowany i ma `pet_profile` (np. „Dodaj dla Zuzi" zamiast „Dodaj do koszyka")?
- Czy fallback dla gościa to „Twój pupil" / „pupil" — **nigdy** „Twoje zwierzę" / „zwierzę"?
- Czy imię pupila pojawia się **raz na ekran w momencie emocjonalnym** (CTA, potwierdzenie, alert) — a nie w każdym zdaniu (anty-pattern call-center)?
- Czy mikrokopia mówi językiem korzyści, nie funkcji? („Twój pies wstanie rano bez bólu" zamiast „Suplement z glukozaminą 500 mg")?
- Czy w komunikacji używamy języka prewencji, nie reakcji? („Zapobiegnij problemom stawowym zanim się pojawią" — TAK; „Lecz problemy stawowe" — NIE).
- Czy **zero emoji 🐾🐶🐱** w UI i mikrokopiach? (Pet-shop killer.)
- Czy CTA są pewne, ale spokojne? („Wybierany przez weterynarzy w 12 krajach" — TAK; „NAJLEPSZY PRODUKT!!!" — NIE).

### 3. Kolory

Pytania kontrolne:
- Czy używane kolory pochodzą z design tokens (zmiennych CSS / Tailwind config), nie hardkodowanych wartości?
- Czy tło bazowe to **ciepła kość słoniowa** (~`#FAF7F2`), a nie czysta biel `#FFFFFF`?
- Czy tekst główny to **grafit** (~`#2A2A28`), a nie czysta czerń `#000000`?
- Czy primary accent to **terakota / przygaszony rust** (~`#B8654A`), a nie pomarańcz, czerwień, ani — co gorsza — róż albo baby blue?
- Czy w paletcie nie ma **pastelowych pet-shop kolorów** (pastelowy róż, baby blue, mięta, lawenda)? To natychmiastowa śmierć premium pozycjonowania.
- Czy cienie są **ciepłe** (lekki tint terakoty/grafitu), a nie chłodne / niebieskie / czysto czarne? (To brand WARM, nie COOL.)
- Czy tekst na kolorowym tle jest ciemniejszą wersją koloru tła, nie szarym?

### 4. Typografia i hierarchia

Pytania kontrolne:
- Czy nagłówki używają **serif** (Canela / Tiempos / GT Sectra / podobne z charakterem)? Times New Roman = NIE.
- Czy body używa **sans-serif** (Inter / General Sans)?
- Czy nagłówki są duże, z hojnym leading'iem (line-height ~1.1–1.2)?
- Czy długość linii w body nie przekracza ~70 znaków (czytelność)?
- Czy ceny / kwoty są wyróżnione (waga, rozmiar) — ale **bez krzyku** (nie czerwone, nie podkreślone, nie w boxie „PROMO")?
- Czy imiona pupili w mikrokopii są wyróżnione subtelnie (np. lekko cieplejszy odcień, kursywa, lub po prostu kontekstem) — a nie boldem albo emoji?

### 5. Fotografia (krytyczne dla brandu)

Pytania kontrolne:
- Czy zdjęcia to **realne psy/koty w domowych kontekstach**, nie stock photos w studio na białym tle?
- Czy światło jest **naturalne** (z okna, ciepłe, lekkie ziarno), a nie studyjne / flash?
- Czy przy zdjęciach z właścicielem widać **fragmenty** (dłoń, sweter, kąt kuchni) — nigdy całych twarzy? (Anna ma się utożsamić, nie porównywać.)
- Czy korekcja kolorystyczna jest ciepła, lekko zdesaturowana — nie hipernasycona „Instagram filter"?
- Czy nie ma **żadnych** stockowych psów-modeli (czysty pies rasowy z idealnym futrem na białym tle = Zooplus territory)?
- Czy zdjęcia produktów są w „lifestyle" kontekście (na blacie kuchennym, obok pupila, w naturalnym świetle), a nie packshot na białym tle?

### 6. Zaokrąglenia i kształty

Pytania kontrolne:
- Czy główne karty używają radius ~`24px` (miękko, ale nie pillowy)?
- Czy buttony używają radius ~`10–12px` (zdecydowane, ale nie ostre)?
- Czy tagi / pole formularza używają radius ~`6–8px`?
- Czy nie ma elementów z radius `0` (ostre kąty) tam, gdzie nie powinno być? (Editorial = miękkość.)
- Czy nie ma elementów z radius `999px` / pełne pillowe okrągłości? (To czyta się jako „childish app" — wbrew premium positioningu.)

### 7. Cienie i głębia

Pytania kontrolne:
- Czy cienie są subtelne, rozmyte, ciepłe (nie twarde, nie czarne, nie niebieskie)?
- Czy mają krycie 4–8% (nie więcej)?
- Czy nie nadużyto cieni? (Editorial premium używa ich oszczędnie — Aesop praktycznie nie ma cieni.)
- Czy nie ma elementów z `box-shadow` typu „material design" (głębokie, twarde cienie) — to inny brand language?

### 8. Przestrzeń (whitespace)

Pytania kontrolne:
- Czy karty mają **hojny wewnętrzny padding** (min. 24px, często 32–40px)?
- Czy sekcje są oddzielone **przestrzenią**, nie liniami?
- Czy hero ma asymetrię (zamiast wycentrowanej siatki 12-kolumnowej) — coś, co wyróżnia editorial od „standardowego e-commerce"?
- Czy nic nie jest „upchnięte" — każdy element ma oddech?
- Czy mobile nie zatraca whitespace'u? (Częsty błąd — desktop ma oddech, mobile jest gęsty jak Allegro. To zabija premium feeling u Anny, która kupuje z TikToka.)

### 9. Trust signals i certyfikaty

Pytania kontrolne:
- Czy certyfikaty / endorsementy są widoczne **bez klikania**, blisko zdjęcia produktu, blisko ceny?
- Czy endorsement weterynarza ma **imię, tytuł, zdjęcie** — nie generyczną ikonę „checked"?
- Czy ikony certyfikatów nie wyglądają jak generyczne badge'e z internetu (gradient + gwiazdka)?
- Czy społeczność (recenzje) ma **zdjęcia realnych pupili** od klientów, a nie stock review avatars?

### 10. Spójność

Pytania kontrolne:
- Czy ten sam typ elementu (np. karta produktu) wygląda identycznie wszędzie?
- Czy nazewnictwo klas/tokenów jest konsekwentne?
- Czy nie ma „dryfu stylu" między starymi a nowymi widokami (np. kategoria stara z ostrymi kątami, nowa z miękką)?
- Czy mikrokopia jest spójna w tonie między landingiem a koszykiem? (Częsty błąd: landing pisany przez copywritera, checkout zostawiony na default Stripe/PayU.)

## Format raportu

```
## Przegląd: [nazwa widoku]

### Strefa: [Editorial Warm Premium / Warm Education / Tech-Wellness]
[krótkie uzasadnienie — czy ekran trafnie zidentyfikował swoją strefę]

### ✅ Zgodne z design guide
- [lista tego, co wygląda dobrze — bądź konkretny, nie ogólny]

### ❌ Odchylenia do poprawy (krytyczne)
- [element]: [opis problemu] → [konkretna poprawka]
- [element]: [opis problemu] → [konkretna poprawka]

### ⚠️ Do dyskusji (nie krytyczne, ale warto rozważyć)
- [coś, co działa, ale może być mocniejsze brandowo]

### 🐾 Pułapki segmentu (jeśli wykryte)
- [każdy znaleziony pet-shop trap, cute trap, stock-photo trap, emoji-trap]

### Test Anny
[Jednym zdaniem: czy Anna by się zatrzymała na tym ekranie? Co by ją zatrzymało / odstraszyło?]
```

## Wykonanie poprawek

Po raporcie — zapytaj, czy naprawiać od razu. Jeśli tak:

- Poprawiaj **po jednym problemie naraz**
- Najpierw mikrokopię i fotografię (najwyżej-zwrotne, najtańsze) — potem paletę i typografię, na końcu spacing
- Weryfikuj każdą zmianę przed przejściem do kolejnej
- Nie zmieniaj rzeczy, które nie były w raporcie
- Po większych zmianach — ponów screenshot Playwright i porównaj wizualnie

Pamiętaj: celem jest zgodność z ustaloną wizją (Editorial Warm Premium + Anna jako primary persona), nie „ulepszanie według własnego gustu". Jeśli masz pomysł poza zakresem raportu — zaproponuj go osobno użytkownikowi, ale nie wdrażaj samodzielnie.
