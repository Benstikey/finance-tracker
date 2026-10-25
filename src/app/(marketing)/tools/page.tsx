import type { Metadata } from "next";
import { BreadcrumbLd } from "@/components/landing/breadcrumb-ld";
import Link from "next/link";
import { Calculator, LifeBuoy, Target } from "lucide-react";
import { TOOLS } from "@/content/tools";

const DESCRIPTION =
  "Free personal finance calculators: a multi-currency net worth calculator, a savings goal calculator and an emergency fund calculator. No sign-up needed.";

export const metadata: Metadata = {
  title: "Free money calculators",
  description: DESCRIPTION,
  alternates: { canonical: "/tools" },
  openGraph: { title: "Free money calculators · Finance", description: DESCRIPTION, url: "/tools" },
  twitter: { card: "summary_large_image", title: "Free money calculators · Finance", description: DESCRIPTION },
};

const ICONS = { "net-worth-calculator": Calculator, "savings-goal-calculator": Target, "emergency-fund-calculator": LifeBuoy } as const;

export default function ToolsIndex() {
  return (
    <>
      <BreadcrumbLd name="Free tools" path="/tools" />
      <section className="mx-auto flex max-w-[1008px] flex-col items-center pt-16 pb-14 text-center min-[761px]:pt-24 min-[761px]:pb-16">
        <div className="lp-hero__copy flex max-w-[600px] flex-col items-center">
          <h1 className="text-[34px] leading-[40px] font-medium tracking-[-1px] text-balance min-[761px]:text-[46px] min-[761px]:leading-[52px] min-[761px]:tracking-[-1.4px]">
            Free calculators,
            <br />
            no sign-up
          </h1>
          <p className="max-w-[520px] pt-3.5 text-[15px] leading-[22px] text-pretty text-[#737373] min-[761px]:text-base min-[761px]:leading-6">
            Quick answers to the money questions that matter. Everything runs in your browser.
          </p>
        </div>
      </section>
      <section aria-label="Calculators" className="mx-auto max-w-[1008px] pb-28 min-[761px]:pb-[168px]">
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-3">
          {TOOLS.map((t) => {
            const Icon = ICONS[t.slug as keyof typeof ICONS];
            return (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}`}
                className="group flex flex-col rounded-[14px] border border-[#0a0a0a0e] bg-white p-6 transition-[box-shadow] duration-150 ease-out hover:shadow-[0_4px_42px_#0000000f]"
              >
                <span className="mb-4 grid size-9 place-items-center rounded-[10px] bg-[#0000000a]" aria-hidden>
                  <Icon size={17} strokeWidth={1.75} />
                </span>
                <h2 className="text-[17px] leading-[24px] font-medium tracking-[-0.3px]">{t.name}</h2>
                <p className="pt-2 text-[14px] leading-[22px] text-[#737373]">{t.intro}</p>
                <p className="mt-auto pt-5 text-[13px] font-medium underline decoration-[#0a0a0a40] underline-offset-4 group-hover:decoration-[#0a0a0a]">
                  Open calculator
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
