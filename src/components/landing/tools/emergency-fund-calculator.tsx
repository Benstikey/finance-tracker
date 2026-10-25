"use client";

import { useState } from "react";

const SYMBOLS = ["USD", "EUR", "GBP", "CAD", "AUD", "CHF"];
const COVER = [3, 6, 9, 12];

function num(v: string) {
  const n = parseFloat(v.replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function EmergencyFundCalculator() {
  const [currency, setCurrency] = useState("USD");
  const [expenses, setExpenses] = useState("2800");
  const [months, setMonths] = useState(6);
  const [saved, setSaved] = useState("5000");
  const [monthly, setMonthly] = useState("400");

  const fmt = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(
      Math.ceil(v)
    );

  const target = num(expenses) * months;
  const have = num(saved);
  const gap = Math.max(target - have, 0);
  const perMonth = num(monthly);
  const monthsToGo = gap > 0 && perMonth > 0 ? Math.ceil(gap / perMonth) : 0;
  const covered = num(expenses) > 0 ? have / num(expenses) : 0;
  const progress = target > 0 ? Math.min((have / target) * 100, 100) : 0;

  return (
    <div className="grid gap-3.5 min-[761px]:grid-cols-[minmax(0,1fr)_320px]">
      <div className="lp-tile !p-5 grid grid-cols-2 gap-4">
        <label className="lp-field col-span-2 sm:col-span-1">
          Essential monthly expenses
          <input className="lp-input" inputMode="decimal" value={expenses} onChange={(e) => setExpenses(e.target.value)} />
        </label>
        <label className="lp-field col-span-2 sm:col-span-1">
          Currency
          <select className="lp-input" value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {SYMBOLS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <fieldset className="col-span-2">
          <legend className="pb-1.5 text-[13px] font-medium">Months of cover</legend>
          <div role="group" className="flex w-fit rounded-[10px] bg-[#0000000a] p-0.5">
            {COVER.map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={m === months}
                onClick={() => setMonths(m)}
                className="h-8 rounded-[8px] px-4 text-[13px] font-medium text-[#737373] transition-[background-color,color,box-shadow] duration-150 hover:text-[#0a0a0a] aria-pressed:bg-white aria-pressed:text-[#0a0a0a] aria-pressed:shadow-[0_0_0_1px_#0a0a0a0e,0_1px_2px_#0000000d]"
              >
                {m}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="lp-field col-span-2 sm:col-span-1">
          Already set aside
          <input className="lp-input" inputMode="decimal" value={saved} onChange={(e) => setSaved(e.target.value)} />
        </label>
        <label className="lp-field col-span-2 sm:col-span-1">
          You can add per month
          <input className="lp-input" inputMode="decimal" value={monthly} placeholder="Optional" onChange={(e) => setMonthly(e.target.value)} />
        </label>
      </div>

      <div className="lp-tile !p-5 flex flex-col gap-4" aria-live="polite">
        <dl className="grid grid-cols-2 gap-x-3 gap-y-4">
          <div className="lp-stat col-span-2">
            <dt>Your emergency fund target</dt>
            <dd className="!text-[30px]">{fmt(target)}</dd>
          </div>
          <div className="lp-stat">
            <dt>Still to save</dt>
            <dd className="!text-[17px]">{fmt(gap)}</dd>
          </div>
          <div className="lp-stat">
            <dt>Covered today</dt>
            <dd className="!text-[17px]">{covered.toFixed(1)} months</dd>
          </div>
        </dl>
        <span className="block h-1.5 rounded-full bg-[#0000000a]">
          <span className="block h-1.5 rounded-full bg-[#0a0a0a]" style={{ width: `${progress}%` }} />
        </span>
        <p className="text-[14px] leading-[21px] text-[#595959]">
          {gap === 0
            ? "You're fully covered. Keep it somewhere safe and easy to reach."
            : monthsToGo > 0
              ? `At ${fmt(perMonth)} a month, you'll be fully covered in ${monthsToGo} month${monthsToGo === 1 ? "" : "s"}.`
              : "Add a monthly amount to see when you'll be fully covered."}
        </p>
      </div>
    </div>
  );
}
