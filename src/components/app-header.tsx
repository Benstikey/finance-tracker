"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";

const routeLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/accounts": "Accounts",
  "/net-worth": "Net Worth",
  "/cash-flow": "Cash Flow",
  "/objectives": "Objectives",
  "/loans": "Loans",
  "/currencies": "Currencies",
};

export function AppHeader() {
  const pathname = usePathname();
  const label = routeLabels[pathname] ?? "Finance";

  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-card px-4">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
      <span className="text-sm font-semibold text-foreground">{label}</span>
    </header>
  );
}
