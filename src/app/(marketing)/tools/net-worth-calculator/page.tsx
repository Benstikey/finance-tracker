import type { Metadata } from "next";
import { getExchangeRates } from "@/lib/exchange-rates";
import { ToolPage } from "@/components/landing/tool-page";
import { NetWorthCalculator } from "@/components/landing/tools/net-worth-calculator";
import { NET_WORTH_TOOL as tool } from "@/content/tools";

// Rates are fetched at build time and refreshed hourly.
export const revalidate = 3600;

const DESCRIPTION =
  "Free net worth calculator that handles multiple currencies. Add your assets and debts in USD, EUR, GBP or any currency and see your total at live exchange rates.";

export const metadata: Metadata = {
  title: "Net worth calculator (multi-currency, free)",
  description: DESCRIPTION,
  alternates: { canonical: `/tools/${tool.slug}` },
  openGraph: { title: "Free multi-currency net worth calculator", description: DESCRIPTION, url: `/tools/${tool.slug}` },
  twitter: { card: "summary_large_image", title: "Free multi-currency net worth calculator", description: DESCRIPTION },
};

// Common currencies first; only ones the rate feed actually has are offered.
const PREFERRED = ["USD", "EUR", "GBP", "CAD", "AUD", "CHF", "JPY", "CNY", "INR", "AED", "SAR", "MAD", "MXN", "BRL", "SGD", "HKD", "NZD", "SEK", "NOK", "DKK", "PLN", "ZAR", "TRY"];

export default async function Page() {
  const rates = await getExchangeRates("USD");
  const currencies = PREFERRED.filter((c) => c in rates);
  return (
    <ToolPage tool={tool}>
      <NetWorthCalculator rates={rates} currencies={currencies} />
    </ToolPage>
  );
}
