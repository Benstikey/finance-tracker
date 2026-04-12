"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCurrency(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("currencies").insert({
    code: (formData.get("code") as string).toUpperCase(),
    name: formData.get("name") as string,
    symbol: formData.get("symbol") as string,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/currencies");
  revalidatePath("/accounts");
  revalidatePath("/objectives");
}
