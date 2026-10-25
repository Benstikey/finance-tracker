import type { Metadata } from "next";
import { BreadcrumbLd } from "@/components/landing/breadcrumb-ld";
import Link from "next/link";
import { ArrowLeftRight, Check, Landmark, Mail } from "lucide-react";
import { Sparkline } from "@/components/landing/mocks";

const DESCRIPTION =
  "How Finance works: create an account, add your balances in any currency, record what happens, and see your net worth, goals and loans in one place. No bank connection.";

export const metadata: Metadata = {
  title: "How it works",
  description: DESCRIPTION,
  alternates: { canonical: "/how-it-works" },
  openGraph: { title: "How it works · Finance", description: DESCRIPTION, url: "/how-it-works" },
  twitter: { card: "summary_large_image", title: "How it works · Finance", description: DESCRIPTION },
};

const card =
  "rounded-[10px] bg-white shadow-[0_1px_1.5px_#0000000a,inset_0_0_0_1px_#0a0a0a0e]";

function StepOne() {
  return (
    <div className={`${card} flex w-56 flex-col gap-2 p-3`}>
      <span className="flex items-center gap-2 rounded-md bg-[#fafafa] px-2.5 py-2 text-[11px] text-[#737373]">
        <Mail size={12} strokeWidth={1.75} /> you@example.com
      </span>
      <span className="rounded-md bg-[#fafafa] px-2.5 py-2 text-[11px] tracking-[2px] text-[#737373]">
        ••••••••
      </span>
      <span className="rounded-md bg-[#0a0a0a] py-2 text-center text-[11px] font-medium text-white">
        Create account
      </span>
    </div>
  );
}

function StepTwo() {
  return (
    <div className={`${card} flex w-56 flex-col divide-y divide-[#f0f0f0]`}>
      {[
        ["Main checking", "$84,200"],
        ["Wise", "€31,800"],
        ["Revolut", "£11,200"],
      ].map(([name, bal]) => (
        <span key={name} className="flex items-center justify-between px-3 py-2 text-[11px]">
          <span className="flex items-center gap-2 font-medium">
            <Landmark size={12} strokeWidth={1.75} className="text-[#737373]" />
            {name}
          </span>
          <span className="font-mono text-[#737373]">{bal}</span>
        </span>
      ))}
    </div>
  );
}

function StepThree() {
  return (
    <div className={`${card} flex w-56 flex-col gap-2 p-3 text-[11px]`}>
      <span className="flex items-center justify-between">
        <span className="font-medium">Salary</span>
        <span className="font-mono">+$6,800</span>
      </span>
      <span className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-medium">
          <ArrowLeftRight size={11} strokeWidth={1.75} /> To Wise
        </span>
        <span className="font-mono text-[#737373]">−$1,000</span>
      </span>
      <span className="flex items-center justify-between">
        <span className="font-medium">Alex repaid</span>
        <span className="font-mono">+$300</span>
      </span>
    </div>
  );
}

function StepFour() {
  return (
    <div className={`${card} flex w-56 flex-col gap-1 p-3`}>
      <span className="text-[11px] text-[#737373]">Net worth · 30 days</span>
      <span className="text-[16px] font-semibold tracking-tight">$142,800</span>
      <span className="w-fit rounded bg-[#0a0a0a] px-1 text-[10px] font-medium text-white">+8.4%</span>
      <Sparkline className="mt-1 h-10" />
    </div>
  );
}

const STEPS = [
  {
    title: "Create your account",
    text: "An email and a password. No card, no bank login, no onboarding questionnaire.",
    Visual: StepOne,
  },
  {
    title: "Add your accounts",
    text: "Banks, wallets and cash, each with its current balance and its own currency. Add as many as you have.",
    Visual: StepTwo,
  },
  {
    title: "Record what happens",
    text: "Deposits and withdrawals on the day they happened, transfers between accounts, money you lend or borrow, and recurring income and bills.",
    Visual: StepThree,
  },
  {
    title: "See the whole picture",
    text: "Your net worth, how it changed, where it sits and what's coming next, in the currency you choose.",
    Visual: StepFour,
  },
];

const ROUTINE = [
  "Update any balances that changed outside the app",
  "Log repayments from anyone who owes you",
  "Check the dashboard against last month",
  "Glance at your goals: on track, or behind?",
  "Look at next month on the cash flow calendar",
];

export default function HowItWorksPage() {
  return (
    <>
      <BreadcrumbLd name="How it works" path="/how-it-works" />
      <section className="mx-auto flex max-w-[1008px] flex-col items-center pt-16 pb-16 text-center min-[761px]:pt-24 min-[761px]:pb-20">
        <div className="lp-hero__copy flex max-w-[600px] flex-col items-center">
          <h1 className="text-[34px] leading-[40px] font-medium tracking-[-1px] text-balance min-[761px]:text-[46px] min-[761px]:leading-[52px] min-[761px]:tracking-[-1.4px]">
            Set up in a minute,
            <br />
            clear for years
          </h1>
          <p className="max-w-[520px] pt-3.5 text-[15px] leading-[22px] text-pretty text-[#737373] min-[761px]:text-base min-[761px]:leading-6">
            Four steps from nothing to a full picture of your money. No bank connection at any
            point.
          </p>
        </div>
      </section>

      <section aria-label="Steps" className="mx-auto max-w-[1008px] pb-20 min-[761px]:pb-[112px]">
        <ol className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {STEPS.map(({ title, text, Visual }, i) => (
            <li key={title} className="lp-tile">
              <div className="lp-tile__stage" aria-hidden>
                <Visual />
              </div>
              <p className="px-3 pb-1 text-[12px] font-medium text-[#737373]">Step {i + 1}</p>
              <h2 className="lp-tile__title">{title}</h2>
              <p className="lp-tile__text">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="routine-title"
        className="mx-auto grid max-w-[1008px] items-center gap-10 pb-20 min-[761px]:grid-cols-2 min-[761px]:pb-[112px]"
      >
        <div>
          <h2 id="routine-title" className="text-[24px] leading-[30px] font-medium tracking-[-0.6px] min-[761px]:text-[28px] min-[761px]:leading-[34px]">
            A five-minute
            <br />
            monthly routine
          </h2>
          <p className="pt-3 text-[15px] leading-[23px] text-[#737373]">
            You don&rsquo;t need to log every coffee. Once a month is enough to keep the numbers
            honest and the trend visible.
          </p>
        </div>
        <ul className="lp-tile !p-2">
          {ROUTINE.map((item) => (
            <li key={item} className="flex items-center gap-3 rounded-[8px] px-3 py-3 text-[14px]">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#0a0a0a] text-white" aria-hidden>
                <Check size={12} strokeWidth={2.5} />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto flex max-w-[640px] flex-col items-center pb-28 text-center min-[761px]:pb-[168px]">
        <h2 className="lp-lead">
          Your first account
          <br />
          takes thirty seconds
        </h2>
        <p className="lp-sub">Free, private, and nothing to connect.</p>
        <div className="flex gap-2 pt-7">
          <Link href="/login" className="lp-btn lp-btn--lg lp-btn--primary">
            Get started
          </Link>
          <Link href="/features" className="lp-btn lp-btn--lg lp-btn--secondary">
            See features
          </Link>
        </div>
      </section>
    </>
  );
}
