import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Landmark,
  TrendingUp,
  Globe,
  ShieldCheck,
  BarChart3,
  Wallet,
  Target,
  Handshake,
  ArrowRight,
  Check,
} from "lucide-react";

export default async function LandingPage() {
  // Redirect authenticated users straight to the app
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-white text-[#1E1B4B] font-sans">
      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-[#E0E7FF] bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6366F1]">
              <Wallet className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-[#1E1B4B]">
              Finance
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-[#64748B] transition-colors hover:text-[#1E1B4B]"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-[#6366F1] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#4F46E5] hover:-translate-y-px"
            >
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-20 text-center">
        {/* Eyebrow */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E0E7FF] bg-[#F5F3FF] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#6366F1]">
          No bank sync. No subscriptions. No noise.
        </div>

        {/* Headline */}
        <h1 className="mx-auto max-w-3xl text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.08] tracking-tight text-[#1E1B4B]">
          Your wealth,{" "}
          <span className="relative">
            <span className="relative z-10">your rules.</span>
            <span
              className="absolute inset-x-0 bottom-2 -z-0 h-4 rounded"
              style={{
                background:
                  "linear-gradient(90deg,#6366F1 0%,#818CF8 100%)",
                opacity: 0.18,
              }}
            />
          </span>
        </h1>

        {/* Sub */}
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[#64748B]">
          A dead-simple tracker for people who want a real picture of their
          money — across every bank, wallet, currency, and goal — without
          handing their credentials to anyone.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-xl bg-[#6366F1] px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-[#4F46E5] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-300"
          >
            Create your account
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-[#E0E7FF] bg-white px-7 py-3.5 text-base font-semibold text-[#1E1B4B] transition-all hover:border-[#6366F1] hover:text-[#6366F1]"
          >
            Sign in
          </Link>
        </div>

        {/* Trust line */}
        <p className="mt-5 text-xs text-[#94A3B8]">
          Free forever · No credit card · No bank connection required
        </p>

        {/* App preview card */}
        <div className="relative mx-auto mt-16 max-w-3xl overflow-hidden rounded-2xl border border-[#E0E7FF] bg-[#F5F3FF] p-1 shadow-2xl shadow-indigo-100">
          <div className="rounded-xl border border-[#E0E7FF] bg-white p-6">
            {/* Fake browser chrome */}
            <div className="mb-4 flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-[#FDA4AF]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#FCD34D]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#6EE7B7]" />
              <div className="ml-3 h-5 w-48 rounded bg-[#F1F5F9] text-xs" />
            </div>
            {/* KPI row */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Net Worth", value: "142,800 MAD", up: true },
                { label: "Accounts", value: "4 tracked", up: null },
                { label: "Savings goal", value: "68%", up: true },
                { label: "I'm owed", value: "2,500 MAD", up: null },
              ].map((kpi) => (
                <div
                  key={kpi.label}
                  className="rounded-lg border border-[#E0E7FF] p-3 text-left"
                >
                  <p className="text-xs text-[#94A3B8]">{kpi.label}</p>
                  <p className="mt-1 text-base font-bold text-[#1E1B4B]">
                    {kpi.value}
                  </p>
                  {kpi.up !== null && (
                    <p className="mt-0.5 text-xs font-medium text-[#059669]">
                      ↑ up this month
                    </p>
                  )}
                </div>
              ))}
            </div>
            {/* Fake chart bars */}
            <div className="mt-4 flex h-20 items-end gap-1.5">
              {[40, 55, 45, 60, 52, 70, 65, 80, 75, 90, 85, 100].map(
                (h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t"
                    style={{
                      height: `${h}%`,
                      background:
                        i === 11
                          ? "#6366F1"
                          : `rgba(99,102,241,${0.12 + i * 0.06})`,
                    }}
                  />
                )
              )}
            </div>
            <p className="mt-2 text-center text-xs text-[#94A3B8]">
              Net worth over the last 12 months
            </p>
          </div>
        </div>
      </section>

      {/* ── Problem strip ────────────────────────────────────────────── */}
      <section className="bg-[#1E1B4B] py-16 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#818CF8]">
            The problem with every other finance app
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
            They want your bank login.
            <br />
            <span className="text-[#818CF8]">You just want clarity.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#94A3B8]">
            Most trackers lock you into automatic bank syncing, subscription
            fees, or endless categorisation rules. They profit from your data
            while pretending to help you. This app does none of that — you
            enter what you want, when you want, and you stay in full control.
          </p>

          {/* Comparison */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-left">
              <p className="mb-3 text-sm font-semibold text-red-400">
                😮‍💨 Other apps
              </p>
              {[
                "Require your bank credentials",
                "Auto-sync = you lose control",
                "Force you to categorise every latte",
                "Expensive subscriptions",
                "Sell your spending data",
                "Overwhelm you with charts you never asked for",
              ].map((t) => (
                <div key={t} className="flex items-start gap-2 py-1.5 text-sm text-[#94A3B8]">
                  <span className="mt-0.5 text-red-400">✕</span>
                  {t}
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-[#6366F1]/30 bg-[#6366F1]/10 p-5 text-left">
              <p className="mb-3 text-sm font-semibold text-[#818CF8]">
                ✦ This app
              </p>
              {[
                "Zero bank connection — fully private",
                "You decide what to track and when",
                "Multi-currency with live exchange rates",
                "Free, with no strings attached",
                "Your data stays yours",
                "One clear view: net worth, goals, cash flow",
              ].map((t) => (
                <div key={t} className="flex items-start gap-2 py-1.5 text-sm text-white">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#059669]" />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#6366F1]">
            What you actually get
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1E1B4B] sm:text-4xl">
            Every tool you need. Nothing you don&apos;t.
          </h2>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Landmark,
              color: "#6366F1",
              bg: "#EEF2FF",
              title: "Multi-account tracking",
              desc: "Banks, digital wallets, and cash — all in one place. Add as many accounts as you have, in any currency.",
            },
            {
              icon: Globe,
              color: "#059669",
              bg: "#ECFDF5",
              title: "Live multi-currency",
              desc: "Hold MAD, EUR, USD, or any currency. Exchange rates update automatically so your net worth is always accurate.",
            },
            {
              icon: TrendingUp,
              color: "#818CF8",
              bg: "#F5F3FF",
              title: "Net worth graph",
              desc: "Every deposit or withdrawal you record builds a real historical chart. Watch your wealth grow — day by day.",
            },
            {
              icon: Target,
              color: "#F59E0B",
              bg: "#FFFBEB",
              title: "Savings objectives",
              desc: "Set a goal, track your progress. Whether it's a trip, a car, or an emergency fund — see exactly how close you are.",
            },
            {
              icon: Handshake,
              color: "#EC4899",
              bg: "#FDF2F8",
              title: "Loan tracking",
              desc: "Track money you've lent and borrowed. Know at a glance who owes you, and what you owe, without spreadsheets.",
            },
            {
              icon: BarChart3,
              color: "#0EA5E9",
              bg: "#F0F9FF",
              title: "Cash flow calendar",
              desc: "Map your recurring income and expenses on a monthly calendar. See your projected balance before the month even starts.",
            },
          ].map(({ icon: Icon, color, bg, title, desc }) => (
            <div
              key={title}
              className="group rounded-2xl border border-[#E0E7FF] bg-white p-6 transition-all hover:border-[#6366F1]/40 hover:shadow-lg hover:shadow-indigo-50 hover:-translate-y-0.5"
            >
              <div
                className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ background: bg }}
              >
                <Icon className="h-5 w-5" style={{ color }} />
              </div>
              <h3 className="text-base font-bold text-[#1E1B4B]">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section className="bg-[#F5F3FF] py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#6366F1]">
              Up in 60 seconds
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1E1B4B] sm:text-4xl">
              Getting started is embarrassingly simple
            </h2>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Create your account",
                desc: "Sign up with just an email. No bank connection, no credit card, no onboarding wizard.",
              },
              {
                step: "02",
                title: "Add your accounts",
                desc: "Enter your banks, wallets, and cash. Set the current balance. Done. That's all the setup there is.",
              },
              {
                step: "03",
                title: "Record transactions",
                desc: "Log deposits and withdrawals with the date they happened. Your net worth graph builds itself.",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="relative text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6366F1] text-xl font-extrabold text-white shadow-lg shadow-indigo-200">
                  {step}
                </div>
                <h3 className="text-lg font-bold text-[#1E1B4B]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Differentiator callout ─────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <div className="rounded-3xl border border-[#E0E7FF] bg-white p-10 text-center shadow-sm">
          <ShieldCheck className="mx-auto mb-5 h-12 w-12 text-[#059669]" />
          <h2 className="text-2xl font-extrabold text-[#1E1B4B] sm:text-3xl">
            Your data never leaves your account
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#64748B]">
            There are no algorithms reading your transactions, no ad targeting
            based on your spending, and no third-party financial institutions
            involved. Every number you enter is stored privately under your
            own Supabase account — visible only to you.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[
              "No bank credentials",
              "No data selling",
              "No AI reading your transactions",
              "No ads",
            ].map((t) => (
              <span
                key={t}
                className="flex items-center gap-1.5 rounded-full border border-[#E0E7FF] bg-[#F5F3FF] px-4 py-1.5 text-sm font-medium text-[#6366F1]"
              >
                <Check className="h-3.5 w-3.5" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────── */}
      <section className="bg-[#6366F1] py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Ready to actually understand
            <br />
            your finances?
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-indigo-200">
            No trial period. No credit card. No bank sync.
            Just sign up and start getting clarity on your money today.
          </p>
          <Link
            href="/login"
            className="mt-10 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-[#6366F1] shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            Create your free account
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-4 text-sm text-indigo-300">
            Free forever · Setup in under 60 seconds
          </p>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#E0E7FF] bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#6366F1]">
              <Wallet className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-[#1E1B4B]">Finance</span>
          </div>
          <p className="text-xs text-[#94A3B8]">
            Built for people who want clarity, not complexity.
          </p>
          <Link
            href="/login"
            className="text-sm font-semibold text-[#6366F1] hover:underline"
          >
            Sign in →
          </Link>
        </div>
      </footer>
    </div>
  );
}
