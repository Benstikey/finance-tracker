import { requireUserId } from "@/lib/dal";
import { getAccounts, getCurrencies, getTransactions } from "@/lib/queries";
import { getExchangeRates } from "@/lib/exchange-rates";
import { AccountsClient } from "./accounts-client";

export default async function AccountsPage() {
  const userId = await requireUserId();

  const [accounts, currencies, transactions, rates] = await Promise.all([
    getAccounts(userId, "type"),
    getCurrencies(),
    getTransactions(userId, "desc"),
    getExchangeRates("USD"),
  ]);

  return (
    <AccountsClient
      accounts={accounts}
      currencies={currencies}
      transactions={transactions}
      rates={rates}
    />
  );
}
