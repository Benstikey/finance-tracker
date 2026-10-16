"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useMoney } from "@/components/display-currency";
import { setDisplayCurrency } from "@/app/actions/settings";

const routeLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/accounts": "Accounts",
  "/net-worth": "Net Worth",
  "/cash-flow": "Cash Flow",
  "/objectives": "Objectives",
  "/loans": "Loans",
  "/currencies": "Currencies",
};

function DisplayCurrencySelect({ codes }: { codes: string[] }) {
  const { code } = useMoney();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <label className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="hidden sm:inline">Show totals in</span>
      <select
        aria-label="Display currency"
        value={code}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value;
          startTransition(async () => {
            await setDisplayCurrency(next);
            router.refresh();
          });
        }}
        className="h-7 rounded-md border border-input bg-card px-2 text-xs font-medium text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-60"
      >
        {codes.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </label>
  );
}

export function AppHeader({ currencyCodes }: { currencyCodes: string[] }) {
  const pathname = usePathname();
  const label = routeLabels[pathname] ?? "Finance";

  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-card px-4">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <div className="ml-auto">
        <DisplayCurrencySelect codes={currencyCodes} />
      </div>
    </header>
  );
}
