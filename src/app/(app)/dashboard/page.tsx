import { requireUserId } from "@/lib/dal";
import { getAccounts, getLoans, getTransactions } from "@/lib/queries";
import { getExchangeRates, convertCurrency } from "@/lib/exchange-rates";
import {
  accountBalanceHistory,
  historyDays,
  loanHistory,
  loanHistoryByPerson,
  transactionFlowHistory,
} from "@/lib/history";
import type { RankedItem } from "@/components/metrics";
import { DashboardClient, type DashboardSeries } from "./dashboard-client";

export default async function DashboardPage() {
  const userId = await requireUserId();

  const [accounts, transactions, loans, rates] = await Promise.all([
    getAccounts(userId, "name"),
    getTransactions(userId, "asc"),
    getLoans(userId),
    getExchangeRates("USD"),
  ]);

  const toMAD = (amount: number, code: string) =>
    convertCurrency(amount, code, "MAD", rates);

  const days = historyDays();
  const balances = accountBalanceHistory(days, accounts, transactions, rates);
  const loanTotals = loanHistory(days, loans, rates);
  const byPerson = loanHistoryByPerson(days, loans, rates);
  const flows = transactionFlowHistory(days, accounts, transactions, rates);

  const netWorth = balances.map((row) =>
    Object.values(row).reduce((s, v) => s + v, 0)
  );

  const codes = [...new Set(accounts.map((a) => a.currencies.code))];
  const currencyBalance = (code: string) =>
    days.map((_, i) =>
      accounts
        .filter((a) => a.currencies.code === code)
        .reduce((s, a) => s + balances[i][a.id], 0)
    );
  const currencyFlow = (code: string) =>
    days.map((_, i) =>
      accounts
        .filter((a) => a.currencies.code === code)
        .reduce((s, a) => s + flows[a.id][i], 0)
    );

  const series: DashboardSeries = {
    end: days.at(-1)!,
    netWorth,
    lent: loanTotals.map((l) => l.lent),
    borrowed: loanTotals.map((l) => l.borrowed),
    flow: days.map((_, i) =>
      accounts.reduce((s, a) => s + flows[a.id][i], 0)
    ),
    accounts: accounts.map((a) => ({
      id: a.id,
      name: a.name,
      balance: balances.map((row) => row[a.id]),
      flow: flows[a.id],
    })),
    currencies: codes.map((code) => ({
      code,
      balance: currencyBalance(code),
      flow: currencyFlow(code),
    })),
    people: {
      lent: Object.entries(byPerson.lent).map(([name, s]) => ({ name, series: s })),
      borrowed: Object.entries(byPerson.borrowed).map(([name, s]) => ({
        name,
        series: s,
      })),
    },
  };

  const accountItems: RankedItem[] = accounts
    .map((a) => ({
      label: a.name,
      hint: a.currencies.code,
      value: Math.round(toMAD(a.balance, a.currencies.code)),
    }))
    .sort((a, b) => b.value - a.value);

  const currencyItems: RankedItem[] = codes
    .map((code) => ({
      label: code,
      value: Math.round(
        accounts
          .filter((a) => a.currencies.code === code)
          .reduce((s, a) => s + toMAD(a.balance, code), 0)
      ),
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <DashboardClient
      series={series}
      accounts={accountItems}
      currencies={currencyItems}
    />
  );
}
