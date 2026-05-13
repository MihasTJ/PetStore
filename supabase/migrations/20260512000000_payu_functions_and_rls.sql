-- ══════════════════════════════════════════════════════════════════════
--  Migration: PayU functions & orders RLS fix
--  Date:      2026-05-12
--
--  Co się zmienia:
--    · Funkcje RPC dla webhooka PayU (update_order_payment,
--      get_order_details_for_email, get_order_for_confirmation,
--      mark_confirmation_email_sent)
--    · Polityka RLS orders_update_service_role — pozwala webhookowi
--      i panelowi admina aktualizować dowolne zamówienie
--    · Seed: eksperci marki, odznaki jakości, dane testowego produktu
--      (dane z v4_brand_experts_badges — idempotentne, ON CONFLICT DO NOTHING)
-- ══════════════════════════════════════════════════════════════════════


-- ── RLS: service_role może aktualizować każde zamówienie ─────────────

create policy "orders_update_service_role"
  on orders for update
  using (auth.role() = 'service_role');


-- ── update_order_payment ─────────────────────────────────────────────
-- Wywoływana przez webhook PayU przy zmianie statusu zamówienia.
-- SECURITY DEFINER — działa z uprawnieniami właściciela funkcji.

drop function if exists public.update_order_payment(uuid, text, text, text);

create or replace function public.update_order_payment(
  p_order_id       uuid,
  p_order_status   text,
  p_payment_status text,
  p_payu_id        text
)
returns void
language plpgsql
security definer
as $$
begin
  update orders
  set
    status         = p_order_status,
    payment_status = p_payment_status,
    payment_id     = coalesce(p_payu_id, payment_id)
  where id = p_order_id;
end;
$$;


-- ── mark_confirmation_email_sent ─────────────────────────────────────
-- Idempotentne oznaczenie wysłanego emaila potwierdzającego.
-- Zwraca { sent: true } tylko za pierwszym razem — zapobiega duplikatom.

create or replace function public.mark_confirmation_email_sent(
  p_order_id uuid
)
returns table(sent boolean)
language plpgsql
security definer
as $$
begin
  update orders
  set confirmation_email_sent = true
  where id = p_order_id
    and confirmation_email_sent = false;

  return query select found as sent;
end;
$$;


-- ── get_order_for_confirmation ───────────────────────────────────────
-- Używana na stronie potwierdzenia zamówienia (/order/[id]).

create or replace function public.get_order_for_confirmation(
  p_order_id uuid
)
returns table(
  id             uuid,
  payment_status text,
  pet_name       text,
  shipping_address jsonb,
  total_amount   numeric
)
language plpgsql
security definer
as $$
begin
  return query
  select
    o.id,
    o.payment_status,
    o.pet_name,
    o.shipping_address,
    o.total_amount
  from orders o
  where o.id = p_order_id;
end;
$$;


-- ── get_order_details_for_email ──────────────────────────────────────
-- Zwraca pełne dane zamówienia potrzebne do wygenerowania emaila.

create or replace function public.get_order_details_for_email(
  p_order_id uuid
)
returns json
language plpgsql
security definer
as $$
declare
  result json;
begin
  select json_build_object(
    'id',               o.id,
    'pet_name',         o.pet_name,
    'shipping_address', o.shipping_address,
    'shipping_method',  o.shipping_method,
    'shipping_cost',    o.shipping_cost,
    'premium_packaging',o.premium_packaging,
    'total_amount',     o.total_amount,
    'items', (
      select json_agg(json_build_object(
        'name',     (oi.product_snapshot->>'name'),
        'quantity', oi.quantity,
        'price',    oi.price_at_purchase
      ))
      from order_items oi
      where oi.order_id = o.id
    )
  )
  into result
  from orders o
  where o.id = p_order_id;

  return result;
end;
$$;


-- ══════════════════════════════════════════════════════════════════════
--  SEED — eksperci marki, odznaki jakości, dane testowego produktu
--  Idempotentny: bezpieczny do wielokrotnego uruchomienia.
-- ══════════════════════════════════════════════════════════════════════


-- ── S1. Eksperci marki ────────────────────────────────────────────────

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


-- ── S3. Testowy produkt — Suplement stawowy Senior+ ──────────────────

INSERT INTO products (
  id, slug, name_seo, description_seo, is_seo_locked,
  price_original, price_sell, stock, status, is_active,
  is_premium_verified, images, species, breed_tags, life_stage, health_tags,
  usage_days, daily_price_pln, expert_tags, quality_badge_ids
) VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'suplement-stawowy-senior-plus',
  'Suplement stawowy Senior+ dla psa',
  'Naturalny suplement na stawy dla psów seniorów. Glukozamina, MSM, kolagen typ II. Weterynaryjnie zweryfikowany skład.',
  false,
  189.00, 149.00, 47, 'active', true, true,
  '[]', ARRAY['dog'], '{}', ARRAY['senior'], ARRAY['joints'],
  30, ROUND(149.00 / 30, 2),
  ARRAY['stawy', 'seniory', 'glukozamina'],
  ARRAY[
    '00000000-0000-4000-8000-000000000011'::uuid,
    '00000000-0000-4000-8000-000000000012'::uuid
  ]
)
ON CONFLICT (id) DO UPDATE SET
  usage_days        = 30,
  daily_price_pln   = ROUND(149.00 / 30, 2),
  expert_tags       = ARRAY['stawy', 'seniory', 'glukozamina'],
  quality_badge_ids = ARRAY[
    '00000000-0000-4000-8000-000000000011'::uuid,
    '00000000-0000-4000-8000-000000000012'::uuid
  ];


-- ── S4. Przypisanie odznak do testowego produktu ─────────────────────

INSERT INTO product_quality_badges (product_id, badge_id)
VALUES
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', '00000000-0000-4000-8000-000000000011'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', '00000000-0000-4000-8000-000000000012')
ON CONFLICT (product_id, badge_id) DO NOTHING;


-- ── S5. Endorsement Wiktora dla testowego produktu ───────────────────

INSERT INTO expert_endorsements (id, product_id, expert_id, quote, validation_date)
VALUES (
  '00000000-0000-4000-8000-000000000021',
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  '00000000-0000-4000-8000-000000000001',
  'Glukozamina i MSM w tym składzie są w formie o potwierdzonej biodostępności. Dla psa seniora z problemami stawów to jeden z czystszych suplementów, jakie analizowałem — bez zbędnego balastu.',
  '2026-05-06'
)
ON CONFLICT (id) DO NOTHING;
