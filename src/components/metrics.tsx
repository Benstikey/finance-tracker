"use client";

import * as React from "react";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, Line, XAxis, YAxis } from "recharts";
import { Check, Download } from "lucide-react";
import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { IconSwap } from "@/components/ui/icon-swap";
import { cn } from "@/lib/utils";
import { useMoney } from "@/components/display-currency";

/* ── Formatting ─────────────────────────────────────────────────────── */

export const madFormat = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});
export const compactFormat = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatDay(day: string, withYear = false) {
  return new Date(day + "T00:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: withYear ? "numeric" : undefined,
    timeZone: "UTC",
  });
}

export const RANGES = [
  { days: 30, label: "30D", long: "Last 30 days" },
  { days: 90, label: "90D", long: "Last 90 days" },
  { days: 365, label: "1Y", long: "Last 12 months" },
] as const;

/* ── Layout ─────────────────────────────────────────────────────────── */

// Pages using these blocks wrap their content in `@container` so the
// breakpoints follow the content width rather than the viewport.
export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 @min-[460px]:flex-row @min-[460px]:items-end @min-[460px]:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 *:flex-1 @min-[460px]:*:flex-none">
          {actions}
        </div>
      )}
    </div>
  );
}

export function Panel({
  className,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl bg-card shadow-(--shadow-border)",
        className
      )}
      {...props}
    />
  );
}

export function PanelHeader({
  title,
  children,
}: {
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-3 @min-[460px]:px-5">
      <h2 className="text-sm font-medium">{title}</h2>
      {children}
    </div>
  );
}

/* ── Controls ───────────────────────────────────────────────────────── */

export function SegmentedControl<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="flex rounded-lg bg-muted p-0.5">
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
          className="h-7 flex-1 rounded-md px-3 text-xs font-medium text-muted-foreground transition-[color,background-color,box-shadow] duration-150 ease-out hover:text-foreground aria-pressed:bg-card aria-pressed:text-foreground aria-pressed:shadow-(--shadow-border)"
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function RangeControl({
  value,
  onChange,
}: {
  value: number;
  onChange: (days: number) => void;
}) {
  return (
    <SegmentedControl
      label="Date range"
      options={RANGES.map((r) => ({ value: r.days as number, label: r.label }))}
      value={value}
      onChange={onChange}
    />
  );
}

