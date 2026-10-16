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
 * Moves money between two of the user's accounts. `amount` leaves the source
 * account in its currency; `received` arrives in the destination's currency
 * (they differ when the currencies do, or when there's a fee). Both legs share
 * a transfer_id and are written with both balance updates in one statement.
 */
export async function addTransfer(formData: FormData) {
  const userId = await requireUserId();

  const fromId = formData.get("from_account_id") as string;
  const toId = formData.get("to_account_id") as string;
  const amount = Math.abs(parseFloat(formData.get("amount") as string) || 0);
  const received = Math.abs(
    parseFloat(formData.get("received") as string) || amount
  );
  const description = (formData.get("description") as string) || null;
  const date =
    (formData.get("date") as string) ||
    new Date().toISOString().split("T")[0];

  if (!fromId || !toId || fromId === toId) {
    throw new Error("Pick two different accounts.");
  }
  if (amount <= 0) throw new Error("Enter an amount greater than zero.");

  const transferId = crypto.randomUUID();

  // Inserts nothing unless both accounts belong to this user.
  await sql`
    with legs as (
      insert into transactions (user_id, account_id, amount, description, date, transfer_id)
      select ${userId}, v.account_id, v.amount, ${description}, ${date}::date, ${transferId}
      from (values (${fromId}::uuid, ${-amount}::numeric),
                   (${toId}::uuid, ${received}::numeric)) as v(account_id, amount)
      where (
        select count(*) from accounts
        where user_id = ${userId} and id in (${fromId}::uuid, ${toId}::uuid)
      ) = 2
      returning account_id, amount
    )
    update accounts a
    set balance = a.balance + l.amount
    from legs l
    where a.id = l.account_id and a.user_id = ${userId}
  `;

  revalidate();
}

/**
 * `accountId` and `amount` are accepted for call-site compatibility but are
 * deliberately not trusted — the reversal uses the amount stored on the row,
 * so a tampered client can't shift a balance by an arbitrary figure.
 * Deleting either leg of a transfer deletes both and reverses both balances.
 */
export async function deleteTransaction(
  id: string,
  _accountId: string,
  _amount: number
) {
  const userId = await requireUserId();

  await sql`
    with target as (
      select transfer_id from transactions
      where id = ${id} and user_id = ${userId}
    ),
    deleted as (
      delete from transactions t
      where t.user_id = ${userId}
        and (
          t.id = ${id}
          or (t.transfer_id is not null
              and t.transfer_id = (select transfer_id from target))
        )
      returning account_id, amount
    )
    update accounts a
    set balance = a.balance - d.amount
    from deleted d
    where a.id = d.account_id and a.user_id = ${userId}
  `;

  revalidate();
}
