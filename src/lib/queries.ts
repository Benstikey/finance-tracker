import "server-only";
import { sql } from "@/lib/db";
import type {
  AccountWithCurrency,
  CashFlowWithCurrency,
  Currency,
  LoanWithCurrency,
  ObjectiveWithCurrency,
  Transaction,
} from "@/lib/types/database";

/**
 * Read queries. Every one that touches user data takes a userId and filters on
 * it — that filter is what replaces the Row Level Security policies the
 * Supabase schema used to enforce.
 *
 * Two casting rules apply throughout, so the shapes match what the UI already
 * expects from the PostgREST era:
 *   - `numeric` -> `::float8`, otherwise the driver returns strings.
 *   - `date`/`timestamptz` -> `::text`, because the UI does string comparisons
 *     and `new Date(value + "T00:00:00")`.
 */

export async function getCurrencies(): Promise<Currency[]> {
  return (await sql`
    select id, code, name, symbol, created_at::text as created_at
    from currencies
    order by code asc
  `) as Currency[];
}

export async function getAccounts(
  userId: string,
  orderBy: "type" | "name" = "type"
): Promise<AccountWithCurrency[]> {
  const rows =
    orderBy === "name"
      ? await sql`
          select a.id, a.user_id, a.name, a.type, a.currency_id,
                 a.balance::float8 as balance, a.icon, a.notes,
                 a.created_at::text as created_at, a.updated_at::text as updated_at,
                 json_build_object('id', c.id, 'code', c.code, 'name', c.name,
                   'symbol', c.symbol, 'created_at', c.created_at::text) as currencies
          from accounts a join currencies c on c.id = a.currency_id
          where a.user_id = ${userId}
          order by a.name asc
        `
      : await sql`
          select a.id, a.user_id, a.name, a.type, a.currency_id,
                 a.balance::float8 as balance, a.icon, a.notes,
                 a.created_at::text as created_at, a.updated_at::text as updated_at,
                 json_build_object('id', c.id, 'code', c.code, 'name', c.name,
                   'symbol', c.symbol, 'created_at', c.created_at::text) as currencies
          from accounts a join currencies c on c.id = a.currency_id
          where a.user_id = ${userId}
          order by a.type asc
        `;
  return rows as AccountWithCurrency[];
}

export async function getTransactions(
  userId: string,
  order: "asc" | "desc" = "desc"
): Promise<Transaction[]> {
  const rows =
    order === "asc"
      ? await sql`
          select id, user_id, account_id, amount::float8 as amount, description,
                 date::text as date, created_at::text as created_at
          from transactions
          where user_id = ${userId}
          order by date asc
        `
      : await sql`
          select id, user_id, account_id, amount::float8 as amount, description,
                 date::text as date, created_at::text as created_at
          from transactions
          where user_id = ${userId}
          order by date desc
        `;
  return rows as Transaction[];
}

export async function getObjectives(
  userId: string
): Promise<ObjectiveWithCurrency[]> {
  return (await sql`
    select o.id, o.user_id, o.name,
           o.target_amount::float8 as target_amount, o.currency_id,
           o.current_saved::float8 as current_saved, o.priority, o.completed,
           o.created_at::text as created_at,
           json_build_object('id', c.id, 'code', c.code, 'name', c.name,
             'symbol', c.symbol, 'created_at', c.created_at::text) as currencies
    from objectives o join currencies c on c.id = o.currency_id
    where o.user_id = ${userId}
    order by o.priority asc
  `) as ObjectiveWithCurrency[];
}

export async function getLoans(
  userId: string,
  opts: { unsettledOnly?: boolean } = {}
): Promise<LoanWithCurrency[]> {
  const rows = opts.unsettledOnly
    ? await sql`
        select l.id, l.user_id, l.person, l.description,
               l.amount::float8 as amount, l.currency_id, l.direction, l.settled,
               l.created_at::text as created_at, l.updated_at::text as updated_at,
               json_build_object('id', c.id, 'code', c.code, 'name', c.name,
                 'symbol', c.symbol, 'created_at', c.created_at::text) as currencies
        from loans l join currencies c on c.id = l.currency_id
        where l.user_id = ${userId} and l.settled = false
        order by l.created_at desc
      `
    : await sql`
        select l.id, l.user_id, l.person, l.description,
               l.amount::float8 as amount, l.currency_id, l.direction, l.settled,
               l.created_at::text as created_at, l.updated_at::text as updated_at,
               json_build_object('id', c.id, 'code', c.code, 'name', c.name,
                 'symbol', c.symbol, 'created_at', c.created_at::text) as currencies
        from loans l join currencies c on c.id = l.currency_id
        where l.user_id = ${userId}
        order by l.settled asc, l.created_at desc
      `;
  return rows as LoanWithCurrency[];
}

export async function getCashFlows(
  userId: string
): Promise<CashFlowWithCurrency[]> {
  return (await sql`
    select f.id, f.user_id, f.name, f.amount::float8 as amount, f.currency_id,
           f.type, f.frequency,
           f.start_date::text as start_date, f.end_date::text as end_date,
           f.day_of_month, f.notes, f.active, f.created_at::text as created_at,
           json_build_object('id', c.id, 'code', c.code, 'name', c.name,
             'symbol', c.symbol, 'created_at', c.created_at::text) as currencies
    from cash_flows f join currencies c on c.id = f.currency_id
    where f.user_id = ${userId}
    order by f.type asc, f.created_at desc
  `) as CashFlowWithCurrency[];
}
