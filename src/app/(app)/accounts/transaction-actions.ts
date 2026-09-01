"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { requireUserId } from "@/lib/dal";

function revalidate() {
  revalidatePath("/accounts");
  revalidatePath("/dashboard");
  revalidatePath("/net-worth");
}

export async function addTransaction(formData: FormData) {
  const userId = await requireUserId();

  const accountId = formData.get("account_id") as string;
  const rawAmount = parseFloat(formData.get("amount") as string) || 0;
  const type = formData.get("type") as "deposit" | "withdrawal";
  const amount =
    type === "withdrawal" ? -Math.abs(rawAmount) : Math.abs(rawAmount);
  const description = (formData.get("description") as string) || null;
  const date =
    (formData.get("date") as string) ||
    new Date().toISOString().split("T")[0];

  // Insert and adjust the balance in one statement, so the two can't drift
  // apart if the request fails midway. The `where exists` guard means an
  // account id belonging to someone else inserts nothing at all, and
  // `balance + amount` is computed by Postgres rather than read-modify-written
  // by the app, so concurrent transactions can't clobber each other.
  await sql`
    with inserted as (
      insert into transactions (user_id, account_id, amount, description, date)
      select ${userId}, ${accountId}, ${amount}, ${description}, ${date}::date
      where exists (
        select 1 from accounts where id = ${accountId} and user_id = ${userId}
      )
      returning account_id, amount
    )
    update accounts a
    set balance = a.balance + i.amount
    from inserted i
    where a.id = i.account_id and a.user_id = ${userId}
  `;

  revalidate();
}

/**
 * `accountId` and `amount` are accepted for call-site compatibility but are
 * deliberately not trusted — the reversal uses the amount stored on the row,
 * so a tampered client can't shift a balance by an arbitrary figure.
 */
export async function deleteTransaction(
  id: string,
  _accountId: string,
  _amount: number
) {
  const userId = await requireUserId();

  await sql`
    with deleted as (
      delete from transactions
      where id = ${id} and user_id = ${userId}
      returning account_id, amount
    )
    update accounts a
    set balance = a.balance - d.amount
    from deleted d
    where a.id = d.account_id and a.user_id = ${userId}
  `;

  revalidate();
}
