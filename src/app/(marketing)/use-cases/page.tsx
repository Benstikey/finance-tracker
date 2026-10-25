import type { Metadata } from "next";
import { BreadcrumbLd } from "@/components/landing/breadcrumb-ld";
import Link from "next/link";
import { CalendarDays, Globe, Handshake, Lock, Target } from "lucide-react";

const DESCRIPTION =
  "Who Finance is for: people paid in one currency and saving in another, freelancers with uneven income, anyone saving for something big, and anyone who'd rather not connect their bank.";

export const metadata: Metadata = {
  title: "Use cases",
  description: DESCRIPTION,
  alternates: { canonical: "/use-cases" },
  openGraph: { title: "Use cases · Finance", description: DESCRIPTION, url: "/use-cases" },
  twitter: { card: "summary_large_image", title: "Use cases · Finance", description: DESCRIPTION },
};

const CASES = [
  {
    icon: Globe,
    who: "Expats and anyone paid abroad",
    problem:
      "Your salary lands in one currency, your savings sit in another, and no app adds them up properly.",
    helps: [
      "Every account keeps its own currency",
      "Totals in the currency you choose, at live rates",
      "Transfers that record what left and what arrived",
    ],
    link: { href: "/blog/tracking-money-in-multiple-currencies", label: "Read: tracking money across currencies" },
  },
  {
    icon: CalendarDays,
    who: "Freelancers with uneven income",
    problem: "Some months are great, some are quiet, and it's hard to know if next month is covered.",
    helps: [
      "Recurring income and bills on a calendar",
      "Projected balance at the end of each month",
      "Net transactions compared with the month before",
    ],
    link: { href: "/features#cash-flow", label: "See the cash flow calendar" },
  },
  {
    icon: Target,
    who: "Saving for something big",
    problem: "A trip, a car, an emergency fund. You know the price, but not when you'll get there.",
    helps: [
      "A monthly amount or a date per goal",
      "The month you'll reach it, or how far behind you are",
      "What you'd need each month to hit your date",
    ],
    link: { href: "/blog/savings-goals-you-will-actually-reach", label: "Read: the monthly maths of goals" },
  },
  {
    icon: Handshake,
    who: "The friend who always pays first",
    problem: "Tickets, dinners, deposits. Small loans pile up, and asking about them feels awkward.",
    helps: [
      "Loans in both directions, per person",
      "Part-payments with dates and notes",
      "Outstanding balances counted in your net worth",
    ],
    link: { href: "/blog/lending-money-to-friends", label: "Read: lending to friends" },
  },
  {
    icon: Lock,
    who: "Anyone who won't connect their bank",
    problem: "You want the overview without handing your bank login to an app.",
    helps: [
      "No bank connection, ever",
      "Only the numbers you choose to enter",
      "Export your history whenever you like",
    ],
    link: { href: "/privacy", label: "How your data is handled" },
  },
];

export default function UseCasesPage() {
  return (
    <>
      <BreadcrumbLd name="Use cases" path="/use-cases" />
      <section className="mx-auto flex max-w-[1008px] flex-col items-center pt-16 pb-16 text-center min-[761px]:pt-24 min-[761px]:pb-20">
        <div className="lp-hero__copy flex max-w-[600px] flex-col items-center">
          <h1 className="text-[34px] leading-[40px] font-medium tracking-[-1px] text-balance min-[761px]:text-[46px] min-[761px]:leading-[52px] min-[761px]:tracking-[-1.4px]">
            Built for money
            <br />
            that lives in many places
          </h1>
          <p className="max-w-[520px] pt-3.5 text-[15px] leading-[22px] text-pretty text-[#737373] min-[761px]:text-base min-[761px]:leading-6">
            If any of these sound like you, Finance was made for the way you handle money.
          </p>
        </div>
      </section>

      <section aria-label="Use cases" className="mx-auto flex max-w-[1008px] flex-col gap-3.5 pb-20 min-[761px]:pb-[112px]">
        {CASES.map(({ icon: Icon, who, problem, helps, link }) => (
          <article
            key={who}
            className="grid gap-6 rounded-[14px] border border-[#0a0a0a0e] bg-white p-6 min-[761px]:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] min-[761px]:gap-10 min-[761px]:p-8"
          >
            <div>
              <span className="mb-4 grid size-9 place-items-center rounded-[10px] bg-[#0000000a]" aria-hidden>
                <Icon size={17} strokeWidth={1.75} />
              </span>
              <h2 className="text-[20px] leading-[26px] font-medium tracking-[-0.4px]">{who}</h2>
              <p className="pt-2 text-[15px] leading-[23px] text-[#737373]">{problem}</p>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-[12px] font-medium text-[#737373]">How Finance helps</p>
              <ul className="flex flex-col gap-2 pt-3 text-[14px]">
                {helps.map((h) => (
                  <li key={h} className="flex items-center gap-2.5">
                    <span className="size-1.5 shrink-0 rounded-full bg-[#0a0a0a]" aria-hidden />
                    {h}
                  </li>
                ))}
              </ul>
              <Link
                href={link.href}
                className="mt-5 w-fit text-[13px] font-medium underline decoration-[#0a0a0a40] underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-[#0a0a0a]"
              >
                {link.label}
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="mx-auto flex max-w-[640px] flex-col items-center pb-28 text-center min-[761px]:pb-[168px]">
        <h2 className="lp-lead">
          Sound familiar?
          <br />
          Start with one account
        </h2>
        <p className="lp-sub">Free, private, and set up in under a minute.</p>
        <div className="flex gap-2 pt-7">
          <Link href="/login" className="lp-btn lp-btn--lg lp-btn--primary">
            Get started
          </Link>
          <Link href="/how-it-works" className="lp-btn lp-btn--lg lp-btn--secondary">
            How it works
          </Link>
        </div>
      </section>
    </>
  );
}
