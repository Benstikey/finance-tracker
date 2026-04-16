"use client";

import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Landmark, Wallet, Banknote, TrendingUp } from "lucide-react";

type AccountMeta = {
  id: string;
  name: string;
  type: string;
  currencyCode: string;
};

type ChartRow = Record<string, number | string>;

// Soft, muted palette — similar feel to the reference screenshot
const PALETTE = [
  "#818cf8", // indigo-400
  "#38bdf8", // sky-400
  "#a78bfa", // violet-400
  "#34d399", // emerald-400
  "#fb923c", // orange-400
  "#f472b6", // pink-400
  "#facc15", // yellow-400
  "#2dd4bf", // teal-400
  "#c084fc", // purple-400
  "#60a5fa", // blue-400
];
const TOTAL_COLOR = "#94a3b8"; // slate-400 — soft grey dashed line

const accountTypeIconMap: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  bank: Landmark,
  wallet: Wallet,
  cash: Banknote,
};

function formatMAD(value: number): string {
  if (Math.abs(value) >= 1_000_000)
    return `${(value / 1_000_000).toFixed(1)}M MAD`;
  if (Math.abs(value) >= 1_000)
    return `${(value / 1_000).toFixed(1)}k MAD`;
  return `${value.toFixed(0)} MAD`;
}

function formatDateLabel(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year.slice(2)}`;
}

export function NetWorthClient({
  chartData,
  accountMeta,
}: {
  chartData: ChartRow[];
  accountMeta: AccountMeta[];
}) {
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  function toggle(key: string) {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  // Build shadcn ChartConfig from accounts + total series
  const chartConfig = useMemo<ChartConfig>(() => {
    const config: ChartConfig = {
      // Key must be a valid CSS ident suffix — use sanitised id
      total: { label: "Net Worth", color: TOTAL_COLOR },
    };
    accountMeta.forEach((acct, i) => {
      // Sanitise UUID: replace hyphens so key works as CSS variable suffix
      const safeKey = `acct_${acct.id.replaceAll("-", "_")}`;
      config[safeKey] = {
        label: acct.name,
        color: PALETTE[i % PALETTE.length],
      };
    });
    return config;
  }, [accountMeta]);

  // Remap chartData keys to use the sanitised keys expected by config
  const remappedData = useMemo(() => {
    return chartData.map((row) => {
      const newRow: ChartRow = { date: row.date, total: row["__total__"] };
      accountMeta.forEach((acct) => {
        const safeKey = `acct_${acct.id.replaceAll("-", "_")}`;
        newRow[safeKey] = row[acct.id];
      });
      return newRow;
    });
  }, [chartData, accountMeta]);

  const latest = remappedData.length ? remappedData[remappedData.length - 1] : null;
  // Always render the chart — the server guarantees at least a 30-day range
  const hasData = remappedData.length >= 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Net Worth</h1>
        <p className="text-muted-foreground">
          Historical balance tracking per account — all values in MAD
        </p>
      </div>

      {/* Current snapshot cards */}
      {latest && (
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>Total Net Worth</CardDescription>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatMAD(latest["total"] as number)}
              </div>
            </CardContent>
          </Card>
          {accountMeta.map((acct, i) => {
            const Icon = accountTypeIconMap[acct.type] || Wallet;
            const safeKey = `acct_${acct.id.replaceAll("-", "_")}`;
            const color = PALETTE[i % PALETTE.length];
            return (
              <Card key={acct.id}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardDescription className="truncate">{acct.name}</CardDescription>
                  <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                </CardHeader>
                <CardContent>
                  <div
                    className="text-xl font-bold font-mono"
                    style={{ color }}
                  >
                    {formatMAD(latest[safeKey] as number)}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Chart card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <CardTitle>Balance Over Time</CardTitle>
              <CardDescription className="mt-1">
                {hasData
                  ? "Toggle accounts on/off using the pills below"
                  : "Add transactions on the Accounts page to see balance history here"}
              </CardDescription>
            </div>
          </div>

          {/* Toggle pills */}
          {hasData && (
            <div className="flex flex-wrap gap-2 pt-1">
              {/* Total net worth toggle */}
              <button
                onClick={() => toggle("total")}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                  hidden.has("total")
                    ? "opacity-35 line-through"
                    : "opacity-100"
                }`}
                style={{ borderColor: TOTAL_COLOR, color: TOTAL_COLOR }}
              >
                <span
                  className="inline-block h-2 w-4 rounded-sm border-t-2 border-dashed"
                  style={{ borderColor: TOTAL_COLOR }}
                />
                Net Worth
              </button>

              {/* Per-account toggles */}
              {accountMeta.map((acct, i) => {
                const color = PALETTE[i % PALETTE.length];
                const safeKey = `acct_${acct.id.replaceAll("-", "_")}`;
                return (
                  <button
                    key={acct.id}
                    onClick={() => toggle(safeKey)}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                      hidden.has(safeKey)
                        ? "opacity-35 line-through"
                        : "opacity-100"
                    }`}
                    style={{ borderColor: color, color }}
                  >
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ background: color }}
                    />
                    {acct.name}
                  </button>
                );
              })}
            </div>
          )}
        </CardHeader>

        <CardContent>
          {!hasData ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
              No transaction history yet.
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="h-[380px] w-full">
              <LineChart
                data={remappedData as Record<string, unknown>[]}
                margin={{ top: 8, right: 16, left: 0, bottom: 4 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  className="stroke-border"
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDateLabel}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={48}
                />
                <YAxis
                  tickFormatter={formatMAD}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={88}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(label) =>
                        formatDateLabel(label as string)
                      }
                      formatter={(value, _name, _item, _index) => (
                        <span className="font-mono font-semibold tabular-nums">
                          {formatMAD(value as number)}
                        </span>
                      )}
                      indicator="line"
                    />
                  }
                />

                {/* Net Worth — dashed total line */}
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Net Worth"
                  stroke="var(--color-total)"
                  strokeWidth={2.5}
                  strokeDasharray="6 3"
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                  hide={hidden.has("total")}
                />

                {/* Per-account solid lines */}
                {accountMeta.map((acct) => {
                  const safeKey = `acct_${acct.id.replaceAll("-", "_")}`;
                  return (
                    <Line
                      key={acct.id}
                      type="monotone"
                      dataKey={safeKey}
                      name={acct.name}
                      stroke={`var(--color-${safeKey})`}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, strokeWidth: 0 }}
                      hide={hidden.has(safeKey)}
                    />
                  );
                })}
              </LineChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
