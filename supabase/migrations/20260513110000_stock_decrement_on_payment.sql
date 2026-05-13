-- ══════════════════════════════════════════════════════════════════════
--  Migration: Stock decrement on payment completion
--  Date:      2026-05-13
--
--  Problem: update_order_payment updated orders only — products.stock
--  was never decremented when a payment was completed.
--
--  Fix: when p_payment_status transitions to 'paid' for the first time,
--  subtract each order_item.quantity from the matching product's stock
--  and re-evaluate is_active (stock > 0 AND status = 'active').
-- ══════════════════════════════════════════════════════════════════════

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
begin
  select payment_status into v_old_payment_status
  from orders
  where id = p_order_id;

  update orders
  set
    status         = p_order_status,
    payment_status = p_payment_status,
    payment_id     = coalesce(p_payu_id, payment_id)
  where id = p_order_id;

  -- Decrement stock only on first-time transition to 'paid'
  if p_payment_status = 'paid' and (v_old_payment_status is distinct from 'paid') then
    -- Step 1: subtract quantities
    update products p
    set stock = greatest(0, p.stock - oi.quantity)
    from order_items oi
    where oi.order_id = p_order_id
      and oi.product_id = p.id;

    -- Step 2: re-evaluate is_active based on new stock
    update products p
    set is_active = (p.stock > 0 and p.status = 'active')
    from order_items oi
    where oi.order_id = p_order_id
      and oi.product_id = p.id;
  end if;
end;
$$;
