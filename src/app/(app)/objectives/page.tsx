import { requireUserId } from "@/lib/dal";
import { getCurrencies, getObjectives } from "@/lib/queries";
import { ObjectivesClient } from "./objectives-client";

export default async function ObjectivesPage() {
  const userId = await requireUserId();

  const [objectives, currencies] = await Promise.all([
    getObjectives(userId),
    getCurrencies(),
  ]);

  return <ObjectivesClient objectives={objectives} currencies={currencies} />;
}
