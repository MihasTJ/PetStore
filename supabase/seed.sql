-- ============================================================
--  SEED — testowy produkt do weryfikacji płatności PayU
--  Uruchom w: Supabase Dashboard → SQL Editor
-- ============================================================

-- Stały UUID ułatwia testowanie: kopiujesz go raz do strony produktu
-- i możesz wielokrotnie wstawiać seed bez konfliktów (ON CONFLICT).

INSERT INTO products (
  id,
  slug,
  name_seo,
  description_seo,
  is_seo_locked,
  price_original,
  price_sell,
  stock,
  status,
  is_active,
  is_premium_verified,
  images,
  species,
  breed_tags,
  life_stage,
  health_tags
) VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'suplement-stawowy-senior-plus',
  'Suplement stawowy Senior+ dla psa',
  'Naturalny suplement na stawy dla psów seniorów. Glukozamina, MSM, kolagen typ II. Weterynaryjnie zweryfikowany skład.',
  true,
  120.00,
  149.00,
  100,
  'active',
  true,
  true,
  ARRAY[]::text[],
  ARRAY['pies'],
  ARRAY[]::text[],
  ARRAY['senior'],
  ARRAY['stawy']
) ON CONFLICT (id) DO UPDATE SET
  price_sell = EXCLUDED.price_sell,
  stock      = EXCLUDED.stock,
  is_active  = EXCLUDED.is_active;

-- Weryfikacja — powinien pojawić się 1 wiersz:
SELECT id, slug, name_seo, price_sell, stock, is_active
FROM products
WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
