import { createClient } from "@/lib/supabase/server";
import { getExchangeRates, convertCurrency } from "@/lib/exchange-rates";
import type { AccountWithCurrency, Transaction } from "@/lib/types/database";
import { NetWorthClient } from "./net-worth-client";

/** Generate every calendar date between start and end inclusive (YYYY-MM-DD). */
function dateRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const cur = new Date(start + "T00:00:00Z");
  const last = new Date(end + "T00:00:00Z");
  while (cur <= last) {
    dates.push(cur.toISOString().split("T")[0]);
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return dates;
}

export default async function NetWorthPage() {
  const supabase = await createClient();

  const [accountsRes, transactionsRes, rates] = await Promise.all([
    supabase
      .from("accounts")
      .select("*, currencies(*)")
      .order("name", { ascending: true }),
    supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: true }),
    getExchangeRates("USD"),
  ]);

  const accounts = (accountsRes.data || []) as unknown as AccountWithCurrency[];
  const transactions = (transactionsRes.data || []) as Transaction[];

  const today = new Date().toISOString().split("T")[0];

  // Find the earliest date to start the chart from.
  // Use the oldest transaction date, or fall back to 30 days ago.
  const thirtyDaysAgo = new Date(today + "T00:00:00Z");
  thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 30);
  const fallbackStart = thirtyDaysAgo.toISOString().split("T")[0];

  const earliestTx = transactions[0]?.date; // already sorted asc
  const startDate = earliestTx && earliestTx < fallbackStart ? earliestTx : fallbackStart;

  // Continuous daily range: always at least 2 points (start ... today)
  const allDates = dateRange(startDate, today);

  // initial_balance[acct] (in native currency) = current_balance - sum(all txs)
  // so: balance at date D = initial_balance + sum(txs where date <= D)
  const initialBalanceNative: Record<string, number> = {};
  for (const acct of accounts) {
    const sumTx = transactions
      .filter((t) => t.account_id === acct.id)
      .reduce((s, t) => s + t.amount, 0);
    initialBalanceNative[acct.id] = acct.balance - sumTx;
  }

  type ChartRow = Record<string, number | string>;

  const chartData: ChartRow[] = allDates.map((date) => {
    const row: ChartRow = { date };
    let totalMAD = 0;

    for (const acct of accounts) {
      const sumTxNative = transactions
        .filter((t) => t.account_id === acct.id && t.date <= date)
        .reduce((s, t) => s + t.amount, 0);

      const balanceNative = initialBalanceNative[acct.id] + sumTxNative;
      const balanceMAD = convertCurrency(
        balanceNative,
        acct.currencies.code,
        "MAD",
        rates
      );
      row[acct.id] = Math.round(balanceMAD * 100) / 100;
      totalMAD += balanceMAD;
    }

    row["__total__"] = Math.round(totalMAD * 100) / 100;
    return row;
  });

  const accountMeta = accounts.map((a) => ({
    id: a.id,
    name: a.name,
    type: a.type,
    currencyCode: a.currencies.code,
  }));

  return <NetWorthClient chartData={chartData} accountMeta={accountMeta} />;
}
