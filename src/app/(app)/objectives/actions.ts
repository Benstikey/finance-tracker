"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createObjective(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("objectives").insert({
    user_id: user.id,
    name: formData.get("name") as string,
    target_amount: parseFloat(formData.get("target_amount") as string),
    currency_id: formData.get("currency_id") as string,
    current_saved: parseFloat(formData.get("current_saved") as string) || 0,
    priority: parseInt(formData.get("priority") as string) || 0,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/objectives");
  revalidatePath("/dashboard");
}

export async function updateObjective(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const id = formData.get("id") as string;
  const { error } = await supabase
    .from("objectives")
    .update({
      name: formData.get("name") as string,
      target_amount: parseFloat(formData.get("target_amount") as string),
      currency_id: formData.get("currency_id") as string,
      current_saved: parseFloat(formData.get("current_saved") as string) || 0,
      priority: parseInt(formData.get("priority") as string) || 0,
      completed: formData.get("completed") === "true",
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/objectives");
  revalidatePath("/dashboard");
}

export async function deleteObjective(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("objectives")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/objectives");
  revalidatePath("/dashboard");
}

export async function toggleObjectiveComplete(id: string, completed: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("objectives")
    .update({ completed })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/objectives");
  revalidatePath("/dashboard");
}
