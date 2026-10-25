import type { Metadata } from "next";
import { ToolPage } from "@/components/landing/tool-page";
import { EmergencyFundCalculator } from "@/components/landing/tools/emergency-fund-calculator";
import { EMERGENCY_TOOL as tool } from "@/content/tools";

const DESCRIPTION =
  "Free emergency fund calculator. See how much to save for 3, 6, 9 or 12 months of essential expenses, how many months you're covered today, and when you'll be fully covered.";

export const metadata: Metadata = {
  title: "Emergency fund calculator: how much should you save?",
  description: DESCRIPTION,
  alternates: { canonical: `/tools/${tool.slug}` },
  openGraph: { title: "Free emergency fund calculator", description: DESCRIPTION, url: `/tools/${tool.slug}` },
  twitter: { card: "summary_large_image", title: "Free emergency fund calculator", description: DESCRIPTION },
};

export default function Page() {
  return (
    <ToolPage tool={tool}>
      <EmergencyFundCalculator />
    </ToolPage>
  );
}