export function ExportButton({
  filename,
  header,
  rows,
}: {
  filename: string;
  header: string[];
  rows: (string | number)[][];
}) {
  const [exported, setExported] = useState(false);

  function handleExport() {
    const escape = (v: string | number) => {
      const s = String(v);
      return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
    };
    const csv = [header, ...rows].map((r) => r.map(escape).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  }

  return (
    <Button variant="outline" onClick={handleExport}>
      <IconSwap
        active={exported}
        activeIcon={<Check />}
        inactiveIcon={<Download />}
      />
      {exported ? "Exported" : "Export"}
    </Button>
  );
}

/* ── Metric tabs ────────────────────────────────────────────────────── */

export function DeltaBadge({
  first,
  last,
  lowerIsBetter,
}: {
  first: number;
  last: number;
  lowerIsBetter?: boolean;
}) {
  const diff = last - first;
  const pct = first === 0 ? null : (diff / Math.abs(first)) * 100;
  const flat = Math.round(diff) === 0;
  const good = lowerIsBetter ? diff < 0 : diff > 0;
  const sign = diff > 0 ? "+" : diff < 0 ? "−" : "";
  const text =
    pct === null
      ? `${sign}${compactFormat.format(Math.abs(diff))}`
      : `${sign}${Math.abs(pct).toFixed(1)}%`;

  return (
    <span className="flex items-center gap-1.5 text-xs">
      <span
        className={cn(
          "rounded-md px-1.5 py-0.5 font-medium tabular-nums",
          flat
            ? "bg-muted text-muted-foreground"
            : good
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              : "bg-red-500/10 text-red-700 dark:text-red-400"
        )}
      >
        {flat ? "0%" : text}
      </span>
      <span className="text-muted-foreground">
        {flat ? "no change" : diff > 0 ? "up vs previous" : "down vs previous"}
      </span>
    </span>
  );
}

export type MetricTab<K extends string> = {
  key: K;
  label: string;
  value: React.ReactNode;
  footer?: React.ReactNode;
};

// A row of KPI tiles that double as tabs: 2 columns, 4 from 640px.
// Without `onChange` the tiles are a static stat strip.
export function MetricTabs<K extends string>({
  label,
  tabs,
  value,
  onChange,
  className,
}: {
  label: string;
  tabs: MetricTab<K>[];
  value?: K;
  onChange?: (key: K) => void;
  className?: string;
}) {
  const interactive = !!onChange;
  return (
    <div
      role={interactive ? "tablist" : undefined}
      aria-label={label}
      className={cn(
        "grid grid-cols-2 gap-px bg-border @min-[640px]:grid-cols-4",
        className
      )}
    >
      {tabs.map((t) => {
        const selected = interactive && t.key === value;
        const body = (
          <>
            <span
              className={cn(
                "truncate text-xs font-medium transition-[color] duration-150",
                selected || !interactive
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {t.label}
            </span>
            <span className="max-w-full truncate text-lg font-semibold tracking-tight tabular-nums @min-[460px]:text-2xl">
              {t.value}
            </span>
            {t.footer && (
              <span className="text-xs text-muted-foreground">{t.footer}</span>
            )}
          </>
        );
        const tileClass =
          "relative flex min-w-0 flex-col items-start gap-1 bg-card px-4 py-4 text-left @min-[460px]:px-5";

        if (!interactive) {
          return (
            <div key={t.key} className={tileClass}>
              {body}
            </div>
          );
        }
        return (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(t.key)}
            className={cn(
              tileClass,
              "transition-[background-color] duration-150 ease-out hover:bg-muted/50"
            )}
          >
            {body}
            <span
              aria-hidden
              className={cn(
                "absolute inset-x-0 bottom-0 h-0.5 origin-left bg-primary transition-[scale] duration-200 ease-[cubic-bezier(0.2,0,0,1)]",
                selected ? "scale-x-100" : "scale-x-0"
              )}
            />
          </button>
        );
      })}
      {/* Fill the last row so the grid background doesn't show through. */}
      {Array.from({ length: (4 - (tabs.length % 4)) % 4 }, (_, i) => (
        <div
          key={`fill-${i}`}
          aria-hidden
          className={cn(
            "bg-card",
            // On 2 columns, only an odd count leaves a gap.
            i >= (2 - (tabs.length % 2)) % 2 && "hidden @min-[640px]:block"
          )}
        />
      ))}
    </div>
  );
}

/* ── Ranked list ────────────────────────────────────────────────────── */

export type RankedItem = { label: string; hint?: string; value: number };

export function RankedList({
  title,
  unit,
  items,
  empty,
  format = (v) => madFormat.format(v),
}: {
  title: string;
  unit: string;
  items: RankedItem[];
  empty: string;
  format?: (value: number) => string;
}) {
  const max = Math.max(...items.map((i) => Math.abs(i.value)), 1);
  return (
    <section className="rounded-xl bg-card p-2 shadow-(--shadow-border)">
      <div className="flex items-center justify-between px-2 pt-1 pb-2 text-xs font-medium text-muted-foreground">
        <h2>{title}</h2>
        <span>{unit}</span>
      </div>
      {items.length === 0 ? (
        <p className="px-2 py-6 text-center text-sm text-muted-foreground">
          {empty}
        </p>
      ) : (
        <ul className="space-y-0.5">
          {items.map((item) => (
            <li
              key={item.label}
              className="relative flex items-center justify-between gap-3 overflow-hidden rounded-md px-2 py-1.5 text-sm"
            >
              <span
                aria-hidden
                className={cn(
                  "absolute inset-y-0 left-0 rounded-md",
                  item.value < 0 ? "bg-red-500/8" : "bg-primary/8"
                )}
                style={{ width: `${(Math.abs(item.value) / max) * 100}%` }}
              />
              <span className="relative flex min-w-0 items-center gap-2">
                <span className="truncate font-medium">{item.label}</span>
                {item.hint && (
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {item.hint}
                  </span>
                )}
              </span>
              <span className="relative shrink-0 font-mono tabular-nums">
                {format(item.value)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ── Trend chart ────────────────────────────────────────────────────── */

export type TrendPoint = {
  date: string;
  value: number;
  previous?: number;
  previousDate?: string;
};

// Builds chart points for the last `days` days, paired with the period before.
export function toTrend<R extends { date: string }>(
  history: R[],
  days: number,
  pick: (row: R) => number
): TrendPoint[] {
  const current = history.slice(-(days + 1));
  const previous = history.slice(-(2 * days + 1), -days);
  return current.map((row, i) => ({
    date: row.date,
    value: pick(row),
    previous: previous[i] ? pick(previous[i]) : undefined,
    previousDate: previous[i]?.date,
  }));
}

export function TrendChart({
  data,
  label,
  compare,
}: {
  data: TrendPoint[];
  label: string;
  compare: boolean;
}) {
  const id = React.useId().replaceAll(":", "");
  const { format: formatMoney } = useMoney();
  const chartConfig: ChartConfig = {
    value: { label, color: "var(--primary)" },
    previous: { label: "Previous period", color: "var(--muted-foreground)" },
  };

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[168px] w-full @min-[460px]:h-[260px]"
    >
      <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`fill-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-value)" stopOpacity={0.18} />
            <stop offset="100%" stopColor="var(--color-value)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} className="stroke-border" />
        <XAxis
          dataKey="date"
          tickFormatter={(d) => formatDay(d)}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={40}
        />
        <YAxis
          tickFormatter={(v) => compactFormat.format(v)}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={44}
          domain={["auto", "auto"]}
        />
        <ChartTooltip
          cursor={{ stroke: "var(--border)" }}
          content={({ active, payload }) => {
            const row = payload?.[0]?.payload as TrendPoint | undefined;
            if (!active || !row) return null;
            return (
              <div className="grid min-w-40 gap-1.5 rounded-lg bg-popover px-2.5 py-2 text-xs shadow-(--shadow-border-hover)">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">
                    {formatDay(row.date, true)}
                  </span>
                  <span className="font-mono font-medium tabular-nums">
                    {formatMoney(row.value)}
                  </span>
                </div>
                {compare && row.previousDate && row.previous != null && (
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">
                      {formatDay(row.previousDate, true)}
                    </span>
                    <span className="font-mono text-muted-foreground tabular-nums">
                      {formatMoney(row.previous)}
                    </span>
                  </div>
                )}
              </div>
            );
          }}
        />
        {compare && (
          <Line
            type="monotone"
            dataKey="previous"
            stroke="var(--color-previous)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
        )}
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--color-value)"
          strokeWidth={2}
          fill={`url(#fill-${id})`}
          dot={false}
          activeDot={{ r: 3.5, strokeWidth: 0 }}
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  );
}

export function CompareToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-3.5 accent-primary"
      />
      Compare to previous period
    </label>
  );
}
