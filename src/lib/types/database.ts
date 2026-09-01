/**
 * Row types for the application tables.
 *
 * Previously this mirrored Supabase's generated `Database` type (with Insert /
 * Update / Relationships variants consumed by the supabase-js client). Queries
 * are now plain SQL, so only the row shapes are needed.
 */

export type User = {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export type Currency = {
  id: string;
  code: string;
  name: string;
  symbol: string;
  created_at: string;
};

export type Account = {
  id: string;
  user_id: string;
  name: string;
  type: string;
  currency_id: string;
  balance: number;
  icon: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Objective = {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  currency_id: string;
  current_saved: number;
  priority: number;
  completed: boolean;
  created_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  account_id: string;
  amount: number;
  description: string | null;
  date: string;
  created_at: string;
};

export type Loan = {
  id: string;
  user_id: string;
  person: string;
  description: string | null;
  amount: number;
  currency_id: string;
  direction: "lent" | "borrowed";
  settled: boolean;
  created_at: string;
  updated_at: string;
};

export type CashFlow = {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  currency_id: string;
  type: "income" | "expense";
  frequency: "one_time" | "daily" | "weekly" | "monthly" | "yearly";
  start_date: string;
  end_date: string | null;
  day_of_month: number | null;
  notes: string | null;
  active: boolean;
  created_at: string;
};

export type AccountWithCurrency = Account & { currencies: Currency };
export type ObjectiveWithCurrency = Objective & { currencies: Currency };
export type LoanWithCurrency = Loan & { currencies: Currency };
export type CashFlowWithCurrency = CashFlow & { currencies: Currency };
export type TransactionWithAccount = Transaction & {
  accounts: AccountWithCurrency;
};
