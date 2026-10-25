import type { Metadata } from "next";
import { BreadcrumbLd } from "@/components/landing/breadcrumb-ld";
import Link from "next/link";
import {
  ArrowLeftRight,
  CalendarDays,
  Download,
  Globe,
  Smartphone,
  Unplug,
} from "lucide-react";
import {
  AccountsScreen,
  BrowserFrame,
  CashFlowScreen,
  DashboardScreen,
  GoalsScreen,
  LoansScreen,
} from "@/components/landing/mocks";
import { cn } from "@/lib/utils";

const DESCRIPTION =
  "Every feature of Finance: a net worth dashboard with drilldowns, bank, wallet and cash accounts with transfers, loan tracking with part-payments, savings goals with projections, and a cash flow calendar. Multi-currency, no bank sync.";

export const metadata: Metadata = {
  title: "Features",
  description: DESCRIPTION,
  alternates: { canonical: "/features" },
  openGraph: { title: "Features · Finance", description: DESCRIPTION, url: "/features" },
  twitter: { card: "summary_large_image", title: "Features · Finance", description: DESCRIPTION },
};

const SECTIONS = [
  {
    id: "dashboard",
    nav: "Dashboard",
    title: "See the whole picture,\nthen the detail",
    text: "Six numbers that matter (net worth, what you're owed, what you owe, net transactions and more), each compared with the period before. Open any of them for a full chart and a breakdown by account, currency or person.",
    points: ["7, 30 and 90 day ranges", "Change versus the previous period", "Shareable links to any detail view"],
    url: "finance.wasben.com/dashboard",
    Screen: DashboardScreen,
  },
  {
    id: "accounts",
    nav: "Accounts & transfers",
    title: "Every account,\none balance",
    text: "Banks, digital wallets and cash, each in its own currency. Record deposits and withdrawals on the day they happened, and move money between accounts in one step, with the exchange rate filled in for you.",
    points: ["Transfers with live conversion", "Fees? Edit the received amount", "Full history per account"],
    url: "finance.wasben.com/accounts",
    Screen: AccountsScreen,
  },
  {
    id: "goals",
    nav: "Goals",
    title: "Goals that tell you\nwhen, not just how much",
    text: "Set a target, a monthly amount or a date, and each goal shows the month you'll reach it, whether you're on track, and what it would take to catch up.",
    points: ["Projected completion month", "On track or months behind", "Needed per month to hit a date"],
    url: "finance.wasben.com/objectives",
    Screen: GoalsScreen,
  },
  {
    id: "loans",
    nav: "Loans",
    title: "Know who owes what,\nto the cent",
    text: "Track money you lent and borrowed, person by person. Log part-payments as they come in and watch the balance shrink. A loan settles itself once it's fully repaid.",
    points: ["Part-payments with dates and notes", "Outstanding balance per person", "Lent and borrowed, side by side"],
    url: "finance.wasben.com/loans",
    Screen: LoansScreen,
  },
  {
    id: "cash-flow",
    nav: "Cash flow",
    title: "Next month,\nbefore it happens",
    text: "Add recurring income and expenses (salary, rent, subscriptions) and see them laid out on a calendar with your projected balance at the end of each month.",
    points: ["Daily, weekly, monthly or yearly", "Pause an entry without deleting it", "Monthly totals at a glance"],
    url: "finance.wasben.com/cash-flow",
    Screen: CashFlowScreen,
  },
];

const EXTRAS = [
  { icon: Globe, title: "Any currency", text: "Hold dollars, euros, pounds or add your own. Totals convert at live rates." },
  { icon: Unplug, title: "No bank sync", text: "Nothing to connect. You enter what you want, when you want." },
  { icon: Download, title: "CSV export", text: "Download your net worth history for the range you pick, ready for a spreadsheet." },
  { icon: ArrowLeftRight, title: "Period comparison", text: "Every chart can overlay the previous period, so trends are obvious." },
  { icon: CalendarDays, title: "Real dates", text: "Back-date anything. History rebuilds itself from what you record." },
  { icon: Smartphone, title: "Works on your phone", text: "Every screen adapts to small widths. Nothing to install." },
];

