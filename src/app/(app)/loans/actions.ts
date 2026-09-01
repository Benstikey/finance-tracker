"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { requireUserId } from "@/lib/dal";

export async function createLoan(formData: FormData) {
  const userId = await requireUserId();

  await sql`
    insert into loans (user_id, person, description, amount, currency_id, direction)
    values (
      ${userId},
      ${formData.get("person") as string},
      ${(formData.get("description") as string) || null},
      ${parseFloat(formData.get("amount") as string)},
      ${formData.get("currency_id") as string},
      ${formData.get("direction") as string}
    )
  `;

  revalidatePath("/loans");
  revalidatePath("/dashboard");
}

export async function updateLoan(formData: FormData) {
  const userId = await requireUserId();

  await sql`
    update loans set
      person      = ${formData.get("person") as string},
      description = ${(formData.get("description") as string) || null},
      amount      = ${parseFloat(formData.get("amount") as string)},
      currency_id = ${formData.get("currency_id") as string},
      direction   = ${formData.get("direction") as string}
    where id = ${formData.get("id") as string} and user_id = ${userId}
  `;

  revalidatePath("/loans");
  revalidatePath("/dashboard");
}

export async function deleteLoan(id: string) {
  const userId = await requireUserId();

  await sql`delete from loans where id = ${id} and user_id = ${userId}`;

  revalidatePath("/loans");
  revalidatePath("/dashboard");
}

export async function toggleLoanSettled(id: string, settled: boolean) {
  const userId = await requireUserId();

  await sql`
    update loans set settled = ${settled}
    where id = ${id} and user_id = ${userId}
  `;

  revalidatePath("/loans");
  revalidatePath("/dashboard");
}
