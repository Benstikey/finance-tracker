import { requireUserId } from "@/lib/dal";
import { getAccounts, getCurrencies, getTransactions } from "@/lib/queries";
import { AccountsClient } from "./accounts-client";

export default async function AccountsPage() {
  const userId = await requireUserId();

  const [accounts, currencies, transactions] = await Promise.all([
    getAccounts(userId, "type"),
    getCurrencies(),
    getTransactions(userId, "desc"),
  ]);

  return (
    <AccountsClient
      accounts={accounts}
      currencies={currencies}
      transactions={transactions}
    />
  );
}
