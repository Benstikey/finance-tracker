/**
 * Goal projections: when an objective will be reached at its monthly
 * contribution, and what it would take to reach it by its target date.
 * Pure date maths on YYYY-MM-DD strings, so it behaves the same on the server
 * and in the browser.
 */

export type Projection =
  | { status: "done" }
  | { status: "no-plan" }
  | {
      status: "on-track" | "behind" | "projected";
      /** Month the goal is reached at the current contribution (YYYY-MM-01). */
      eta: string;
      monthsToGo: number;
      /** Months between the projected date and the target date (behind only). */
      monthsLate?: number;
      /** Monthly amount that would reach the target date exactly. */
      neededPerMonth?: number;
    }
  | { status: "needs-plan"; neededPerMonth: number; monthsLeft: number }
  | { status: "overdue"; remaining: number };

function monthIndex(day: string): number {
  const [y, m] = day.split("-").map(Number);
  return y * 12 + (m - 1);
}

function fromMonthIndex(i: number): string {
  const y = Math.floor(i / 12);
  const m = (i % 12) + 1;
  return `${y}-${String(m).padStart(2, "0")}-01`;
}

/** Whole months from `today` until `target`, counting the target month. */
function monthsUntil(today: string, target: string): number {
  return monthIndex(target) - monthIndex(today);
}

export function projectObjective(
  {
    target_amount,
    current_saved,
    monthly_contribution,
    target_date,
  }: {
    target_amount: number;
    current_saved: number;
    monthly_contribution: number | null;
    target_date: string | null;
  },
  today: string = new Date().toISOString().slice(0, 10)
): Projection {
  const remaining = target_amount - current_saved;
  if (remaining <= 0) return { status: "done" };

  const monthly = monthly_contribution && monthly_contribution > 0 ? monthly_contribution : null;
  const monthsLeft = target_date ? monthsUntil(today, target_date) : null;
  const neededPerMonth =
    monthsLeft !== null && monthsLeft > 0 ? remaining / monthsLeft : undefined;

  if (!monthly) {
    if (monthsLeft === null) return { status: "no-plan" };
    if (monthsLeft <= 0) return { status: "overdue", remaining };
    return { status: "needs-plan", neededPerMonth: neededPerMonth!, monthsLeft };
  }

  const monthsToGo = Math.ceil(remaining / monthly);
  const eta = fromMonthIndex(monthIndex(today) + monthsToGo);

  if (monthsLeft === null) return { status: "projected", eta, monthsToGo };

  const monthsLate = monthsToGo - monthsLeft;
  return monthsLate <= 0
    ? { status: "on-track", eta, monthsToGo, neededPerMonth }
    : { status: "behind", eta, monthsToGo, monthsLate, neededPerMonth };
}

export function formatMonth(day: string): string {
  return new Date(day + "T00:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
