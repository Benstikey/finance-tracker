"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addTransaction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const accountId = formData.get("account_id") as string;
  const rawAmount = parseFloat(formData.get("amount") as string) || 0;
  const type = formData.get("type") as "deposit" | "withdrawal";
  const amount = type === "withdrawal" ? -Math.abs(rawAmount) : Math.abs(rawAmount);
  const description = (formData.get("description") as string) || null;
  const date = (formData.get("date") as string) || new Date().toISOString().split("T")[0];

  // Insert the transaction
  const { error: txError } = await supabase.from("transactions").insert({
    user_id: user.id,
    account_id: accountId,
    amount,
    description,
    date,
  });
  if (txError) throw new Error(txError.message);

  // Update account balance
  const { data: account, error: fetchError } = await supabase
    .from("accounts")
    .select("balance")
    .eq("id", accountId)
    .eq("user_id", user.id)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  const { error: updateError } = await supabase
    .from("accounts")
    .update({ balance: (account.balance as number) + amount })
    .eq("id", accountId)
    .eq("user_id", user.id);
  if (updateError) throw new Error(updateError.message);

  revalidatePath("/accounts");
  revalidatePath("/dashboard");
  revalidatePath("/net-worth");
}

export async function deleteTransaction(id: string, accountId: string, amount: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error: delError } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (delError) throw new Error(delError.message);

  // Reverse the balance change
  const { data: account, error: fetchError } = await supabase
    .from("accounts")
    .select("balance")
    .eq("id", accountId)
    .eq("user_id", user.id)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  const { error: updateError } = await supabase
    .from("accounts")
    .update({ balance: (account.balance as number) - amount })
    .eq("id", accountId)
    .eq("user_id", user.id);
  if (updateError) throw new Error(updateError.message);

  revalidatePath("/accounts");
  revalidatePath("/dashboard");
  revalidatePath("/net-worth");
}
