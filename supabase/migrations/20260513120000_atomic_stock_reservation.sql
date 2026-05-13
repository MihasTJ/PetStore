-- ══════════════════════════════════════════════════════════════════════
--  Migration: Atomic stock reservation at order creation
--  Date:      2026-05-13
--
--  Problem: SELECT stock → INSERT order → UPDATE stock is not atomic.
--  Two simultaneous checkouts both see sufficient stock and both succeed,
--  causing overselling.
--
--  Fix:
--    · Stock is reserved (decremented) atomically at order creation time
--      using FOR UPDATE row locks — second concurrent checkout blocks
--      until the first commits, then sees the real remaining stock.
--    · If stock is insufficient, the order is deleted before PayU redirect.
--    · If payment fails/is cancelled, stock is restored.
--    · update_order_payment no longer decrements stock on 'paid'
--      (it was already decremented at order creation).
-- ══════════════════════════════════════════════════════════════════════

-- ── orders: track whether stock was reserved for this order ──────────

alter table orders add column if not exists
  stock_reserved boolean not null default false;


-- ── reserve_order_stock ──────────────────────────────────────────────
-- Called immediately after order_items are inserted, before PayU redirect.
-- Uses FOR UPDATE to serialize concurrent checkouts for the same product.
-- Returns {"ok": true} on success, {"ok": false, "reason": "..."} on failure.
-- On failure the exception handler rolls back all stock decrements within
-- this function (PL/pgSQL BEGIN…EXCEPTION block semantics).

create or replace function public.reserve_order_stock(p_order_id uuid)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_product_id uuid;
  v_quantity   int;
  v_stock      int;
begin
  for v_product_id, v_quantity in
    select oi.product_id, oi.quantity
    from order_items oi
    where oi.order_id = p_order_id
    order by oi.product_id   -- consistent order prevents deadlocks
  loop
    -- Lock the product row — concurrent calls block here until we commit
    select stock into v_stock
    from products
    where id = v_product_id
    for update;

    if v_stock < v_quantity then
      raise exception 'insufficient_stock';
    end if;

    update products
    set
      stock     = stock - v_quantity,
      is_active = (stock - v_quantity > 0 and status = 'active')
    where id = v_product_id;
  end loop;

  update orders set stock_reserved = true where id = p_order_id;

  return '{"ok": true}'::jsonb;

exception when others then
  -- All updates above are rolled back; outer transaction continues
  return jsonb_build_object('ok', false, 'reason', sqlerrm);
end;
$$;


-- ── update_order_payment (v3) ────────────────────────────────────────
-- Stock is now managed at order creation, not at payment time:
--   · No decrement on 'paid'  (already done by reserve_order_stock)
--   · Restore stock on 'failed' if stock was reserved (first time only)

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
declare
  v_old_payment_status text;
  v_stock_reserved     boolean;
begin
  select payment_status, stock_reserved
  into v_old_payment_status, v_stock_reserved
  from orders
  where id = p_order_id;

  update orders
  set
    status         = p_order_status,
    payment_status = p_payment_status,
    payment_id     = coalesce(p_payu_id, payment_id)
  where id = p_order_id;

  -- Restore stock when payment fails for the first time
  if p_payment_status = 'failed'
    and (v_old_payment_status is distinct from 'failed')
    and v_stock_reserved = true
  then
    update products p
    set
      stock     = p.stock + oi.quantity,
      is_active = (p.stock + oi.quantity > 0 and p.status = 'active')
    from order_items oi
    where oi.order_id = p_order_id
      and oi.product_id = p.id;

    update orders set stock_reserved = false where id = p_order_id;
  end if;
end;
$$;
