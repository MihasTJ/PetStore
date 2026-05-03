-- ── Extensions ──────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Categories ──────────────────────────────────────────────────────
create table categories (
  id   uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  parent_id uuid references categories(id) on delete set null
);

-- ── Suppliers ───────────────────────────────────────────────────────
create table suppliers (
  id                   uuid primary key default uuid_generate_v4(),
  name                 text not null,
  api_type             text not null,
  api_key              text,
  currency             text not null default 'PLN',
  currency_buffer_pct  numeric(5,2) not null default 0,
  last_sync_at         timestamptz,
  is_active            boolean not null default true
);

-- ── Products ────────────────────────────────────────────────────────
create table products (
  id                   uuid primary key default uuid_generate_v4(),
  supplier_id          uuid references suppliers(id) on delete set null,
  external_id          text,
  slug                 text not null unique,
  name_seo             text not null,
  description_seo      text,
  is_seo_locked        boolean not null default false,
  name_original        text,
  description_original text,
  price_original       numeric(10,2) not null,
  price_sell           numeric(10,2) not null,
  stock                integer not null default 0,
  status               text not null default 'active'
                         check (status in ('active', 'archived', 'draft')),
  is_active            boolean not null default true,
  is_premium_verified  boolean not null default false,
  images               text[] not null default '{}',
  category_id          uuid references categories(id) on delete set null,
  species              text[] not null default '{}',
  breed_tags           text[] not null default '{}',
  life_stage           text[] not null default '{}',
  health_tags          text[] not null default '{}',
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- ── Product certificates ─────────────────────────────────────────────
create table product_certificates (
  id               uuid primary key default uuid_generate_v4(),
  product_id       uuid not null references products(id) on delete cascade,
  certificate_name text not null,
  issuing_body     text,
  valid_until      date,
  file_url         text,
  created_at       timestamptz not null default now()
);

-- ── Product endorsements ─────────────────────────────────────────────
create table product_endorsements (
  id            uuid primary key default uuid_generate_v4(),
  product_id    uuid not null references products(id) on delete cascade,
  vet_name      text not null,
  vet_title     text,
  vet_photo_url text,
  quote         text not null check (char_length(quote) <= 280),
  created_at    timestamptz not null default now()
);

-- ── Product ingredients ──────────────────────────────────────────────
create table product_ingredients (
  id                     uuid primary key default uuid_generate_v4(),
  product_id             uuid not null references products(id) on delete cascade,
  ingredient_name        text not null,
  ingredient_description text,
  is_highlighted         boolean not null default false,
  order_index            integer not null default 0,
  created_at             timestamptz not null default now()
);

-- ── Customers (mirrors auth.users) ──────────────────────────────────
create table customers (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  first_name text,
  last_name  text,
  created_at timestamptz not null default now()
);

-- ── Pet profiles ─────────────────────────────────────────────────────
create table pet_profiles (
  id           uuid primary key default uuid_generate_v4(),
  customer_id  uuid not null references customers(id) on delete cascade,
  pet_name     text not null,
  species      text not null check (species in ('pies', 'kot', 'inny')),
  breed        text,
  birth_date   date,
  weight_kg    numeric(5,2),
  health_notes text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ── Shipping methods ─────────────────────────────────────────────────
create table shipping_methods (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  provider     text not null,
  price        numeric(10,2) not null,
  weight_limit numeric(10,2),
  is_active    boolean not null default true
);

-- ── Orders ───────────────────────────────────────────────────────────
create table orders (
  id               uuid primary key default uuid_generate_v4(),
  customer_id      uuid references customers(id) on delete set null,
  status           text not null default 'pending'
                     check (status in ('pending','paid','processing','shipped','delivered','cancelled','refunded')),
  total_amount     numeric(10,2) not null,
  payment_id       text,
  payment_status   text not null default 'pending'
                     check (payment_status in ('pending','paid','failed','refunded')),
  shipping_method  text not null,
  shipping_cost    numeric(10,2) not null,
  shipping_address jsonb not null,
  premium_packaging boolean not null default false,
  packaging_note   text,
  nip              text,
  created_at       timestamptz not null default now()
);

-- ── Order items ──────────────────────────────────────────────────────
create table order_items (
  id                 uuid primary key default uuid_generate_v4(),
  order_id           uuid not null references orders(id) on delete cascade,
  product_id         uuid not null references products(id) on delete restrict,
  quantity           integer not null check (quantity > 0),
  price_at_purchase  numeric(10,2) not null,
  product_snapshot   jsonb not null
);

-- ── Health reports ───────────────────────────────────────────────────
create table health_reports (
  id              uuid primary key default uuid_generate_v4(),
  pet_profile_id  uuid not null references pet_profiles(id) on delete cascade,
  order_id        uuid references orders(id) on delete set null,
  report_pdf_url  text,
  quiz_data       jsonb not null default '{}',
  recommendations jsonb not null default '[]',
  created_at      timestamptz not null default now()
);

-- ── AI alerts ────────────────────────────────────────────────────────
create table ai_alerts (
  id             uuid primary key default uuid_generate_v4(),
  customer_id    uuid not null references customers(id) on delete cascade,
  pet_profile_id uuid not null references pet_profiles(id) on delete cascade,
  alert_type     text not null
                   check (alert_type in ('supplement_ending','life_stage','breed_risk','better_product')),
  urgency        text not null default 'info' check (urgency in ('high','info')),
  message        text not null,
  product_id     uuid references products(id) on delete set null,
  is_sent        boolean not null default false,
  scheduled_at   timestamptz not null default now(),
  sent_at        timestamptz,
  created_at     timestamptz not null default now()
);

-- ── Reviews ──────────────────────────────────────────────────────────
create table reviews (
  id                  uuid primary key default uuid_generate_v4(),
  product_id          uuid not null references products(id) on delete cascade,
  customer_id         uuid not null references customers(id) on delete cascade,
  pet_profile_id      uuid references pet_profiles(id) on delete set null,
  rating              integer not null check (rating between 1 and 5),
  body                text not null,
  pet_photo_url       text,
  is_verified_purchase boolean not null default false,
  created_at          timestamptz not null default now()
);

-- ── Import logs ──────────────────────────────────────────────────────
create table import_logs (
  id               uuid primary key default uuid_generate_v4(),
  supplier_id      uuid not null references suppliers(id) on delete cascade,
  status           text not null check (status in ('success','partial','failed')),
  products_updated integer not null default 0,
  errors_count     integer not null default 0,
  message          text,
  created_at       timestamptz not null default now()
);

-- ── Indexes ──────────────────────────────────────────────────────────
create index products_slug_idx        on products(slug);
create index products_is_active_idx   on products(is_active, status);
create index products_health_tags_idx on products using gin(health_tags);
create index products_species_idx     on products using gin(species);
create index products_life_stage_idx  on products using gin(life_stage);
create index pet_profiles_customer_idx on pet_profiles(customer_id);
create index health_reports_pet_idx   on health_reports(pet_profile_id);
create index ai_alerts_customer_idx   on ai_alerts(customer_id, is_sent);
create index orders_customer_idx      on orders(customer_id);

-- ── updated_at trigger ───────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_updated_at
  before update on products
  for each row execute procedure update_updated_at();

create trigger pet_profiles_updated_at
  before update on pet_profiles
  for each row execute procedure update_updated_at();

-- ── Auto-create customer row on auth sign-up ─────────────────────────
-- first_name / last_name are passed via options.data in supabase.auth.signUp()
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.customers (id, email, first_name, last_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Row Level Security ───────────────────────────────────────────────
alter table products             enable row level security;
alter table product_certificates enable row level security;
alter table product_endorsements enable row level security;
alter table product_ingredients  enable row level security;
alter table customers            enable row level security;
alter table pet_profiles         enable row level security;
alter table health_reports       enable row level security;
alter table ai_alerts            enable row level security;
alter table orders               enable row level security;
alter table order_items          enable row level security;
alter table reviews              enable row level security;
alter table categories           enable row level security;
alter table suppliers            enable row level security;
alter table import_logs          enable row level security;
alter table shipping_methods     enable row level security;

-- products: public read, service_role write
create policy "products_select"
  on products for select using (true);
create policy "products_insert"
  on products for insert with check (auth.role() = 'service_role');
create policy "products_update"
  on products for update using (auth.role() = 'service_role');
create policy "products_delete"
  on products for delete using (auth.role() = 'service_role');

-- product detail tables: public read
create policy "product_certs_select"
  on product_certificates for select using (true);
create policy "product_endorsements_select"
  on product_endorsements for select using (true);
create policy "product_ingredients_select"
  on product_ingredients for select using (true);

-- customers: own row only
create policy "customers_select"
  on customers for select using (auth.uid() = id);
create policy "customers_insert"
  on customers for insert with check (auth.uid() = id);
create policy "customers_update"
  on customers for update using (auth.uid() = id);

-- pet_profiles: own rows
create policy "pet_profiles_select"
  on pet_profiles for select using (auth.uid() = customer_id);
create policy "pet_profiles_insert"
  on pet_profiles for insert with check (auth.uid() = customer_id);
create policy "pet_profiles_update"
  on pet_profiles for update using (auth.uid() = customer_id);
create policy "pet_profiles_delete"
  on pet_profiles for delete using (auth.uid() = customer_id);

-- health_reports: via pet_profiles ownership
create policy "health_reports_select"
  on health_reports for select
  using (
    exists (
      select 1 from pet_profiles
      where pet_profiles.id = pet_profile_id
        and pet_profiles.customer_id = auth.uid()
    )
  );
create policy "health_reports_insert"
  on health_reports for insert
  with check (
    exists (
      select 1 from pet_profiles
      where pet_profiles.id = pet_profile_id
        and pet_profiles.customer_id = auth.uid()
    )
  );

-- ai_alerts: own rows (read + dismiss)
create policy "ai_alerts_select"
  on ai_alerts for select using (auth.uid() = customer_id);
create policy "ai_alerts_update"
  on ai_alerts for update using (auth.uid() = customer_id);

-- orders: own rows (guest orders use anon insert)
create policy "orders_select"
  on orders for select using (auth.uid() = customer_id);
create policy "orders_insert"
  on orders for insert with check (true);
create policy "orders_update"
  on orders for update using (auth.uid() = customer_id);

-- order_items: via order ownership
create policy "order_items_select"
  on order_items for select
  using (
    exists (
      select 1 from orders
      where orders.id = order_id
        and (orders.customer_id = auth.uid() or auth.role() = 'service_role')
    )
  );
create policy "order_items_insert"
  on order_items for insert with check (true);

-- reviews: public read, own write
create policy "reviews_select"
  on reviews for select using (true);
create policy "reviews_insert"
  on reviews for insert with check (auth.uid() = customer_id);
create policy "reviews_update"
  on reviews for update using (auth.uid() = customer_id);
create policy "reviews_delete"
  on reviews for delete using (auth.uid() = customer_id);

-- categories + shipping_methods: public read
create policy "categories_select"
  on categories for select using (true);
create policy "shipping_methods_select"
  on shipping_methods for select using (is_active = true);

-- admin-only tables
create policy "suppliers_admin"
  on suppliers for all using (auth.role() = 'service_role');
create policy "import_logs_admin"
  on import_logs for all using (auth.role() = 'service_role');
