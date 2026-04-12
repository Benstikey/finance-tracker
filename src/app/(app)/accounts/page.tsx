import { createClient } from "@/lib/supabase/server";
import type { AccountWithCurrency, Currency } from "@/lib/types/database";
import { AccountsClient } from "./accounts-client";

export default async function AccountsPage() {
  const supabase = await createClient();

  const [accountsRes, currenciesRes] = await Promise.all([
    supabase
      .from("accounts")
      .select("*, currencies(*)")
      .order("type", { ascending: true }),
    supabase.from("currencies").select("*").order("code", { ascending: true }),
  ]);

  const accounts = (accountsRes.data || []) as unknown as AccountWithCurrency[];
  const currencies = (currenciesRes.data || []) as Currency[];

  return <AccountsClient accounts={accounts} currencies={currencies} />;
}
