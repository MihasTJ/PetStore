-- ══════════════════════════════════════════════════════════════════════
--  Migration: Categories seed
--  Date: 2026-05-14
--
--  Dodaje 4 główne kategorie produktów i przypisuje testowy produkt
--  do kategorii "suplementy".
-- ══════════════════════════════════════════════════════════════════════

INSERT INTO categories (id, name, slug, parent_id)
VALUES
  ('00000000-0000-4000-8000-000000000101', 'Suplementy',  'suplementy',  NULL),
  ('00000000-0000-4000-8000-000000000102', 'Karma',       'karma',       NULL),
  ('00000000-0000-4000-8000-000000000103', 'Akcesoria',   'akcesoria',   NULL),
  ('00000000-0000-4000-8000-000000000104', 'Pielęgnacja', 'pielegnacja', NULL)
ON CONFLICT (slug) DO NOTHING;

-- Testowy produkt → kategoria Suplementy (subquery zamiast hardkodowanego UUID)
UPDATE products
SET category_id = (SELECT id FROM categories WHERE slug = 'suplementy' LIMIT 1)
WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
  AND category_id IS NULL;
