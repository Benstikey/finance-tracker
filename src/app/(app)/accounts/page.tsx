import { createClient } from "@/lib/supabase/server";
import type { AccountWithCurrency, Currency, Transaction } from "@/lib/types/database";
import { AccountsClient } from "./accounts-client";

export default async function AccountsPage() {
  const supabase = await createClient();

  const [accountsRes, currenciesRes, transactionsRes] = await Promise.all([
    supabase
      .from("accounts")
      .select("*, currencies(*)")
      .order("type", { ascending: true }),
    supabase.from("currencies").select("*").order("code", { ascending: true }),
    supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false }),
  ]);

  const accounts = (accountsRes.data || []) as unknown as AccountWithCurrency[];
  const currencies = (currenciesRes.data || []) as Currency[];
  const transactions = (transactionsRes.data || []) as Transaction[];

  return (
    <AccountsClient
      accounts={accounts}
      currencies={currencies}
      transactions={transactions}
    />
  );
}
