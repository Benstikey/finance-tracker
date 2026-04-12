import { createClient } from "@/lib/supabase/server";
import type { Currency } from "@/lib/types/database";
import { CurrenciesClient } from "./currencies-client";

export default async function CurrenciesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("currencies")
    .select("*")
    .order("code", { ascending: true });

  return <CurrenciesClient currencies={(data || []) as Currency[]} />;
}
