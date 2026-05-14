-- ── Cena promocyjna (Omnibus-compliant) ─────────────────────────────────────

-- 1. Kolumna na cenę po obniżce (null = brak promocji)
alter table products
  add column if not exists price_promo numeric(10,2);

-- 2. Historia cen — śledzi każdą zmianę price_sell
create table if not exists product_price_history (
  id           uuid        primary key default uuid_generate_v4(),
  product_id   uuid        not null references products(id) on delete cascade,
  price_sell   numeric(10,2) not null,
  recorded_at  timestamptz not null default now()
);

create index if not exists product_price_history_lookup
  on product_price_history(product_id, recorded_at desc);

alter table product_price_history enable row level security;

-- Publiczny odczyt (strona produktu musi wyświetlić najniższą cenę 30d)
create policy "price_history_select"
  on product_price_history for select using (true);

-- Zapis tylko przez service_role (trigger + admin actions)
create policy "price_history_service_role"
  on product_price_history for insert
  with check (auth.role() = 'service_role');

-- 3. Trigger — przy zmianie price_sell zapisuje STARA wartość do historii
create or replace function log_price_sell_change()
returns trigger language plpgsql security definer as $$
begin
  if old.price_sell is distinct from new.price_sell then
    insert into product_price_history(product_id, price_sell, recorded_at)
    values (old.id, old.price_sell, now());
  end if;
  return new;
end;
$$;

drop trigger if exists products_price_history on products;

create trigger products_price_history
  before update on products
  for each row execute function log_price_sell_change();

-- 4. Seed — zapisz aktualną cenę wszystkich produktów jako punkt startowy
insert into product_price_history(product_id, price_sell, recorded_at)
select id, price_sell, now() from products
on conflict do nothing;
