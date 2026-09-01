"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { requireUserId } from "@/lib/dal";

/** day_of_month only applies to monthly flows. */
function dayOfMonth(formData: FormData, frequency: string): number | null {
  if (frequency !== "monthly") return null;
  return parseInt(formData.get("day_of_month") as string) || null;
}

export async function createCashFlow(formData: FormData) {
  const userId = await requireUserId();
  const frequency = formData.get("frequency") as string;

  await sql`
    insert into cash_flows
      (user_id, name, amount, currency_id, type, frequency,
       start_date, end_date, day_of_month, notes)
    values (
      ${userId},
      ${formData.get("name") as string},
      ${parseFloat(formData.get("amount") as string)},
      ${formData.get("currency_id") as string},
      ${formData.get("type") as string},
      ${frequency},
      ${formData.get("start_date") as string},
      ${(formData.get("end_date") as string) || null},
      ${dayOfMonth(formData, frequency)},
      ${(formData.get("notes") as string) || null}
    )
  `;

  revalidatePath("/cash-flow");
  revalidatePath("/dashboard");
}

export async function updateCashFlow(formData: FormData) {
  const userId = await requireUserId();
  const frequency = formData.get("frequency") as string;

  await sql`
    update cash_flows set
      name         = ${formData.get("name") as string},
      amount       = ${parseFloat(formData.get("amount") as string)},
      currency_id  = ${formData.get("currency_id") as string},
      type         = ${formData.get("type") as string},
      frequency    = ${frequency},
      start_date   = ${formData.get("start_date") as string},
      end_date     = ${(formData.get("end_date") as string) || null},
      day_of_month = ${dayOfMonth(formData, frequency)},
      notes        = ${(formData.get("notes") as string) || null}
    where id = ${formData.get("id") as string} and user_id = ${userId}
  `;

  revalidatePath("/cash-flow");
  revalidatePath("/dashboard");
}

export async function deleteCashFlow(id: string) {
  const userId = await requireUserId();

  await sql`delete from cash_flows where id = ${id} and user_id = ${userId}`;

  revalidatePath("/cash-flow");
  revalidatePath("/dashboard");
}

export async function toggleCashFlowActive(id: string, active: boolean) {
  const userId = await requireUserId();

  await sql`
    update cash_flows set active = ${active}
    where id = ${id} and user_id = ${userId}
  `;

  revalidatePath("/cash-flow");
  revalidatePath("/dashboard");
}
