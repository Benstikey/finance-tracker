-- Add a date field to transactions (separate from created_at)
-- so users can record transactions on a date they choose
alter table public.transactions
  add column if not exists date date not null default current_date;

-- Allow users to delete their own transactions
create policy "Users can delete own transactions" on public.transactions
  for delete to authenticated using (auth.uid() = user_id);

-- Allow users to update their own transactions
create policy "Users can update own transactions" on public.transactions
  for update to authenticated using (auth.uid() = user_id);
