import { optionalUserId } from "@/lib/dal";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Lock, Wallet } from "lucide-react";
import { Sparkline, WallTile } from "@/components/landing/mocks";
import { ScreensTabs } from "@/components/landing/screens-tabs";
import { Faq } from "@/components/landing/faq";
import "./landing.css";

const FAQS = [
  {
    q: "Do I need to connect my bank?",
    a: "No. There is no bank sync at all. You add your accounts and record deposits and withdrawals yourself, so no credentials ever leave your hands.",
  },
  {
    q: "Which currencies does it support?",
    a: "Any currency you add. Every balance is converted with live exchange rates, so net worth, loans and goals all add up in one currency.",
  },
  {
    q: "Where is my data stored?",
    a: "In a private Postgres database. Every query is scoped to your account, and nothing is shared with advertisers or third parties.",
  },
  {
    q: "Can I get my data out?",
    a: "Yes. The net worth view exports your history as a CSV file for any range, ready for a spreadsheet.",
  },
  {
    q: "Is it really free?",
    a: "Yes. There is no trial, no card and no paid tier.",
  },
];

function LogoMark({ size = 20 }: { size?: number }) {
  return (
    <span
      className="grid place-items-center rounded-[6px] bg-[#0a0a0a] text-white"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <Wallet size={size * 0.6} strokeWidth={2} />
    </span>
  );
}

