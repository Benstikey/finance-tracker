import { requireUserId } from "@/lib/dal";
import { getAccounts, getDisplayCurrency, getTransactions } from "@/lib/queries";
import { getExchangeRates } from "@/lib/exchange-rates";
import { accountBalanceHistory, historyDays } from "@/lib/history";
import { NetWorthClient, type NetWorthRow } from "./net-worth-client";

export default async function NetWorthPage() {
  const userId = await requireUserId();

  const [accounts, transactions, rates, base] = await Promise.all([
    getAccounts(userId, "name"),
    getTransactions(userId, "asc"),
    getExchangeRates("USD"),
    getDisplayCurrency(userId),
  ]);

  const days = historyDays();
  const balances = accountBalanceHistory(days, accounts, transactions, rates, base);

  const history: NetWorthRow[] = days.map((date, i) => ({
    date,
    total: Object.values(balances[i]).reduce((s, v) => s + v, 0),
    accounts: balances[i],
  }));

  const accountMeta = accounts.map((a) => ({
    id: a.id,
    name: a.name,
    currencyCode: a.currencies.code,
  }));

  return <NetWorthClient history={history} accountMeta={accountMeta} />;
}
