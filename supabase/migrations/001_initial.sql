-- tshirts テーブル
create table public.tshirts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  series text not null,
  character text,
  manufacturer text,
  purchase_date date,
  purchase_place text,
  purchase_price integer,
  size text,
  condition text,
  memo text,
  image_url text,
  thumb_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- wear_logs テーブル
create table public.wear_logs (
  id uuid primary key default gen_random_uuid(),
  tshirt_id uuid not null references public.tshirts(id) on delete cascade,
  worn_at date not null,
  created_at timestamptz not null default now()
);

-- updated_at 自動更新トリガー
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on public.tshirts
  for each row execute function public.handle_updated_at();

-- RLS（Row Level Security）有効化
alter table public.tshirts enable row level security;
alter table public.wear_logs enable row level security;

-- 認証済みユーザーのみ全操作許可（単一ユーザー想定）
create policy "authenticated users can do everything on tshirts"
  on public.tshirts
  for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated users can do everything on wear_logs"
  on public.wear_logs
  for all
  to authenticated
  using (true)
  with check (true);

-- インデックス
create index tshirts_series_idx on public.tshirts(series);
create index tshirts_created_at_idx on public.tshirts(created_at desc);
create index tshirts_purchase_date_idx on public.tshirts(purchase_date desc);
create index wear_logs_tshirt_id_idx on public.wear_logs(tshirt_id);