export default function FeaturesPage() {
  return (
    <>
      <BreadcrumbLd name="Features" path="/features" />
      <section className="mx-auto flex max-w-[1008px] flex-col items-center pt-16 pb-20 text-center min-[761px]:pt-24 min-[761px]:pb-[112px]">
        <div className="lp-hero__copy flex max-w-[600px] flex-col items-center">
          <h1 className="text-[34px] leading-[40px] font-medium tracking-[-1px] text-balance min-[761px]:text-[46px] min-[761px]:leading-[52px] min-[761px]:tracking-[-1.4px]">
            Every feature,
            <br />
            nothing extra
          </h1>
          <p className="max-w-[540px] pt-3.5 text-[15px] leading-[22px] text-pretty text-[#737373] min-[761px]:text-base min-[761px]:leading-6">
            A net worth tracker built around a few calm screens. Here is everything they do.
          </p>
          <nav aria-label="On this page" className="flex flex-wrap justify-center gap-1.5 pt-7">
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="lp-btn lp-btn--sm lp-btn--secondary">
                {s.nav}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {SECTIONS.map((s, i) => (
        <section
          key={s.id}
          id={s.id}
          aria-labelledby={`${s.id}-title`}
          className={cn(
            "mx-auto grid max-w-[1008px] scroll-mt-6 items-center gap-8 pb-20 min-[761px]:gap-12 min-[761px]:pb-[112px]",
            // The screen always gets the wide column, whichever side it's on.
            i % 2 === 0
              ? "min-[761px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
              : "min-[761px]:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
          )}
        >
          <div className={cn(i % 2 === 1 && "min-[761px]:order-2")}>
            <h2
              id={`${s.id}-title`}
              className="text-[24px] leading-[30px] font-medium tracking-[-0.6px] whitespace-pre-line min-[761px]:text-[28px] min-[761px]:leading-[34px]"
            >
              {s.title}
            </h2>
            <p className="pt-3 text-[15px] leading-[23px] text-[#737373]">{s.text}</p>
            <ul className="flex flex-col gap-2 pt-5 text-[14px]">
              {s.points.map((p) => (
                <li key={p} className="flex items-center gap-2.5">
                  <span className="size-1.5 shrink-0 rounded-full bg-[#0a0a0a]" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div aria-hidden className="min-w-0">
            <BrowserFrame url={s.url}>
              <s.Screen />
            </BrowserFrame>
          </div>
        </section>
      ))}

      <section aria-labelledby="extras-title" className="mx-auto max-w-[1008px] pb-20 min-[761px]:pb-[112px]">
        <h2 id="extras-title" className="lp-lead">
          And the small things
          <br />
          that add up
        </h2>
        <div className="grid grid-cols-1 gap-3.5 pt-8 sm:grid-cols-2 md:grid-cols-3">
          {EXTRAS.map(({ icon: Icon, title, text }) => (
            <article key={title} className="lp-tile !pb-5">
              <span className="m-3 mb-4 grid size-9 place-items-center rounded-[10px] bg-[#0000000a]" aria-hidden>
                <Icon size={17} strokeWidth={1.75} />
              </span>
              <h3 className="lp-tile__title">{title}</h3>
              <p className="lp-tile__text">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto flex max-w-[640px] flex-col items-center pb-28 text-center min-[761px]:pb-[168px]">
        <h2 className="lp-lead">
          Start with one account,
          <br />
          add the rest later
        </h2>
        <p className="lp-sub">Free, private, and set up in under a minute.</p>
        <div className="flex gap-2 pt-7">
          <Link href="/login" className="lp-btn lp-btn--lg lp-btn--primary">
            Get started
          </Link>
          <Link href="/privacy" className="lp-btn lp-btn--lg lp-btn--secondary">
            Read about privacy
          </Link>
        </div>
      </section>
    </>
  );
}
