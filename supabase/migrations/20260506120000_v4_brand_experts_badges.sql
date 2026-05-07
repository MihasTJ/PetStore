-- ══════════════════════════════════════════════════════════════════════
--  Migration: v4 Brand Experts & Quality Badges
--  Date:      2026-05-06
--
--  Co się zmienia:
--    · product_certificates  → _deprecated_product_certificates  (backup)
--    · product_endorsements  → _deprecated_product_endorsements  (backup)
--    · Nowe tabele: brand_experts, expert_endorsements,
--                   quality_badges, product_quality_badges
--    · products: +expert_tags, +quality_badge_ids, +daily_price_pln,
--                +review_count, +usage_days
--    · health_reports: +disclaimer_version
--    · RLS na wszystkich nowych tabelach
--
--  SEED (na końcu pliku):
--    · Eksperci: Wiktor, Julia
--    · Odznaki: PureCare, ExpertChoice, CleanComposition
--    · Testowy produkt (f47ac10b-…) — przypisanie odznak + endorsement
-- ══════════════════════════════════════════════════════════════════════


-- ── 1. Archiwizacja starych tabel (backup, NIE DROP) ─────────────────

ALTER TABLE product_certificates RENAME TO _deprecated_product_certificates;
ALTER TABLE product_endorsements  RENAME TO _deprecated_product_endorsements;


-- ── 2. Nowa tabela: brand_experts ────────────────────────────────────

CREATE TABLE brand_experts (
  id                      uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                    text        NOT NULL,
  role                    text        NOT NULL,
  description             text,
  specialization_tags     text[]      NOT NULL DEFAULT '{}',
  ai_generated_avatar_url text,
  is_active               boolean     NOT NULL DEFAULT true
);


-- ── 3. Nowa tabela: expert_endorsements ──────────────────────────────

CREATE TABLE expert_endorsements (
  id              uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id      uuid        NOT NULL REFERENCES products(id)      ON DELETE CASCADE,
  expert_id       uuid        NOT NULL REFERENCES brand_experts(id) ON DELETE CASCADE,
  quote           text        NOT NULL CHECK (char_length(quote) <= 280),
  validation_date date,
  created_at      timestamptz NOT NULL DEFAULT now()
);


-- ── 4. Nowa tabela: quality_badges ───────────────────────────────────

CREATE TABLE quality_badges (
  id          uuid  PRIMARY KEY DEFAULT uuid_generate_v4(),
  code        text  NOT NULL UNIQUE
                    CHECK (code IN ('pure_care', 'expert_choice', 'clean_composition')),
  name        text  NOT NULL,
  description text,
  icon_url    text,
  criteria_md text
);


-- ── 5. Nowa tabela: product_quality_badges ───────────────────────────

CREATE TABLE product_quality_badges (
  id           uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id   uuid        NOT NULL REFERENCES products(id)      ON DELETE CASCADE,
  badge_id     uuid        NOT NULL REFERENCES quality_badges(id) ON DELETE CASCADE,
  validated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, badge_id)
);


-- ── 6. Rozszerzenie tabeli products ──────────────────────────────────

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS expert_tags       text[]        NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS quality_badge_ids uuid[]        NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS daily_price_pln   numeric(10,2),
  ADD COLUMN IF NOT EXISTS review_count      integer       NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS usage_days        integer;


-- ── 7. Rozszerzenie tabeli health_reports ────────────────────────────

ALTER TABLE health_reports
  ADD COLUMN IF NOT EXISTS disclaimer_version text NOT NULL DEFAULT 'v1';


-- ── 8. Indeksy ───────────────────────────────────────────────────────

CREATE INDEX brand_experts_is_active_idx
  ON brand_experts (is_active);

CREATE INDEX expert_endorsements_product_idx
  ON expert_endorsements (product_id);

CREATE INDEX expert_endorsements_expert_idx
  ON expert_endorsements (expert_id);

CREATE INDEX product_quality_badges_product_idx
  ON product_quality_badges (product_id);

