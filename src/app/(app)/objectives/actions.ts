"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { requireUserId } from "@/lib/dal";

export async function createObjective(formData: FormData) {
  const userId = await requireUserId();

  await sql`
    insert into objectives (user_id, name, target_amount, currency_id, current_saved, priority)
    values (
      ${userId},
      ${formData.get("name") as string},
      ${parseFloat(formData.get("target_amount") as string)},
      ${formData.get("currency_id") as string},
      ${parseFloat(formData.get("current_saved") as string) || 0},
      ${parseInt(formData.get("priority") as string) || 0}
    )
  `;

  revalidatePath("/objectives");
  revalidatePath("/dashboard");
}

export async function updateObjective(formData: FormData) {
  const userId = await requireUserId();

  await sql`
    update objectives set
      name          = ${formData.get("name") as string},
      target_amount = ${parseFloat(formData.get("target_amount") as string)},
      currency_id   = ${formData.get("currency_id") as string},
      current_saved = ${parseFloat(formData.get("current_saved") as string) || 0},
      priority      = ${parseInt(formData.get("priority") as string) || 0},
      completed     = ${formData.get("completed") === "true"}
    where id = ${formData.get("id") as string} and user_id = ${userId}
  `;

  revalidatePath("/objectives");
  revalidatePath("/dashboard");
}

export async function deleteObjective(id: string) {
  const userId = await requireUserId();

  await sql`delete from objectives where id = ${id} and user_id = ${userId}`;

  revalidatePath("/objectives");
  revalidatePath("/dashboard");
}

export async function toggleObjectiveComplete(id: string, completed: boolean) {
  const userId = await requireUserId();

  await sql`
    update objectives set completed = ${completed}
    where id = ${id} and user_id = ${userId}
  `;

  revalidatePath("/objectives");
  revalidatePath("/dashboard");
}
