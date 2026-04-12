import { createClient } from "@/lib/supabase/server";
import { getExchangeRates, convertCurrency } from "@/lib/exchange-rates";
import type {
  CashFlowWithCurrency,
  Currency,
  AccountWithCurrency,
} from "@/lib/types/database";
import { CashFlowClient } from "./cash-flow-client";

export default async function CashFlowPage() {
  const supabase = await createClient();

  const [cashFlowsRes, currenciesRes, accountsRes, rates] = await Promise.all([
    supabase
      .from("cash_flows")
      .select("*, currencies(*)")
      .order("type", { ascending: true })
      .order("created_at", { ascending: false }),
    supabase.from("currencies").select("*").order("code", { ascending: true }),
    supabase.from("accounts").select("*, currencies(*)"),
    getExchangeRates("USD"),
  ]);

  const cashFlows = (cashFlowsRes.data ||
    []) as unknown as CashFlowWithCurrency[];
  const currencies = (currenciesRes.data || []) as Currency[];
  const accounts = (accountsRes.data ||
    []) as unknown as AccountWithCurrency[];

  // Calculate current total balance in MAD
  let currentBalanceMAD = 0;
  for (const account of accounts) {
    currentBalanceMAD += convertCurrency(
      account.balance,
      account.currencies.code,
      "MAD",
      rates
    );
  }

  return (
    <CashFlowClient
      cashFlows={cashFlows}
      currencies={currencies}
      currentBalanceMAD={currentBalanceMAD}
      rates={rates}
    />
  );
}
