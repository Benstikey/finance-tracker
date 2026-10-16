import "server-only";
import { convertCurrency, type ExchangeRates } from "@/lib/exchange-rates";
import type {
  AccountWithCurrency,
  LoanWithCurrency,
  Transaction,
} from "@/lib/types/database";

// Two years of daily history: enough for a 1Y range plus its previous period.
export const HISTORY_DAYS = 730;

function isoDay(d: Date): string {
  return d.toISOString().split("T")[0];
}

/** Every day from HISTORY_DAYS ago through today (UTC), as YYYY-MM-DD. */
export function historyDays(): string[] {
  const end = new Date(isoDay(new Date()) + "T00:00:00Z");
  const d = new Date(end);
  d.setUTCDate(d.getUTCDate() - HISTORY_DAYS);
  const days: string[] = [];
  for (; d <= end; d.setUTCDate(d.getUTCDate() + 1)) days.push(isoDay(d));
  return days;
}

/**
 * Daily balance per account in MAD, at today's exchange rates.
 * Balance at day D = current balance - sum(transactions dated after D).
 */
export function accountBalanceHistory(
  days: string[],
  accounts: AccountWithCurrency[],
  transactions: Transaction[],
  rates: ExchangeRates
): Record<string, number>[] {
  const first = days[0];
  const running: Record<string, number> = {};
  const deltas = new Map<string, Map<string, number>>();

  for (const a of accounts) running[a.id] = a.balance;
  for (const tx of transactions) {
    if (!(tx.account_id in running) || tx.date < first) continue;
    running[tx.account_id] -= tx.amount;
    const byAccount = deltas.get(tx.date) ?? new Map<string, number>();
    byAccount.set(tx.account_id, (byAccount.get(tx.account_id) ?? 0) + tx.amount);
    deltas.set(tx.date, byAccount);
  }

  return days.map((day) => {
    for (const [id, amount] of deltas.get(day) ?? []) running[id] += amount;
    const row: Record<string, number> = {};
    for (const a of accounts) {
      row[a.id] = Math.round(
        convertCurrency(running[a.id], a.currencies.code, "MAD", rates)
      );
    }
    return row;
  });
}

/**
 * Outstanding amount of a loan at the end of `day`, in its own currency.
 * A loan counts from its creation; repayments reduce it on their dates; once
 * settled it drops to zero. There is no settled_at column, so updated_at
 * stands in for the settlement date.
 */
function outstandingOn(loan: LoanWithCurrency, day: string): number {
  if (loan.created_at.slice(0, 10) > day) return 0;
  if (loan.settled && loan.updated_at.slice(0, 10) <= day) return 0;
  const repaid = loan.repayments
    .filter((r) => r.date <= day)
    .reduce((s, r) => s + r.amount, 0);
  return Math.max(loan.amount - repaid, 0);
}

/** Daily outstanding loan totals in MAD. */
export function loanHistory(
  days: string[],
  loans: LoanWithCurrency[],
  rates: ExchangeRates
): { lent: number; borrowed: number }[] {
  return days.map((day) => {
    let lent = 0;
    let borrowed = 0;
    for (const l of loans) {
      const mad = convertCurrency(outstandingOn(l, day), l.currencies.code, "MAD", rates);
      if (l.direction === "lent") lent += mad;
      else borrowed += mad;
    }
    return { lent: Math.round(lent), borrowed: Math.round(borrowed) };
  });
}

/** Daily outstanding loans in MAD per person, split by direction. */
export function loanHistoryByPerson(
  days: string[],
  loans: LoanWithCurrency[],
  rates: ExchangeRates
): Record<"lent" | "borrowed", Record<string, number[]>> {
  const out: Record<"lent" | "borrowed", Record<string, number[]>> = {
    lent: {},
    borrowed: {},
  };
  for (const l of loans) {
    const series = (out[l.direction][l.person] ??= days.map(() => 0));
    days.forEach((day, i) => {
      series[i] += convertCurrency(outstandingOn(l, day), l.currencies.code, "MAD", rates);
    });
  }
  for (const byPerson of Object.values(out)) {
    for (const series of Object.values(byPerson)) {
      series.forEach((v, i) => (series[i] = Math.round(v)));
    }
  }
  return out;
}

/**
 * Net money moved per account per day (deposits minus withdrawals), in MAD.
 * Transfers between accounts are left out: they aren't income or spending.
 */
export function transactionFlowHistory(
  days: string[],
  accounts: AccountWithCurrency[],
  transactions: Transaction[],
  rates: ExchangeRates
): Record<string, number[]> {
  const index = new Map(days.map((d, i) => [d, i]));
  const out: Record<string, number[]> = {};
  for (const a of accounts) out[a.id] = days.map(() => 0);
  const codes = new Map(accounts.map((a) => [a.id, a.currencies.code]));
  for (const tx of transactions) {
    const i = index.get(tx.date);
    const code = codes.get(tx.account_id);
    if (i === undefined || !code || tx.transfer_id) continue;
    out[tx.account_id][i] += convertCurrency(tx.amount, code, "MAD", rates);
  }
  for (const series of Object.values(out)) {
    series.forEach((v, i) => (series[i] = Math.round(v)));
  }
  return out;
}