CREATE INDEX products_expert_tags_idx
  ON products USING gin (expert_tags);

CREATE INDEX products_quality_badge_ids_idx
  ON products USING gin (quality_badge_ids);


-- ── 9. RLS ───────────────────────────────────────────────────────────

ALTER TABLE brand_experts          ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_endorsements    ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_badges         ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_quality_badges ENABLE ROW LEVEL SECURITY;

-- brand_experts: public read / service_role write
CREATE POLICY "brand_experts_select"
  ON brand_experts FOR SELECT USING (true);
CREATE POLICY "brand_experts_insert"
  ON brand_experts FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "brand_experts_update"
  ON brand_experts FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "brand_experts_delete"
  ON brand_experts FOR DELETE USING (auth.role() = 'service_role');

-- quality_badges: public read / service_role write
CREATE POLICY "quality_badges_select"
  ON quality_badges FOR SELECT USING (true);
CREATE POLICY "quality_badges_insert"
  ON quality_badges FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "quality_badges_update"
  ON quality_badges FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "quality_badges_delete"
  ON quality_badges FOR DELETE USING (auth.role() = 'service_role');

-- expert_endorsements: public read / service_role write
CREATE POLICY "expert_endorsements_select"
  ON expert_endorsements FOR SELECT USING (true);
CREATE POLICY "expert_endorsements_insert"
  ON expert_endorsements FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "expert_endorsements_update"
  ON expert_endorsements FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "expert_endorsements_delete"
  ON expert_endorsements FOR DELETE USING (auth.role() = 'service_role');

-- product_quality_badges: public read / service_role write
CREATE POLICY "product_quality_badges_select"
  ON product_quality_badges FOR SELECT USING (true);
CREATE POLICY "product_quality_badges_insert"
  ON product_quality_badges FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "product_quality_badges_update"
  ON product_quality_badges FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "product_quality_badges_delete"
  ON product_quality_badges FOR DELETE USING (auth.role() = 'service_role');


-- ══════════════════════════════════════════════════════════════════════
--  SEED — eksperci, odznaki, dane testowego produktu
--  Idempotentny: bezpieczny do wielokrotnego uruchomienia.
-- ══════════════════════════════════════════════════════════════════════

-- ── S1. Eksperci marki ────────────────────────────────────────────────
--  Stałe UUID → ON CONFLICT (id) DO NOTHING gwarantuje idempotencję.

INSERT INTO brand_experts (id, name, role, description, specialization_tags, is_active)
VALUES
  (
    '00000000-0000-4000-8000-000000000001',
    'Wiktor',
    'Główny Analityk Formuł Żywieniowych',
    'Specjalizuje się w składach suplementów dla psów seniorów i ras dużych. Weryfikuje każdy suplement pod kątem czystości składu i biodostępności substancji aktywnych.',
    ARRAY['suplementy', 'seniory', 'stawy', 'skład', 'biodostępność'],
    true
  ),
  (
    '00000000-0000-4000-8000-000000000002',
    'Julia',
    'Kuratorka Wellness i Harmonii Ras',
    'Łączy wiedzę o potrzebach behawioralnych z żywieniowymi. Tworzy rekomendacje dopasowane do rasy, etapu życia i stylu dnia zwierzęcia.',
    ARRAY['wellness', 'harmonia ras', 'zachowanie', 'holistyczne podejście', 'codzienna rutyna'],
    true
  )
ON CONFLICT (id) DO NOTHING;


-- ── S2. Odznaki jakości ───────────────────────────────────────────────

