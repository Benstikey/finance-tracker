import { requireUserId } from "@/lib/dal";
import { getAccounts, getCashFlows, getCurrencies, getDisplayCurrency } from "@/lib/queries";
import { getExchangeRates, convertCurrency } from "@/lib/exchange-rates";
import { CashFlowClient } from "./cash-flow-client";

export default async function CashFlowPage() {
  const userId = await requireUserId();

  const [cashFlows, currencies, accounts, rates, base] = await Promise.all([
    getCashFlows(userId),
    getCurrencies(),
    getAccounts(userId, "type"),
    getExchangeRates("USD"),
    getDisplayCurrency(userId),
  ]);

  // Current total balance, in the user's display currency.
  let currentBalance = 0;
  for (const account of accounts) {
    currentBalance += convertCurrency(account.balance, account.currencies.code, base, rates);
  }

  return (
    <CashFlowClient
      cashFlows={cashFlows}
      currencies={currencies}
      currentBalance={currentBalance}
      rates={rates}
    />
  );
}
