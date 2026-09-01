import { requireUserId } from "@/lib/dal";
import { getCurrencies } from "@/lib/queries";
import { CurrenciesClient } from "./currencies-client";

export default async function CurrenciesPage() {
  await requireUserId();
  const currencies = await getCurrencies();

  return <CurrenciesClient currencies={currencies} />;
}