INSERT INTO quality_badges (id, code, name, description, criteria_md)
VALUES
  (
    '00000000-0000-4000-8000-000000000011',
    'pure_care',
    'Standard PureCare',
    'Produkt przeszedł pełną weryfikację składu — bez wypełniaczy, sztucznych barwników ani substancji budzących wątpliwości.',
    E'## Kryteria Standard PureCare\n\n- Brak sztucznych barwników i aromatów\n- Brak zbędnych wypełniaczy (maltodekstryna jako jedyny nośnik jest dopuszczalna)\n- Każdy składnik aktywny potwierdzony badaniem CoA\n- Skład zrozumiały dla właściciela zwierzęcia'
  ),
  (
    '00000000-0000-4000-8000-000000000012',
    'expert_choice',
    'Wybór Ekspertów',
    'Rekomendowany przez wirtualnych ekspertów marki na podstawie analizy składu, badań skuteczności i opinii właścicieli.',
    E'## Kryteria Wybór Ekspertów\n\n- Minimum jedna recenzja eksperta marki\n- Skuteczność potwierdzona co najmniej 5 zweryfikowanymi opiniami\n- Brak negatywnych sygnałów bezpieczeństwa w ostatnich 12 miesiącach'
  ),
  (
    '00000000-0000-4000-8000-000000000013',
    'clean_composition',
    'Atest Czystego Składu',
    'Certyfikat potwierdzający, że skład produktu jest w 100% przejrzysty — każdy składnik ma udokumentowaną rolę i źródło.',
    E'## Kryteria Atest Czystego Składu\n\n- Pełna lista składników z opisem funkcji\n- Udokumentowane źródło surowców (kraj, dostawca)\n- Brak składników z listy kontrowersyjnych (aktualizowanej co kwartał)\n- Skład zgodny z wersją opakowania dostępną w sprzedaży'
  )
ON CONFLICT (code) DO NOTHING;


-- ── S3. Aktualizacja testowego produktu ──────────────────────────────
--  Produkt: Suplement stawowy Senior+ (id: f47ac10b-58cc-4372-a567-0e02b2c3d479)
--  price_sell=149 PLN, usage_days=30 → daily_price_pln = 4.97

UPDATE products
SET
  usage_days        = 30,
  daily_price_pln   = ROUND(149.00 / 30, 2),   -- 4.97 PLN/dzień
  expert_tags       = ARRAY['stawy', 'seniory', 'glukozamina'],
  quality_badge_ids = ARRAY[
    '00000000-0000-4000-8000-000000000011'::uuid,  -- pure_care
    '00000000-0000-4000-8000-000000000012'::uuid   -- expert_choice
  ]
WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';


-- ── S4. Przypisanie odznak do testowego produktu ─────────────────────

INSERT INTO product_quality_badges (product_id, badge_id)
VALUES
  (
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    '00000000-0000-4000-8000-000000000011'   -- pure_care
  ),
  (
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    '00000000-0000-4000-8000-000000000012'   -- expert_choice
  )
ON CONFLICT (product_id, badge_id) DO NOTHING;


-- ── S5. Endorsement Wiktora dla testowego produktu ───────────────────

INSERT INTO expert_endorsements (id, product_id, expert_id, quote, validation_date)
VALUES (
  '00000000-0000-4000-8000-000000000021',
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  '00000000-0000-4000-8000-000000000001',   -- Wiktor
  'Glukozamina i MSM w tym składzie są w formie o potwierdzonej biodostępności. Dla psa seniora z problemami stawów to jeden z czystszych suplementów, jakie analizowałem — bez zbędnego balastu.',
  '2026-05-06'
)
ON CONFLICT (id) DO NOTHING;


-- ── S6. Weryfikacja ───────────────────────────────────────────────────

SELECT
  p.id,
  p.slug,
  p.daily_price_pln,
  p.usage_days,
  p.expert_tags,
  p.quality_badge_ids,
  count(pqb.id) AS badge_count,
  count(ee.id)  AS endorsement_count
FROM products p
LEFT JOIN product_quality_badges pqb ON pqb.product_id = p.id
LEFT JOIN expert_endorsements     ee  ON ee.product_id  = p.id
WHERE p.id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
GROUP BY p.id, p.slug, p.daily_price_pln, p.usage_days, p.expert_tags, p.quality_badge_ids;
