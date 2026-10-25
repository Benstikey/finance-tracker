import type { Metadata } from "next";
import { BreadcrumbLd } from "@/components/landing/breadcrumb-ld";
import Link from "next/link";
import { Ban, Download, EyeOff, Lock, Trash2, Unplug } from "lucide-react";

const DESCRIPTION =
  "How Finance handles your data: no bank connection, no ads, nothing sold. What we store, how it's secured, and which services we rely on.";

export const metadata: Metadata = {
  title: "Privacy",
  description: DESCRIPTION,
  alternates: { canonical: "/privacy" },
  openGraph: { title: "Privacy · Finance", description: DESCRIPTION, url: "/privacy" },
  twitter: { card: "summary_large_image", title: "Privacy · Finance", description: DESCRIPTION },
};

const UPDATED = "October 16, 2026";

const PRINCIPLES = [
  {
    icon: Unplug,
    title: "No bank connection",
    text: "We never ask for bank logins, card numbers or account access. Every figure is one you typed in.",
  },
  {
    icon: EyeOff,
    title: "Only you see your data",
    text: "Every request is checked against your session, and every database query is limited to your own records.",
  },
  {
    icon: Ban,
    title: "No ads, nothing sold",
    text: "There are no advertising trackers, and your data is never sold, shared or used to profile you.",
  },
  {
    icon: Download,
    title: "Yours to take",
    text: "Export your net worth history as a CSV file whenever you like.",
  },
  {
    icon: Trash2,
    title: "Delete means delete",
    text: "Removing an account, transaction, loan or goal deletes it from the database. There is no hidden archive.",
  },
  {
    icon: Lock,
    title: "Secured by default",
    text: "Encrypted connections everywhere, hashed passwords and short-lived, signed sessions.",
  },
];

const STORED = [
  ["Your login", "Your email address and a hashed version of your password (never the password itself)."],
  ["What you enter", "Accounts, balances, transactions and transfers, loans and repayments, goals, and cash flow entries."],
  ["Your session", "A signed cookie that keeps you logged in for up to 7 days."],
];

const NOT_STORED = [
  "Bank or card credentials",
  "Your contacts, location or device data",
  "Advertising or cross-site tracking identifiers",
];

const SERVICES = [
  ["Vercel", "Hosts the app, and counts page views with cookie-free Web Analytics."],
  ["Neon", "Runs the Postgres database where your data is stored (AWS, US East)."],
  ["ExchangeRate-API", "Provides exchange rates. Our server asks for current rates; none of your data is sent."],
];

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-[22px] leading-[28px] font-medium tracking-[-0.5px]">
      {children}
    </h2>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <BreadcrumbLd name="Privacy" path="/privacy" />
      <section className="mx-auto flex max-w-[1008px] flex-col items-center pt-16 pb-16 text-center min-[761px]:pt-24 min-[761px]:pb-20">
        <div className="lp-hero__copy flex max-w-[600px] flex-col items-center">
          <h1 className="text-[34px] leading-[40px] font-medium tracking-[-1px] text-balance min-[761px]:text-[46px] min-[761px]:leading-[52px] min-[761px]:tracking-[-1.4px]">
            Private by design,
            <br />
            not by promise
          </h1>
          <p className="max-w-[540px] pt-3.5 text-[15px] leading-[22px] text-pretty text-[#737373] min-[761px]:text-base min-[761px]:leading-6">
            A finance app only works if you trust it. Here is exactly what we store, how it’s
            protected, and who else is involved.
          </p>
        </div>
      </section>

      <section aria-label="Principles" className="mx-auto max-w-[1008px] pb-20 min-[761px]:pb-[112px]">
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3">
          {PRINCIPLES.map(({ icon: Icon, title, text }) => (
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

      <div className="mx-auto flex max-w-[640px] flex-col gap-14 pb-28 min-[761px]:pb-[168px]">
        <section aria-labelledby="stored">
          <SectionTitle id="stored">What we store</SectionTitle>
          <dl className="mt-5 divide-y divide-[#e5e5e5] border-y border-[#e5e5e5]">
            {STORED.map(([term, detail]) => (
              <div key={term} className="grid gap-1 py-4 sm:grid-cols-[160px_1fr] sm:gap-6">
                <dt className="text-[14px] font-medium">{term}</dt>
                <dd className="text-[14px] leading-[22px] text-[#737373]">{detail}</dd>
              </div>
            ))}
          </dl>
          <h3 className="pt-8 text-[15px] font-medium">What we never store</h3>
          <ul className="flex flex-col gap-2 pt-3 text-[14px] text-[#737373]">
            {NOT_STORED.map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <span className="size-1.5 shrink-0 rounded-full bg-[#0a0a0a]" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="security" className="scroll-mt-6">
          <SectionTitle id="security">Security</SectionTitle>
          <div className="mt-5 flex flex-col gap-4 text-[14px] leading-[22px] text-[#737373]">
            <p>
              <strong className="font-medium text-[#0a0a0a]">Passwords</strong>{" "}are hashed with
              scrypt and a random salt before they’re stored. Nobody, including us, can read
              your password back.
            </p>
            <p>
              <strong className="font-medium text-[#0a0a0a]">Sessions</strong>{" "}use a signed cookie
              that scripts on the page can’t read, that’s only sent over HTTPS, and that
              expires after 7 days.
            </p>
            <p>
              <strong className="font-medium text-[#0a0a0a]">Access</strong>{" "}is checked on every
              request, and every database query is scoped to your account, so one person’s
              records can never appear in another’s.
            </p>
            <p>
              <strong className="font-medium text-[#0a0a0a]">Connections</strong>{" "}between your
              browser, the app and the database are encrypted.
            </p>
          </div>
        </section>

        <section aria-labelledby="services">
          <SectionTitle id="services">Services we rely on</SectionTitle>
          <dl className="mt-5 divide-y divide-[#e5e5e5] border-y border-[#e5e5e5]">
            {SERVICES.map(([name, detail]) => (
              <div key={name} className="grid gap-1 py-4 sm:grid-cols-[160px_1fr] sm:gap-6">
                <dt className="text-[14px] font-medium">{name}</dt>
                <dd className="text-[14px] leading-[22px] text-[#737373]">{detail}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="cookies">
          <SectionTitle id="cookies">Cookies</SectionTitle>
          <p className="mt-5 text-[14px] leading-[22px] text-[#737373]">
            One cookie, set only when you log in, to keep you logged in. Page view counts are
            collected without cookies. There are no advertising or third-party tracking cookies.
          </p>
        </section>

        <div className="flex flex-col items-center gap-4 border-t border-[#e5e5e5] pt-10 text-center">
          <p className="text-[13px] text-[#737373]">Last updated {UPDATED}</p>
          <div className="flex gap-2">
            <Link href="/login" className="lp-btn lp-btn--lg lp-btn--primary">
              Get started
            </Link>
            <Link href="/features" className="lp-btn lp-btn--lg lp-btn--secondary">
              See features
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
