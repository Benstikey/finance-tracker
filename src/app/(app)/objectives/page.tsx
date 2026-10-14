import { requireUserId } from "@/lib/dal";
import { getCurrencies, getObjectives } from "@/lib/queries";
import { getExchangeRates } from "@/lib/exchange-rates";
import { ObjectivesClient } from "./objectives-client";

export default async function ObjectivesPage() {
  const userId = await requireUserId();

  const [objectives, currencies, rates] = await Promise.all([
    getObjectives(userId),
    getCurrencies(),
    getExchangeRates("USD"),
  ]);

  return (
    <ObjectivesClient
      objectives={objectives}
      currencies={currencies}
      rates={rates}
    />
  );
}
