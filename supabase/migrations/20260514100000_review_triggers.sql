-- ══════════════════════════════════════════════════════════════════════
--  Migration: Review count triggers
--  Date: 2026-05-14
--
--  Trigger automatycznie aktualizuje review_count na products
--  przy każdym dodaniu lub usunięciu recenzji. Dzięki temu
--  nie potrzebujemy ręcznego inkrementowania z poziomu aplikacji.
-- ══════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_product_review_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE products SET review_count = review_count + 1 WHERE id = NEW.product_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE products SET review_count = GREATEST(review_count - 1, 0) WHERE id = OLD.product_id;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS reviews_update_count ON reviews;

CREATE TRIGGER reviews_update_count
  AFTER INSERT OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_product_review_count();
