"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCashFlow(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const frequency = formData.get("frequency") as string;
  const { error } = await supabase.from("cash_flows").insert({
    user_id: user.id,
    name: formData.get("name") as string,
    amount: parseFloat(formData.get("amount") as string),
    currency_id: formData.get("currency_id") as string,
    type: formData.get("type") as "income" | "expense",
    frequency: frequency as "one_time" | "daily" | "weekly" | "monthly" | "yearly",
    start_date: formData.get("start_date") as string,
    end_date: (formData.get("end_date") as string) || null,
    day_of_month:
      frequency === "monthly"
        ? parseInt(formData.get("day_of_month") as string) || null
        : null,
    notes: (formData.get("notes") as string) || null,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/cash-flow");
  revalidatePath("/dashboard");
}

export async function updateCashFlow(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const id = formData.get("id") as string;
  const frequency = formData.get("frequency") as string;
  const { error } = await supabase
    .from("cash_flows")
    .update({
      name: formData.get("name") as string,
      amount: parseFloat(formData.get("amount") as string),
      currency_id: formData.get("currency_id") as string,
      type: formData.get("type") as "income" | "expense",
      frequency: frequency as "one_time" | "daily" | "weekly" | "monthly" | "yearly",
      start_date: formData.get("start_date") as string,
      end_date: (formData.get("end_date") as string) || null,
      day_of_month:
        frequency === "monthly"
          ? parseInt(formData.get("day_of_month") as string) || null
          : null,
      notes: (formData.get("notes") as string) || null,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/cash-flow");
  revalidatePath("/dashboard");
}

export async function deleteCashFlow(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("cash_flows")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/cash-flow");
  revalidatePath("/dashboard");
}

export async function toggleCashFlowActive(id: string, active: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("cash_flows")
    .update({ active })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/cash-flow");
  revalidatePath("/dashboard");
}
