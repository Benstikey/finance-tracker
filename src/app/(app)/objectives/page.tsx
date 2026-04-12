import { createClient } from "@/lib/supabase/server";
import type { ObjectiveWithCurrency, Currency } from "@/lib/types/database";
import { ObjectivesClient } from "./objectives-client";

export default async function ObjectivesPage() {
  const supabase = await createClient();

  const [objectivesRes, currenciesRes] = await Promise.all([
    supabase
      .from("objectives")
      .select("*, currencies(*)")
      .order("priority", { ascending: true }),
    supabase.from("currencies").select("*").order("code", { ascending: true }),
  ]);

  const objectives = (objectivesRes.data || []) as unknown as ObjectiveWithCurrency[];
  const currencies = (currenciesRes.data || []) as Currency[];

  return <ObjectivesClient objectives={objectives} currencies={currencies} />;
}
