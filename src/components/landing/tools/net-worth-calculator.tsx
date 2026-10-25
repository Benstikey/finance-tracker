"use client";

import { useId, useState } from "react";
import { Plus, X } from "lucide-react";

type Row = { id: number; label: string; amount: string; currency: string };

let nextId = 100;

const START_ASSETS: Row[] = [
  { id: 1, label: "Checking account", amount: "8400", currency: "USD" },
  { id: 2, label: "Savings account", amount: "21500", currency: "USD" },
  { id: 3, label: "Euro account", amount: "6200", currency: "EUR" },
  { id: 4, label: "Money a friend owes me", amount: "450", currency: "USD" },
];
const START_LIABILITIES: Row[] = [
  { id: 5, label: "Credit card", amount: "1250", currency: "USD" },
  { id: 6, label: "Car loan", amount: "9800", currency: "USD" },
];

function toNumber(v: string) {
  const n = parseFloat(v.replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function RowsEditor({
  title,
  rows,
  setRows,
  currencies,
  placeholder,
}: {
  title: string;
  rows: Row[];
  setRows: (rows: Row[]) => void;
  currencies: string[];
  placeholder: string;
}) {
  const id = useId();
  const update = (rowId: number, patch: Partial<Row>) =>
    setRows(rows.map((r) => (r.id === rowId ? { ...r, ...patch } : r)));

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="pb-2 text-[13px] font-medium">{title}</legend>
      {rows.map((r, i) => (
        // On phones the name gets its own row; from sm up it's one line.
        <div
          key={r.id}
          className="grid grid-cols-[minmax(0,1fr)_76px_38px] gap-1.5 sm:grid-cols-[minmax(0,1fr)_110px_76px_38px]"
        >
          <input
            aria-label={`${title} ${i + 1} name`}
            className="lp-input col-span-3 sm:col-span-1"
            value={r.label}
            placeholder={placeholder}
            onChange={(e) => update(r.id, { label: e.target.value })}
          />
          <input
            aria-label={`${title} ${i + 1} amount`}
            className="lp-input text-right"
            inputMode="decimal"
            value={r.amount}
            placeholder="0"
            onChange={(e) => update(r.id, { amount: e.target.value })}
          />
          <select
            aria-label={`${title} ${i + 1} currency`}
            className="lp-input !px-2"
            value={r.currency}
            onChange={(e) => update(r.id, { currency: e.target.value })}
          >
            {currencies.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <button
            type="button"
            aria-label={`Remove ${r.label || `${title} ${i + 1}`}`}
            className="grid size-[38px] place-items-center rounded-[10px] text-[#737373] transition-[background-color,color] duration-150 hover:bg-[#0000000a] hover:text-[#0a0a0a]"
            onClick={() => setRows(rows.filter((x) => x.id !== r.id))}
          >
            <X size={15} strokeWidth={1.75} />
          </button>
        </div>
      ))}
      <button
        type="button"
        id={`${id}-add`}
        className="lp-btn lp-btn--sm lp-btn--secondary mt-1 w-fit"
        onClick={() =>
          setRows([...rows, { id: nextId++, label: "", amount: "", currency: rows.at(-1)?.currency ?? "USD" }])
        }
      >
        <Plus size={14} strokeWidth={2} /> Add a line
      </button>
    </fieldset>
  );
}

export function NetWorthCalculator({
  rates,
  currencies,
}: {
  /** Units of each currency per 1 USD. */
  rates: Record<string, number>;
  currencies: string[];
}) {
  const [assets, setAssets] = useState(START_ASSETS);
  const [liabilities, setLiabilities] = useState(START_LIABILITIES);
  const [display, setDisplay] = useState("USD");

  const convert = (amount: number, from: string) =>
    (amount / (rates[from] || 1)) * (rates[display] || 1);

  const totals = (() => {
    const own = assets.reduce((s, r) => s + convert(toNumber(r.amount), r.currency), 0);
    const owe = liabilities.reduce((s, r) => s + convert(toNumber(r.amount), r.currency), 0);
    const byCurrency = new Map<string, number>();
    for (const r of assets) {
      byCurrency.set(r.currency, (byCurrency.get(r.currency) ?? 0) + convert(toNumber(r.amount), r.currency));
    }
    return { own, owe, net: own - owe, byCurrency: [...byCurrency].sort((a, b) => b[1] - a[1]) };
  })();

  const fmt = (v: number) => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: display,
        maximumFractionDigits: 0,
      }).format(v);
    } catch {
      return `${Math.round(v).toLocaleString("en-US")} ${display}`;
    }
  };

  return (
    <div className="grid gap-3.5 min-[761px]:grid-cols-[minmax(0,1fr)_280px]">
      <div className="lp-tile !p-5 flex flex-col gap-7">
        <RowsEditor
          title="What you own"
          rows={assets}
          setRows={setAssets}
          currencies={currencies}
          placeholder="e.g. Savings account"
        />
        <RowsEditor
          title="What you owe"
          rows={liabilities}
          setRows={setLiabilities}
          currencies={currencies}
          placeholder="e.g. Credit card"
        />
      </div>

      <div className="lp-tile !p-5 flex h-fit flex-col gap-5 min-[761px]:sticky min-[761px]:top-6">
        <label className="lp-field">
          Show totals in
          <select className="lp-input" value={display} onChange={(e) => setDisplay(e.target.value)}>
            {currencies.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <dl className="grid grid-cols-2 gap-x-3 gap-y-4" aria-live="polite">
          <div className="lp-stat col-span-2">
            <dt>Your net worth</dt>
            <dd className="!text-[30px]">{fmt(totals.net)}</dd>
          </div>
          <div className="lp-stat">
            <dt>You own</dt>
            <dd className="!text-[17px]">{fmt(totals.own)}</dd>
          </div>
          <div className="lp-stat">
            <dt>You owe</dt>
            <dd className="!text-[17px]">{fmt(totals.owe)}</dd>
          </div>
        </dl>
        {totals.own > 0 && totals.byCurrency.length > 1 && (
          <div>
            <p className="pb-2 text-[12px] font-medium text-[#737373]">Assets by currency</p>
            <ul className="flex flex-col gap-1.5">
              {totals.byCurrency.map(([code, value]) => {
                const share = (value / totals.own) * 100;
                return (
                  <li key={code} className="text-[13px]">
                    <span className="flex justify-between tabular-nums">
                      <span className="font-medium">{code}</span>
                      <span className="text-[#737373]">{share.toFixed(0)}%</span>
                    </span>
                    <span className="mt-1 block h-1 rounded-full bg-[#0000000a]">
                      <span className="block h-1 rounded-full bg-[#0a0a0a]" style={{ width: `${share}%` }} />
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        <p className="text-[11px] leading-[16px] text-[#737373]">
          Converted at live exchange rates, refreshed hourly.
        </p>
      </div>
    </div>
  );
}
