import { createClient } from "@/lib/supabase/server";
import type { LoanWithCurrency, Currency } from "@/lib/types/database";
import { LoansClient } from "./loans-client";

export default async function LoansPage() {
  const supabase = await createClient();

  const [loansRes, currenciesRes] = await Promise.all([
    supabase
      .from("loans")
      .select("*, currencies(*)")
      .order("settled", { ascending: true })
      .order("created_at", { ascending: false }),
    supabase.from("currencies").select("*").order("code", { ascending: true }),
  ]);

  const loans = (loansRes.data || []) as unknown as LoanWithCurrency[];
  const currencies = (currenciesRes.data || []) as Currency[];

  return <LoansClient loans={loans} currencies={currencies} />;
}
