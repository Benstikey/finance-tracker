"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { requireUserId } from "@/lib/dal";

/** Sets the currency totals are shown in. Only known currency codes are accepted. */
export async function setDisplayCurrency(code: string) {
  const userId = await requireUserId();

  await sql`
    update users set display_currency = c.code
    from currencies c
    where users.id = ${userId} and c.code = ${code}
  `;

  revalidatePath("/", "layout");
}
