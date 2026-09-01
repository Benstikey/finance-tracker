-- Finance Tracker — initial schema for plain Postgres (Neon).
--
-- Ported from the previous Supabase migrations. Two deliberate differences:
--   1. `auth.users` is gone, so identities live in `public.users` and every
--      user_id foreign key points there.
--   2. Row Level Security is gone, because there is no `auth.uid()` outside
--      Supabase. Every query in the app scopes by user_id explicitly instead
--      (see src/lib/dal.ts and the per-table query modules).

create extension if not exists pgcrypto;

-- Identities. Replaces Supabase's auth.users.
create table if not exists public.users (
  id            uuid primary key default gen_random_uuid(),
  email         text not null,
  password_hash text not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Emails are case-insensitive for login purposes.
create unique index if not exists users_email_lower_idx on public.users (lower(email));

create table if not exists public.currencies (
  id         uuid primary key default gen_random_uuid(),
  code       text unique not null,
  name       text not null,
  symbol     text not null,
  created_at timestamptz default now()
);

create table if not exists public.accounts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  name        text not null,
  type        text not null check (type in ('bank', 'wallet', 'cash', 'loan')),
  currency_id uuid not null references public.currencies(id),
  balance     numeric not null default 0,
  icon        text,
  notes       text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table if not exists public.objectives (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users(id) on delete cascade,
  name          text not null,
  target_amount numeric not null,
  currency_id   uuid not null references public.currencies(id),
  current_saved numeric not null default 0,
  priority      int default 0,
  completed     boolean default false,
  created_at    timestamptz default now()
);

create table if not exists public.transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  account_id  uuid not null references public.accounts(id) on delete cascade,
  amount      numeric not null,
  description text,
  date        date not null default current_date,
  created_at  timestamptz default now()
);

create table if not exists public.loans (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  person      text not null,
  description text,
  amount      numeric not null,
  currency_id uuid not null references public.currencies(id),
  direction   text not null check (direction in ('lent', 'borrowed')),
  settled     boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table if not exists public.cash_flows (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users(id) on delete cascade,
  name         text not null,
  amount       numeric not null,
  currency_id  uuid not null references public.currencies(id),
  type         text not null check (type in ('income', 'expense')),
  frequency    text not null check (frequency in ('one_time', 'daily', 'weekly', 'monthly', 'yearly')),
  start_date   date not null,
  end_date     date,
  day_of_month int,
  notes        text,
  active       boolean default true,
  created_at   timestamptz default now()
);

-- Every list view filters on user_id, so index it.
create index if not exists accounts_user_id_idx     on public.accounts (user_id);
create index if not exists objectives_user_id_idx   on public.objectives (user_id);
create index if not exists transactions_user_id_idx on public.transactions (user_id);
create index if not exists transactions_account_idx on public.transactions (account_id);
create index if not exists loans_user_id_idx        on public.loans (user_id);
create index if not exists cash_flows_user_id_idx   on public.cash_flows (user_id);

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_account_updated on public.accounts;
create trigger on_account_updated
  before update on public.accounts
  for each row execute procedure public.handle_updated_at();

drop trigger if exists on_loan_updated on public.loans;
create trigger on_loan_updated
  before update on public.loans
  for each row execute procedure public.handle_updated_at();

drop trigger if exists on_user_updated on public.users;
create trigger on_user_updated
  before update on public.users
  for each row execute procedure public.handle_updated_at();

-- Default currencies (same three the old database seeded).
insert into public.currencies (code, name, symbol) values
  ('MAD', 'Moroccan Dirham', 'د.م.'),
  ('USD', 'US Dollar', '$'),
  ('EUR', 'Euro', '€')
on conflict (code) do nothing;
