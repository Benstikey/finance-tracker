CREATE TABLE public.cash_flows (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  amount numeric NOT NULL,
  currency_id uuid REFERENCES public.currencies(id) NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  frequency text NOT NULL CHECK (frequency IN ('one_time', 'daily', 'weekly', 'monthly', 'yearly')),
  start_date date NOT NULL,
  end_date date,
  day_of_month int,
  notes text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.cash_flows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cash_flows" ON public.cash_flows
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cash_flows" ON public.cash_flows
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cash_flows" ON public.cash_flows
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cash_flows" ON public.cash_flows
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
