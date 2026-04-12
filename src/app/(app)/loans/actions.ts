"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createLoan(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("loans").insert({
    user_id: user.id,
    person: formData.get("person") as string,
    description: (formData.get("description") as string) || null,
    amount: parseFloat(formData.get("amount") as string),
    currency_id: formData.get("currency_id") as string,
    direction: formData.get("direction") as "lent" | "borrowed",
  });

  if (error) throw new Error(error.message);
  revalidatePath("/loans");
  revalidatePath("/dashboard");
}

export async function updateLoan(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const id = formData.get("id") as string;
  const { error } = await supabase
    .from("loans")
    .update({
      person: formData.get("person") as string,
      description: (formData.get("description") as string) || null,
      amount: parseFloat(formData.get("amount") as string),
      currency_id: formData.get("currency_id") as string,
      direction: formData.get("direction") as "lent" | "borrowed",
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/loans");
  revalidatePath("/dashboard");
}

export async function deleteLoan(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("loans")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/loans");
  revalidatePath("/dashboard");
}

export async function toggleLoanSettled(id: string, settled: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("loans")
    .update({ settled })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/loans");
  revalidatePath("/dashboard");
}
