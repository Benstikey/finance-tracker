import { requireUserId } from "@/lib/dal";
import { getAccounts, getCashFlows, getCurrencies } from "@/lib/queries";
import { getExchangeRates, convertCurrency } from "@/lib/exchange-rates";
import { CashFlowClient } from "./cash-flow-client";

export default async function CashFlowPage() {
  const userId = await requireUserId();

  const [cashFlows, currencies, accounts, rates] = await Promise.all([
    getCashFlows(userId),
    getCurrencies(),
    getAccounts(userId, "type"),
    getExchangeRates("USD"),
  ]);

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
