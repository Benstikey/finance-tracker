"use client";

import { useState } from "react";
import {
  AccountsScreen,
  CashFlowScreen,
  DashboardScreen,
  GoalsScreen,
  LoansScreen,
} from "./mocks";

const SCREENS = [
  { key: "dashboard", label: "Dashboard", url: "finance.wasben.com/dashboard", Screen: DashboardScreen },
  { key: "accounts", label: "Accounts", url: "finance.wasben.com/accounts", Screen: AccountsScreen },
  { key: "cash-flow", label: "Cash flow", url: "finance.wasben.com/cash-flow", Screen: CashFlowScreen },
  { key: "goals", label: "Goals", url: "finance.wasben.com/objectives", Screen: GoalsScreen },
  { key: "loans", label: "Loans", url: "finance.wasben.com/loans", Screen: LoansScreen },
];

export function ScreensTabs() {
  const [active, setActive] = useState(SCREENS[0].key);
  const screen = SCREENS.find((s) => s.key === active) ?? SCREENS[0];

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = SCREENS[(index + step + SCREENS.length) % SCREENS.length];
    setActive(next.key);
    document.getElementById(`lp-tab-${next.key}`)?.focus();
  }

  return (
    <>
      <div className="lp-tabs" role="tablist" aria-label="Pick a screen">
        {SCREENS.map((s, i) => (
          <button
            key={s.key}
            id={`lp-tab-${s.key}`}
            type="button"
            role="tab"
            aria-selected={s.key === active}
            aria-controls="lp-screen-panel"
            tabIndex={s.key === active ? 0 : -1}
            className="lp-tab"
            onClick={() => setActive(s.key)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div
        id="lp-screen-panel"
        role="tabpanel"
        aria-labelledby={`lp-tab-${screen.key}`}
        className="lp-browser"
      >
        <div className="lp-browser__bar" aria-hidden>
          <span className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-2.5 rounded-full bg-[#0000001a]" />
            ))}
          </span>
          <span className="min-w-0 truncate rounded-full bg-[#f7f7f9] px-3 py-1 text-center text-[11px] text-[#0000004d] sm:min-w-56">
            {screen.url}
          </span>
          <span />
        </div>
        <div key={screen.key} className="lp-screen-in">
          <screen.Screen />
        </div>
      </div>
    </>
  );
}