function IsoWall() {
  // The grid is rendered twice so the slow upward drift loops seamlessly.
  const tiles = Array.from({ length: 36 }, (_, i) => i);
  return (
    <div className="lp-iso" aria-hidden>
      <div className="lp-iso__plane">
        <div className="lp-iso__track">
          {[0, 1].map((copy) => (
            <div key={copy} className="lp-iso__grid">
              {tiles.map((i) => (
                <div key={i} className="lp-iso__tile">
                  <WallTile variant={i * 5 + Math.floor(i / 6)} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="lp-iso__blur lp-iso__blur--soft" />
      <div className="lp-iso__blur lp-iso__blur--strong" />
      <div className="lp-iso__blur lp-iso__blur--bottom" />
    </div>
  );
}

export default async function LandingPage() {
  // Redirect authenticated users straight to the app
  const userId = await optionalUserId();
  if (userId) redirect("/dashboard");

  return (
    <div className="lp">
      <header className="relative z-30 mx-auto flex h-[68px] max-w-[1056px] items-center justify-between gap-4 px-6">
        <div className="flex min-w-0 items-center gap-[30px]">
          <Link href="/" className="flex items-center gap-[7px]" aria-label="Finance home">
            <LogoMark />
            <span className="text-[15px] font-medium tracking-[-0.15px]">Finance</span>
          </Link>
          <nav aria-label="Primary" className="hidden gap-0.5 sm:flex">
            <a href="#screens" className="lp-nav__link">
              Screens
            </a>
            <a href="#private" className="lp-nav__link">
              Privacy
            </a>
            <a href="#faq" className="lp-nav__link">
              FAQ
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-1">
          <Link href="/login" className="lp-btn lp-btn--sm lp-btn--secondary hidden sm:inline-flex">
            Log in
          </Link>
          <Link href="/login" className="lp-btn lp-btn--sm lp-btn--primary">
            Get started
          </Link>
        </div>
      </header>

      <main className="px-6">
        {/* ── Hero ───────────────────────────────────────────────────── */}
        <section className="relative mx-auto flex max-w-[1008px] flex-col items-center justify-center pb-20 text-center min-[761px]:min-h-[620px] min-[761px]:py-[120px] min-[761px]:pb-[112px]">
          <IsoWall />
          <div className="lp-hero__copy relative z-10 flex max-w-[560px] flex-col items-center">
            <h1 className="text-[34px] leading-[40px] font-medium tracking-[-1px] text-balance min-[761px]:text-[46px] min-[761px]:leading-[52px] min-[761px]:tracking-[-1.4px]">
              Your money,
              <br />
              in plain sight
            </h1>
            <p className="max-w-[560px] pt-3.5 text-[15px] leading-[22px] text-pretty text-[#737373] min-[761px]:text-base min-[761px]:leading-6">
              Every account, currency, loan and goal in one calm place.
              <br className="hidden sm:block" /> No bank sync. Just the numbers you choose to enter.
            </p>
            <div className="flex gap-2 pt-7">
              <Link href="/login" className="lp-btn lp-btn--lg lp-btn--primary">
                Get started
              </Link>
              <Link href="/login" className="lp-btn lp-btn--lg lp-btn--secondary">
                Log in
              </Link>
            </div>
          </div>
        </section>

        {/* ── Screens ────────────────────────────────────────────────── */}
        <section id="screens" className="mx-auto max-w-[1008px] scroll-mt-6 pb-20 min-[761px]:pb-[112px]">
          <h2 className="lp-lead">
            Every view you need,
            <br />
            none of the noise
          </h2>
          <p className="lp-sub">
            Net worth, accounts, cash flow, goals and loans. One quiet screen for each, all in
            the currency you think in.
          </p>
          <ScreensTabs />
        </section>

        {/* ── Private by design ──────────────────────────────────────── */}
        <section id="private" className="mx-auto max-w-[1008px] scroll-mt-6 pb-20 min-[761px]:pb-[112px]">
          <h2 className="lp-lead">
            Private by default,
            <br />
            yours to keep
          </h2>
          <div className="grid grid-cols-1 gap-3.5 pt-8 sm:grid-cols-2 md:grid-cols-3">
            <article className="lp-tile">
              <div className="lp-tile__stage" aria-hidden>
                <div className="flex w-52 flex-col gap-2 rounded-[10px] bg-white p-3 shadow-[0_1px_1.5px_#0000000a,inset_0_0_0_1px_#0a0a0a0e]">
                  <div className="flex items-center gap-2">
                    <span className="grid size-7 place-items-center rounded-full bg-[#0000000a]">
                      <Lock size={13} strokeWidth={1.75} />
                    </span>
                    <span className="text-[12px] font-medium">Bank connection</span>
                  </div>
                  <div className="flex items-center justify-between rounded-md bg-[#fafafa] px-2.5 py-2 text-[11px] text-[#737373]">
                    Never asked for
                    <span className="h-4 w-7 rounded-full bg-[#0000001a] p-0.5">
                      <span className="block size-3 rounded-full bg-white shadow-sm" />
                    </span>
                  </div>
                </div>
              </div>
              <h3 className="lp-tile__title">No bank connection</h3>
              <p className="lp-tile__text">
                You enter what you want, when you want. No credentials, no scraping, no surprises.
              </p>
            </article>

            <article className="lp-tile">
              <div className="lp-tile__stage" aria-hidden>
                <div className="flex w-52 flex-col divide-y divide-[#f0f0f0] rounded-[10px] bg-white shadow-[0_1px_1.5px_#0000000a,inset_0_0_0_1px_#0a0a0a0e]">
                  {[
                    ["MAD", "1.0000"],
                    ["EUR", "10.8412"],
                    ["USD", "9.9530"],
                  ].map(([code, rate]) => (
                    <div key={code} className="flex items-center justify-between px-3 py-2 text-[12px]">
                      <span className="font-medium">{code}</span>
                      <span className="font-mono text-[#737373]">{rate}</span>
                    </div>
                  ))}
                </div>
              </div>
              <h3 className="lp-tile__title">Every currency, one total</h3>
              <p className="lp-tile__text">
                Hold dirhams, euros and dollars. Live rates keep your net worth in one number.
              </p>
            </article>

            <article className="lp-tile sm:col-span-2 md:col-span-1">
              <div className="lp-tile__stage" aria-hidden>
                <div className="flex w-52 flex-col gap-1 rounded-[10px] bg-white p-3 shadow-[0_1px_1.5px_#0000000a,inset_0_0_0_1px_#0a0a0a0e]">
                  <span className="text-[11px] text-[#737373]">Net worth · 90 days</span>
                  <span className="text-[16px] font-semibold tracking-tight">142,800 MAD</span>
                  <Sparkline className="h-12" />
                </div>
              </div>
              <h3 className="lp-tile__title">History that builds itself</h3>
              <p className="lp-tile__text">
                Each deposit or withdrawal adds to a real timeline you can compare period by period.
              </p>
            </article>
          </div>
        </section>

        {/* ── FAQ ────────────────────────────────────────────────────── */}
        <section
          id="faq"
          aria-labelledby="lp-faq-title"
          className="mx-auto max-w-[640px] scroll-mt-6 pb-28 min-[761px]:pb-[168px]"
        >
          <h2 id="lp-faq-title" className="lp-lead">
            Questions,
            <br />
            answered
          </h2>
          <Faq items={FAQS} />
          <div className="flex justify-center pt-10">
            <Link href="/login" className="lp-btn lp-btn--lg lp-btn--primary">
              Get started
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#e5e5e5]">
        <div className="mx-auto flex max-w-[1056px] flex-col items-center justify-between gap-3 px-6 py-8 text-[13px] text-[#737373] sm:flex-row">
          <span className="flex items-center gap-[7px] text-[#0a0a0a]">
            <LogoMark size={17} />
            <span className="font-medium">Finance</span>
          </span>
          <span>A private, multi-currency finance tracker.</span>
          <Link href="/login" className="lp-nav__link">
            Log in
          </Link>
        </div>
      </footer>
    </div>
  );
}
