-- Transfers, goal projections and partial loan repayments.
-- Additive only, and idempotent like 0001.

-- Transfers: the two transactions of a transfer share a transfer_id, so they
-- can be shown together and deleted together.
alter table public.transactions
  add column if not exists transfer_id uuid;

create index if not exists transactions_transfer_idx
  on public.transactions (transfer_id) where transfer_id is not null;

-- Goal projections: how much goes into an objective each month, and an
-- optional date it should be reached by.
alter table public.objectives
  add column if not exists monthly_contribution numeric,
  add column if not exists target_date date;

-- Partial loan repayments. Amounts are in the loan's own currency.
create table if not exists public.loan_repayments (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users(id) on delete cascade,
  loan_id    uuid not null references public.loans(id) on delete cascade,
  amount     numeric not null check (amount > 0),
  date       date not null default current_date,
  note       text,
  created_at timestamptz default now()
);

create index if not exists loan_repayments_loan_idx on public.loan_repayments (loan_id);
create index if not exists loan_repayments_user_idx on public.loan_repayments (user_id);
