import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppHeader } from "@/components/app-header";
import type { Metadata } from "next";
import { requireUserId } from "@/lib/dal";
import { getCurrencies, getDisplayCurrency } from "@/lib/queries";
import { DisplayCurrencyProvider } from "@/components/display-currency";

// Private pages behind the login: keep them out of search results.
export const metadata: Metadata = {
  title: "App",
  robots: { index: false, follow: false },
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const userId = await requireUserId();
  const [displayCurrency, currencies] = await Promise.all([
    getDisplayCurrency(userId),
    getCurrencies(),
  ]);

  return (
    <DisplayCurrencyProvider code={displayCurrency}>
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1 overflow-auto">
            <AppHeader currencyCodes={currencies.map((c) => c.code)} />
            <div className="p-6">{children}</div>
          </main>
        </SidebarProvider>
      </TooltipProvider>
    </DisplayCurrencyProvider>
  );
}
