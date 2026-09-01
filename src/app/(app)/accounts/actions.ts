"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { requireUserId } from "@/lib/dal";

export async function createAccount(formData: FormData) {
  const userId = await requireUserId();

  await sql`
    insert into accounts (user_id, name, type, currency_id, balance, icon, notes)
    values (
      ${userId},
      ${formData.get("name") as string},
      ${formData.get("type") as string},
      ${formData.get("currency_id") as string},
      ${parseFloat(formData.get("balance") as string) || 0},
      ${(formData.get("icon") as string) || null},
      ${(formData.get("notes") as string) || null}
    )
  `;

  revalidatePath("/accounts");
  revalidatePath("/dashboard");
}

export async function updateAccount(formData: FormData) {
  const userId = await requireUserId();

  await sql`
    update accounts set
      name        = ${formData.get("name") as string},
      type        = ${formData.get("type") as string},
      currency_id = ${formData.get("currency_id") as string},
      balance     = ${parseFloat(formData.get("balance") as string) || 0},
      icon        = ${(formData.get("icon") as string) || null},
      notes       = ${(formData.get("notes") as string) || null}
    where id = ${formData.get("id") as string} and user_id = ${userId}
  `;

  revalidatePath("/accounts");
  revalidatePath("/dashboard");
}

export async function deleteAccount(id: string) {
  const userId = await requireUserId();

  await sql`delete from accounts where id = ${id} and user_id = ${userId}`;

  revalidatePath("/accounts");
  revalidatePath("/dashboard");
}
