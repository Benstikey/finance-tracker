-- Currencies table
create table public.currencies (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  name text not null,
  symbol text not null,
  created_at timestamptz default now()
);

-- Accounts table
create table public.accounts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  type text not null check (type in ('bank', 'wallet', 'cash', 'loan')),
  currency_id uuid references public.currencies(id) not null,
  balance numeric default 0 not null,
  icon text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Objectives table
create table public.objectives (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  target_amount numeric not null,
  currency_id uuid references public.currencies(id) not null,
  current_saved numeric default 0 not null,
  priority int default 0,
  completed boolean default false,
  created_at timestamptz default now()
);

-- Transactions table
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  account_id uuid references public.accounts(id) on delete cascade not null,
  amount numeric not null,
  description text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.currencies enable row level security;
alter table public.accounts enable row level security;
alter table public.objectives enable row level security;
alter table public.transactions enable row level security;

-- Currencies are readable by all authenticated users
create policy "Currencies are viewable by authenticated users" on public.currencies
  for select to authenticated using (true);

create policy "Currencies are insertable by authenticated users" on public.currencies
  for insert to authenticated with check (true);

-- Accounts: users can only see/modify their own
create policy "Users can view own accounts" on public.accounts
  for select to authenticated using (auth.uid() = user_id);

create policy "Users can insert own accounts" on public.accounts
  for insert to authenticated with check (auth.uid() = user_id);

create policy "Users can update own accounts" on public.accounts
  for update to authenticated using (auth.uid() = user_id);

create policy "Users can delete own accounts" on public.accounts
  for delete to authenticated using (auth.uid() = user_id);

-- Objectives: users can only see/modify their own
create policy "Users can view own objectives" on public.objectives
  for select to authenticated using (auth.uid() = user_id);

create policy "Users can insert own objectives" on public.objectives
  for insert to authenticated with check (auth.uid() = user_id);

create policy "Users can update own objectives" on public.objectives
  for update to authenticated using (auth.uid() = user_id);

create policy "Users can delete own objectives" on public.objectives
  for delete to authenticated using (auth.uid() = user_id);

-- Transactions: users can only see/modify their own
create policy "Users can view own transactions" on public.transactions
  for select to authenticated using (auth.uid() = user_id);

create policy "Users can insert own transactions" on public.transactions
  for insert to authenticated with check (auth.uid() = user_id);

-- Seed default currencies
insert into public.currencies (code, name, symbol) values
  ('MAD', 'Moroccan Dirham', 'د.م.'),
  ('USD', 'US Dollar', '$'),
  ('EUR', 'Euro', '€');

-- Function to auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_account_updated
  before update on public.accounts
  for each row execute procedure public.handle_updated_at();
