create table product_change_log (
  id          uuid        primary key default uuid_generate_v4(),
  product_id  uuid        not null references products(id) on delete cascade,
  changed_by  text        not null default 'Admin',
  source      text        not null default 'admin', -- 'admin' | 'sync' | 'system'
  summary     text        not null,
  created_at  timestamptz not null default now()
);

create index product_change_log_product_id_idx on product_change_log(product_id, created_at desc);

alter table product_change_log enable row level security;

create policy "change_log_service_role"
  on product_change_log for all
  using (auth.role() = 'service_role');
