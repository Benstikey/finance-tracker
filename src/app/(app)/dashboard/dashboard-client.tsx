"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  KpiDrilldown,
  type Kpi,
  type KpiDimension,
} from "@/components/kpi-drilldown";
import { formatMAD, RankedList, type RankedItem } from "@/components/metrics";

export type DashboardSeries = {
  end: string;
  netWorth: number[];
  lent: number[];
  borrowed: number[];
  flow: number[];
  accounts: { id: string; name: string; balance: number[]; flow: number[] }[];
  currencies: { code: string; balance: number[]; flow: number[] }[];
  people: Record<"lent" | "borrowed", { name: string; series: number[] }[]>;
};

const DIMENSIONS: KpiDimension[] = [
  { value: "account", label: "Account" },
  { value: "currency", label: "Currency" },
  { value: "person", label: "Person" },
  { value: "source", label: "Source" },
];

const signedMAD = (v: number) =>
  `${v > 0 ? "+" : v < 0 ? "−" : ""}${formatMAD(Math.abs(v))}`;

function share(part: number[], whole: number[]) {
  return part.map((v, i) => (whole[i] > 0 ? (v / whole[i]) * 100 : 0));
}

function buildKpis(s: DashboardSeries): Kpi[] {
  const total = s.netWorth.map((v, i) => v + s.lent[i] - s.borrowed[i]);
  const foreign = s.netWorth.map(
    (v, i) =>
      v - (s.currencies.find((c) => c.code === "MAD")?.balance[i] ?? 0)
  );

  return [
    {
      id: "net-worth",
      label: "Net worth",
      description: "The sum of every account balance, converted to MAD.",
      format: formatMAD,
      series: s.netWorth,
      breakdowns: {
        account: s.accounts.map((a) => ({ id: a.id, label: a.name, series: a.balance })),
        currency: s.currencies.map((c) => ({ id: c.code, label: c.code, series: c.balance })),
      },
    },
    {
      id: "owed-to-me",
      label: "Owed to me",
      description: "Money you lent that hasn't been settled yet.",
      format: formatMAD,
      series: s.lent,
      breakdowns: {
        person: s.people.lent.map((p) => ({ id: p.name, label: p.name, series: p.series })),
      },
    },
    {
      id: "i-owe",
      label: "I owe",
      description: "Money you borrowed that you haven't paid back yet.",
      lowerIsBetter: true,
      format: formatMAD,
      series: s.borrowed,
      breakdowns: {
        person: s.people.borrowed.map((p) => ({ id: p.name, label: p.name, series: p.series })),
      },
    },
    {
      id: "total",
      label: "Total with loans",
      description: "Net worth plus what you're owed, minus what you owe.",
      format: signedMAD,
      series: total,
      breakdowns: {
        source: [
          { id: "accounts", label: "Accounts", series: s.netWorth },
          { id: "lent", label: "Owed to me", series: s.lent },
          { id: "borrowed", label: "I owe", series: s.borrowed.map((v) => -v) },
        ],
      },
    },
    {
      id: "net-flow",
      label: "Net transactions",
      description:
        "Deposits minus withdrawals recorded in the period. The chart shows each day's total.",
      kind: "total",
      format: signedMAD,
      series: s.flow,
      breakdowns: {
        account: s.accounts.map((a) => ({ id: a.id, label: a.name, series: a.flow })),
        currency: s.currencies.map((c) => ({ id: c.code, label: c.code, series: c.flow })),
      },
    },
    {
      id: "foreign-share",
      label: "Held in foreign currency",
      description: "The share of your net worth that isn't in MAD, at today's rates.",
      kind: "rate",
      series: share(foreign, s.netWorth),
      breakdowns: {
        currency: s.currencies.map((c) => ({
          id: c.code,
          label: c.code,
          series: share(c.balance, s.netWorth),
        })),
      },
    },
  ];
}

export function DashboardClient({
  series,
  accounts,
  currencies,
}: {
  series: DashboardSeries;
  accounts: RankedItem[];
  currencies: RankedItem[];
}) {
  const kpis = useMemo(() => buildKpis(series), [series]);

  // The open metric lives in the URL so a detail view can be shared.
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const param = searchParams.get("kpi");
  const selected = kpis.some((k) => k.id === param) ? param : null;

  function onSelectedChange(id: string | null) {
    const params = new URLSearchParams(searchParams);
    if (id) params.set("kpi", id);
    else params.delete("kpi");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div className="@container flex flex-col gap-5">
      <KpiDrilldown
        title="Overview"
        kpis={kpis}
        dimensions={DIMENSIONS}
        end={series.end}
        defaultRange="30"
        selected={selected}
        onSelectedChange={onSelectedChange}
      />

      <div className="grid gap-5 @min-[640px]:grid-cols-2">
        <RankedList
          title="Accounts"
          unit="MAD"
          items={accounts}
          empty="No accounts yet."
        />
        <RankedList
          title="Currencies"
          unit="MAD"
          items={currencies}
          empty="No balances yet."
        />
      </div>
    </div>
  );
}
