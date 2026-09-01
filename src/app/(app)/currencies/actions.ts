"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { requireUserId } from "@/lib/dal";

export async function createCurrency(formData: FormData) {
  // Currencies are shared across users, but only signed-in users may add one —
  // the same rule the old "authenticated" RLS policy enforced.
  await requireUserId();

  await sql`
    insert into currencies (code, name, symbol)
    values (
      ${(formData.get("code") as string).toUpperCase()},
      ${formData.get("name") as string},
      ${formData.get("symbol") as string}
    )
  `;

  revalidatePath("/currencies");
  revalidatePath("/accounts");
  revalidatePath("/objectives");
}
