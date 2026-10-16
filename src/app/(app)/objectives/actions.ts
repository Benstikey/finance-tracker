"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { requireUserId } from "@/lib/dal";

function optionalNumber(value: FormDataEntryValue | null): number | null {
  const n = parseFloat(value as string);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function optionalDate(value: FormDataEntryValue | null): string | null {
  return /^\d{4}-\d{2}-\d{2}$/.test((value as string) ?? "") ? (value as string) : null;
}

export async function createObjective(formData: FormData) {
  const userId = await requireUserId();

  await sql`
    insert into objectives (user_id, name, target_amount, currency_id, current_saved,
                            priority, monthly_contribution, target_date)
    values (
      ${userId},
      ${formData.get("name") as string},
      ${parseFloat(formData.get("target_amount") as string)},
      ${formData.get("currency_id") as string},
      ${parseFloat(formData.get("current_saved") as string) || 0},
      ${parseInt(formData.get("priority") as string) || 0},
      ${optionalNumber(formData.get("monthly_contribution"))},
      ${optionalDate(formData.get("target_date"))}::date
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
      completed     = ${formData.get("completed") === "true"},
      monthly_contribution = ${optionalNumber(formData.get("monthly_contribution"))},
      target_date   = ${optionalDate(formData.get("target_date"))}::date
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
