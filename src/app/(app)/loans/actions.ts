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

function revalidateLoans() {
  revalidatePath("/loans");
  revalidatePath("/dashboard");
}

/**
 * Records a part-payment. When repayments reach the loan amount the loan is
 * marked settled. The insert's own amount is added explicitly because the
 * update can't see rows inserted by the same statement.
 */
export async function addRepayment(formData: FormData) {
  const userId = await requireUserId();

  const loanId = formData.get("loan_id") as string;
  const amount = Math.abs(parseFloat(formData.get("amount") as string) || 0);
  const note = (formData.get("note") as string) || null;
  const date =
    (formData.get("date") as string) ||
    new Date().toISOString().split("T")[0];
  if (amount <= 0) throw new Error("Enter an amount greater than zero.");

  await sql`
    with inserted as (
      insert into loan_repayments (user_id, loan_id, amount, date, note)
      select ${userId}, ${loanId}, ${amount}, ${date}::date, ${note}
      where exists (
        select 1 from loans where id = ${loanId} and user_id = ${userId}
      )
      returning loan_id, amount
    )
    update loans l
    set settled = coalesce(l.settled, false) or (
      coalesce((select sum(r.amount) from loan_repayments r where r.loan_id = l.id), 0)
        + i.amount >= l.amount
    )
    from inserted i
    where l.id = i.loan_id and l.user_id = ${userId}
  `;

  revalidateLoans();
}

/** Removes a repayment; the loan is reopened if it's no longer fully repaid. */
export async function deleteRepayment(id: string) {
  const userId = await requireUserId();

  await sql`
    with deleted as (
      delete from loan_repayments
      where id = ${id} and user_id = ${userId}
      returning loan_id, amount
    )
    update loans l
    set settled = coalesce(l.settled, false) and (
      coalesce((select sum(r.amount) from loan_repayments r where r.loan_id = l.id), 0)
        - d.amount >= l.amount
    )
    from deleted d
    where l.id = d.loan_id and l.user_id = ${userId}
  `;

  revalidateLoans();
}
