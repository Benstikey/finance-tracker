"use client";

import { useMemo, useState } from "react";
import {
  CompareToggle,
  DeltaBadge,
  ExportButton,
  formatMAD,
  madFormat,
  MetricTabs,
  PageHeader,
  Panel,
  PanelHeader,
  RANGES,
  RangeControl,
  RankedList,
  toTrend,
  TrendChart,
} from "@/components/metrics";

export type NetWorthRow = {
  date: string;
  total: number;
  accounts: Record<string, number>;
};

type AccountMeta = { id: string; name: string; currencyCode: string };

const TOTAL = "__total__";

const pick = (key: string) => (row: NetWorthRow) =>
  key === TOTAL ? row.total : (row.accounts[key] ?? 0);

export function NetWorthClient({
  history,
  accountMeta,
}: {
  history: NetWorthRow[];
  accountMeta: AccountMeta[];
}) {
  const [selected, setSelected] = useState<string>(TOTAL);
  const [rangeDays, setRangeDays] = useState<number>(90);
  const [compare, setCompare] = useState(false);

  const range = RANGES.find((r) => r.days === rangeDays) ?? RANGES[0];
  const current = useMemo(
    () => history.slice(-(rangeDays + 1)),
    [history, rangeDays]
  );

  const series = [
    { key: TOTAL, label: "Net worth" },
    ...accountMeta.map((a) => ({ key: a.id, label: a.name })),
  ];
  const selectedLabel =
    series.find((s) => s.key === selected)?.label ?? "Net worth";

  const trend = useMemo(
    () => toTrend(history, rangeDays, pick(selected)),
    [history, rangeDays, selected]
  );

  const first = current[0];
  const last = current.at(-1);

  const balances = accountMeta
    .map((a) => ({
      label: a.name,
      hint: a.currencyCode,
      value: last?.accounts[a.id] ?? 0,
    }))
    .sort((a, b) => b.value - a.value);

  const changes = accountMeta
    .map((a) => ({
      label: a.name,
      hint: a.currencyCode,
      value: (last?.accounts[a.id] ?? 0) - (first?.accounts[a.id] ?? 0),
    }))
    .filter((c) => c.value !== 0)
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

  return (
    <div className="@container flex flex-col gap-5">
      <PageHeader
        title="Net Worth"
        subtitle={`Balance per account · MAD · ${range.long}`}
        actions={
          <>
            <RangeControl value={rangeDays} onChange={setRangeDays} />
            <ExportButton
              filename={`net-worth-${range.label.toLowerCase()}-${last?.date}.csv`}
              header={["date", "net_worth", ...accountMeta.map((a) => a.name)]}
              rows={current.map((row) => [
                row.date,
                row.total,
                ...accountMeta.map((a) => row.accounts[a.id] ?? 0),
              ])}
            />
          </>
        }
      />

      <Panel>
        <MetricTabs
          label="Series"
          className="border-b border-border"
          value={selected}
          onChange={setSelected}
          tabs={series.map((s) => {
            const a = first ? pick(s.key)(first) : 0;
            const b = last ? pick(s.key)(last) : 0;
            return {
              key: s.key,
              label: s.label,
              value: formatMAD(b),
              footer: <DeltaBadge first={a} last={b} />,
            };
          })}
        />
        <PanelHeader title={selectedLabel}>
          <CompareToggle checked={compare} onChange={setCompare} />
        </PanelHeader>
        <div className="px-4 pb-4 @min-[460px]:px-5 @min-[460px]:pb-5">
          <TrendChart data={trend} label={selectedLabel} compare={compare} />
        </div>
      </Panel>

      <div className="grid gap-5 @min-[640px]:grid-cols-2">
        <RankedList
          title="Balances"
          unit="MAD"
          items={balances}
          empty="No accounts yet."
        />
        <RankedList
          title={`Change · ${range.long.toLowerCase()}`}
          unit="MAD"
          items={changes}
          empty="No transactions in this period."
          format={(v) => `${v > 0 ? "+" : v < 0 ? "−" : ""}${madFormat.format(Math.abs(v))}`}
        />
      </div>
    </div>
  );
}
