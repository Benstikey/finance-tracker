-- Loans table (separate from accounts)
CREATE TABLE public.loans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  person text NOT NULL,
  description text,
  amount numeric NOT NULL,
  currency_id uuid REFERENCES public.currencies(id) NOT NULL,
  direction text NOT NULL CHECK (direction IN ('lent', 'borrowed')),
  settled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own loans" ON public.loans
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own loans" ON public.loans
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own loans" ON public.loans
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own loans" ON public.loans
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER on_loan_updated
  BEFORE UPDATE ON public.loans
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
