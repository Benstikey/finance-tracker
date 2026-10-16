-- Display currency: the currency each user's totals are converted to and shown in.
-- Existing users keep MAD (what the app always used); new users default to USD.
-- Idempotent: re-running leaves existing values alone.

alter table public.users
  add column if not exists display_currency text not null default 'MAD';

alter table public.users
  alter column display_currency set default 'USD';
