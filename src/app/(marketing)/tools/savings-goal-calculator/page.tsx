import type { Metadata } from "next";
import { ToolPage } from "@/components/landing/tool-page";
import { SavingsGoalCalculator } from "@/components/landing/tools/savings-goal-calculator";
import { SAVINGS_TOOL as tool } from "@/content/tools";

const DESCRIPTION =
  "Free savings goal calculator. Enter your goal, what you've saved and a monthly amount or a deadline to see when you'll reach it or how much to save each month.";

export const metadata: Metadata = {
  title: "Savings goal calculator: how long to save, or how much per month",
  description: DESCRIPTION,
  alternates: { canonical: `/tools/${tool.slug}` },
  openGraph: { title: "Free savings goal calculator", description: DESCRIPTION, url: `/tools/${tool.slug}` },
  twitter: { card: "summary_large_image", title: "Free savings goal calculator", description: DESCRIPTION },
};

export default function Page() {
  return (
    <ToolPage tool={tool}>
      <SavingsGoalCalculator />
    </ToolPage>
  );
}
