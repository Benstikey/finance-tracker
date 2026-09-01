import { requireUserId } from "@/lib/dal";
import { getCurrencies, getLoans } from "@/lib/queries";
import { LoansClient } from "./loans-client";

export default async function LoansPage() {
  const userId = await requireUserId();

  const [loans, currencies] = await Promise.all([
    getLoans(userId),
    getCurrencies(),
  ]);

  return <LoansClient loans={loans} currencies={currencies} />;
}
