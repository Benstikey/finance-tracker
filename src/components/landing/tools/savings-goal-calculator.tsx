"use client";

import { useState } from "react";
import { formatMonth, projectObjective } from "@/lib/projection";

const SYMBOLS = ["USD", "EUR", "GBP", "CAD", "AUD", "CHF"];

function num(v: string) {
  const n = parseFloat(v.replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function SavingsGoalCalculator() {
  const [currency, setCurrency] = useState("USD");
  const [target, setTarget] = useState("15000");
  const [saved, setSaved] = useState("4000");
  const [monthly, setMonthly] = useState("600");
  const [date, setDate] = useState("");

  const fmt = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(
      Math.ceil(v)
    );

  const t = num(target);
  const s = num(saved);
  const p = projectObjective({
    target_amount: t,
    current_saved: s,
    monthly_contribution: num(monthly) || null,
    target_date: date || null,
  });
  const progress = t > 0 ? Math.min((s / t) * 100, 100) : 0;

  let headline: string;
  let detail: string;
  switch (p.status) {
    case "done":
      headline = "Goal reached";
      detail = "You've already saved enough. Time for the next one.";
      break;
    case "no-plan":
      headline = "Add a monthly amount or a date";
      detail = "Either one is enough to work out the rest.";
      break;
    case "projected":
      headline = formatMonth(p.eta);
      detail = `At ${fmt(num(monthly))} a month, you'll get there in ${p.monthsToGo} month${p.monthsToGo === 1 ? "" : "s"}.`;
      break;
    case "on-track":
      headline = `On track for ${formatMonth(p.eta)}`;
      detail = `That's before your date. ${fmt(p.neededPerMonth!)} a month would be enough.`;
      break;
    case "behind":
      headline = `${p.monthsLate} month${p.monthsLate === 1 ? "" : "s"} behind`;
      detail = `You'd reach it in ${formatMonth(p.eta)}. To hit your date, save ${fmt(p.neededPerMonth!)} a month.`;
      break;
    case "needs-plan":
      headline = `${fmt(p.neededPerMonth)} a month`;
      detail = `That's what it takes to reach your goal in ${p.monthsLeft} month${p.monthsLeft === 1 ? "" : "s"}.`;
      break;
    case "overdue":
      headline = "Your date has passed";
      detail = `${fmt(p.remaining)} still to go. Pick a new date or add a monthly amount.`;
      break;
  }

  return (
    <div className="grid gap-3.5 min-[761px]:grid-cols-[minmax(0,1fr)_320px]">
      <div className="lp-tile !p-5 grid grid-cols-2 gap-4">
        <label className="lp-field col-span-2 sm:col-span-1">
          Goal amount
          <input className="lp-input" inputMode="decimal" value={target} onChange={(e) => setTarget(e.target.value)} />
        </label>
        <label className="lp-field col-span-2 sm:col-span-1">
          Currency
          <select className="lp-input" value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {SYMBOLS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="lp-field col-span-2">
          Already saved
          <input className="lp-input" inputMode="decimal" value={saved} onChange={(e) => setSaved(e.target.value)} />
        </label>
        <label className="lp-field col-span-2 sm:col-span-1">
          You can save per month
          <input
            className="lp-input"
            inputMode="decimal"
            value={monthly}
            placeholder="Optional"
            onChange={(e) => setMonthly(e.target.value)}
          />
        </label>
        <label className="lp-field col-span-2 sm:col-span-1">
          Reach it by
          <input className="lp-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
      </div>

      <div className="lp-tile !p-5 flex flex-col gap-4" aria-live="polite">
        <div>
          <p className="text-[12px] font-medium text-[#737373]">Result</p>
          <p className="pt-1 text-[26px] leading-[32px] font-semibold tracking-[-0.6px]">{headline}</p>
          <p className="pt-2 text-[14px] leading-[21px] text-[#595959]">{detail}</p>
        </div>
        <div>
          <span className="flex justify-between text-[12px] text-[#737373] tabular-nums">
            <span>{fmt(s)} saved</span>
            <span>{progress.toFixed(0)}%</span>
          </span>
          <span className="mt-1.5 block h-1.5 rounded-full bg-[#0000000a]">
            <span className="block h-1.5 rounded-full bg-[#0a0a0a]" style={{ width: `${progress}%` }} />
          </span>
          <p className="pt-2 text-[12px] text-[#737373] tabular-nums">
            {fmt(Math.max(t - s, 0))} to go of {fmt(t)}
          </p>
        </div>
      </div>
    </div>
  );
}
