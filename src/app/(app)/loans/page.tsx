import { requireUserId } from "@/lib/dal";
import { getCurrencies, getLoans } from "@/lib/queries";
import { getExchangeRates } from "@/lib/exchange-rates";
import { LoansClient } from "./loans-client";

export default async function LoansPage() {
  const userId = await requireUserId();

  const [loans, currencies, rates] = await Promise.all([
    getLoans(userId),
    getCurrencies(),
    getExchangeRates("USD"),
  ]);

  return <LoansClient loans={loans} currencies={currencies} rates={rates} />;
}
