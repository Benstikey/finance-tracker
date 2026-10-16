"use client";

import { createContext, useContext, useMemo } from "react";

type Money = {
  /** ISO code totals are converted to, e.g. "USD". */
  code: string;
  /** Whole-unit amount with the currency, e.g. "$142,800" or "MAD 142,800". */
  format: (value: number) => string;
  /** Like format, with an explicit sign: "+$1,200", "−$350". */
  formatSigned: (value: number) => string;
};

function makeMoney(code: string): Money {
  let nf: Intl.NumberFormat;
  try {
    nf = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    });
  } catch {
    // A custom code Intl doesn't know: fall back to "142,800 XYZ".
    const plain = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
    nf = { format: (v: number) => `${plain.format(v)} ${code}` } as Intl.NumberFormat;
  }
  const format = (v: number) => nf.format(Math.round(v) || 0);
  return {
    code,
    format,
    formatSigned: (v) => `${v > 0 ? "+" : v < 0 ? "−" : ""}${format(Math.abs(v))}`,
  };
}

const MoneyContext = createContext<Money>(makeMoney("USD"));

export function DisplayCurrencyProvider({
  code,
  children,
}: {
  code: string;
  children: React.ReactNode;
}) {
  const money = useMemo(() => makeMoney(code), [code]);
  return <MoneyContext.Provider value={money}>{children}</MoneyContext.Provider>;
}

/** The user's display currency and formatters for it. */
export function useMoney() {
  return useContext(MoneyContext);
}
