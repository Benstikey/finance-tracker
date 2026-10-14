"use client";

import * as React from "react";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { X } from "lucide-react";
import { SegmentedControl } from "@/components/metrics";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/*
 * KPI drilldown, modelled on the Arc Pro block of the same name
 * (uiarc.dev/components/blocks/kpi-drilldown). Same props, keyboard model and
 * accessibility notes; the implementation is our own.
 *
 * Every series is daily and ends on `end`. Give each one at least twice the
 * longest range (180 days) so the comparison period exists.
 */

export type KpiRange = "7" | "30" | "90";

// level: a balance, compared at the end of each period.
// total: a flow, summed over each period.
// rate:  a percentage, compared at the end of each period, change in points.
export type KpiKind = "level" | "total" | "rate";

export type KpiBreakdownRow = { id: string; label: string; series: number[] };

export type Kpi = {
  id: string;
  label: string;
  description?: string;
  kind?: KpiKind;
  lowerIsBetter?: boolean;
  format?: (value: number) => string;
  series: number[];
  /** Rows per dimension value, each with its own daily series. */
  breakdowns?: Record<string, KpiBreakdownRow[]>;
};

export type KpiDimension = { value: string; label: string };

type KpiDrilldownProps = {
  kpis: Kpi[];
  dimensions?: KpiDimension[];
  end?: string;
  defaultRange?: KpiRange;
  selected?: string | null;
  onSelectedChange?: (id: string | null) => void;
  title?: string;
  className?: string;
};

const RANGES: { value: KpiRange; label: string }[] = [
  { value: "7", label: "7D" },
  { value: "30", label: "30D" },
  { value: "90", label: "90D" },
];

const EASE = "cubic-bezier(0.2, 0, 0, 1)";
const DURATION = 400;

/* ── Period maths ───────────────────────────────────────────────────── */

const defaultFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

function fmt(kpi: Kpi, value: number) {
  if (kpi.format) return kpi.format(value);
  return kpi.kind === "rate" ? `${value.toFixed(1)}%` : defaultFormat.format(value);
}

/** Value for the period ending `offset` periods before the last day. */
function periodValue(series: number[], kind: KpiKind, days: number, offset: number) {
  const endIdx = series.length - 1 - offset * days;
  if (endIdx < 0) return 0;
  if (kind !== "total") return series[endIdx] ?? 0;
  let sum = 0;
  for (let i = Math.max(0, endIdx - days + 1); i <= endIdx; i++) sum += series[i];
  return sum;
}

type Change = { text: string; direction: "up" | "down" | "flat"; good: boolean | null };

function change(kind: KpiKind, current: number, previous: number, lowerIsBetter?: boolean): Change {
  const diff = current - previous;
  const flat = Math.abs(diff) < (kind === "rate" ? 0.05 : 0.5);
  const direction = flat ? "flat" : diff > 0 ? "up" : "down";
  const good = flat ? null : lowerIsBetter ? diff < 0 : diff > 0;
  const sign = diff > 0 ? "+" : diff < 0 ? "−" : "";
  let text: string;
  if (flat) text = "0%";
  else if (kind === "rate") text = `${sign}${Math.abs(diff).toFixed(1)} pts`;
  else if (previous === 0) text = "new";
  else text = `${sign}${Math.abs((diff / Math.abs(previous)) * 100).toFixed(1)}%`;
  return { text, direction, good };
}

function changeWords(c: Change) {
  return c.direction === "flat"
    ? "no change"
    : `${c.direction} ${c.text.replace(/^[+−]/, "")}`;
}

function dayLabel(end: string, daysBeforeEnd: number, withYear = false) {
  const d = new Date(end + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() - daysBeforeEnd);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: withYear ? "numeric" : undefined,
    timeZone: "UTC",
  });
}

function ChangeChip({ c }: { c: Change }) {
  return (
    <span
      className={cn(
        "rounded-md px-1.5 py-0.5 text-xs font-medium tabular-nums",
        c.good === null
          ? "bg-muted text-muted-foreground"
          : c.good
            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
            : "bg-red-500/10 text-red-700 dark:text-red-400"
      )}
    >
      {c.text}
    </span>
  );
}

/* ── SVG helpers ────────────────────────────────────────────────────── */

const VB_W = 1000;

// Monotone cubic interpolation (Fritsch–Carlson): no overshoot between points.
function monotonePath(points: [number, number][]) {
  const n = points.length;
  if (n === 0) return "";
  if (n === 1) return `M${points[0][0]},${points[0][1]}`;
  const dx: number[] = [];
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = points[i + 1][0] - points[i][0];
    slope[i] = (points[i + 1][1] - points[i][1]) / dx[i];
  }
  const t: number[] = [slope[0]];
  for (let i = 1; i < n - 1; i++) {
    t[i] = slope[i - 1] * slope[i] <= 0 ? 0 : (slope[i - 1] + slope[i]) / 2;
  }
  t[n - 1] = slope[n - 2];
  for (let i = 0; i < n - 1; i++) {
    if (slope[i] === 0) {
      t[i] = t[i + 1] = 0;
      continue;
    }
    const a = t[i] / slope[i];
    const b = t[i + 1] / slope[i];
    const h = a * a + b * b;
    if (h > 9) {
      const s = 3 / Math.sqrt(h);
      t[i] = s * a * slope[i];
      t[i + 1] = s * b * slope[i];
    }
  }
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const h = dx[i] / 3;
    d += `C${x0 + h},${y0 + t[i] * h},${x1 - h},${y1 - t[i + 1] * h},${x1},${y1}`;
  }
  return d;
}

function scaleY(values: number[], height: number, pad = 6) {
  const finite = values.filter((v) => Number.isFinite(v));
  let min = Math.min(...finite);
  let max = Math.max(...finite);
  if (min === max) {
    min -= 1;
    max += 1;
  }
  return {
    min,
    max,
    y: (v: number) => pad + (1 - (v - min) / (max - min)) * (height - pad * 2),
  };
}

function Sparkline({ values }: { values: number[] }) {
  const h = 32;
  const { y } = scaleY(values, h, 3);
  const pts = values.map((v, i) => [(i / Math.max(values.length - 1, 1)) * VB_W, y(v)] as [number, number]);
  return (
    <svg viewBox={`0 0 ${VB_W} ${h}`} preserveAspectRatio="none" className="h-8 w-full" aria-hidden>
      <path
        d={monotonePath(pts)}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/* ── Detail chart with a keyboard cursor ────────────────────────────── */

function DetailChart({
  kpi,
  current,
  previous,
  end,
  days,
  summaryId,
}: {
  kpi: Kpi;
  current: number[];
  previous: number[];
  end: string;
  days: number;
  summaryId: string;
}) {
  const H = 240;
  // Remounted per range (see `key` below), so the cursor starts on the last day.
  const [cursor, setCursor] = useState(current.length - 1);

  const { min, max, y } = scaleY([...current, ...previous], H);
  const x = (i: number) => (i / Math.max(current.length - 1, 1)) * VB_W;
  const curPts = current.map((v, i) => [x(i), y(v)] as [number, number]);
  const prevPts = previous.map((v, i) => [x(i), y(v)] as [number, number]);
  const line = monotonePath(curPts);
  const area = `${line}L${VB_W},${H}L0,${H}Z`;
  const ticks = [min, min + (max - min) / 2, max];

  const back = current.length - 1 - cursor; // days before `end`
  const readout = `${dayLabel(end, back, true)}: ${fmt(kpi, current[cursor])}${
    previous[cursor] !== undefined
      ? `, previous period ${dayLabel(end, back + days, true)}: ${fmt(kpi, previous[cursor])}`
      : ""
  }`;

  function onKeyDown(e: React.KeyboardEvent) {
    const last = current.length - 1;
    const next =
      e.key === "ArrowLeft"
        ? Math.max(0, cursor - 1)
        : e.key === "ArrowRight"
          ? Math.min(last, cursor + 1)
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (next === null) return;
    e.preventDefault();
    setCursor(next);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const f = (e.clientX - rect.left) / rect.width;
    setCursor(Math.round(Math.min(Math.max(f, 0), 1) * (current.length - 1)));
  }

  const cx = (x(cursor) / VB_W) * 100;
  const cy = (y(current[cursor]) / H) * 100;

  return (
    <div className="flex flex-col gap-2">
      <p aria-live="polite" className="min-h-4 text-xs text-muted-foreground tabular-nums">
        {readout}
      </p>
      <div className="flex gap-2">
        <div
          aria-hidden
          className="flex w-14 shrink-0 flex-col justify-between py-1 text-right text-[11px] text-muted-foreground tabular-nums"
        >
          {[...ticks].reverse().map((t, i) => (
            <span key={i}>{kpi.kind === "rate" ? `${t.toFixed(0)}%` : compact(t)}</span>
          ))}
        </div>
        <div
          role="group"
          tabIndex={0}
          aria-roledescription="chart"
          aria-label={`${kpi.label}, last ${days} days. Use left and right arrows to move through days.`}
          aria-describedby={summaryId}
          onKeyDown={onKeyDown}
          onPointerMove={onPointerMove}
          className="relative h-[200px] flex-1 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50 @min-[520px]:h-60"
        >
          <svg
            viewBox={`0 0 ${VB_W} ${H}`}
            preserveAspectRatio="none"
            className="absolute inset-0 size-full overflow-visible text-primary"
            aria-hidden
          >
            <defs>
              <linearGradient id={`${summaryId}-fill`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity={0.16} />
                <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
              </linearGradient>
            </defs>
            {ticks.map((t, i) => (
              <line
                key={i}
                x1={0}
                x2={VB_W}
                y1={y(t)}
                y2={y(t)}
                className="stroke-border"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {prevPts.length > 1 && (
              <path
                d={monotonePath(prevPts)}
                fill="none"
                className="stroke-muted-foreground"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                vectorEffect="non-scaling-stroke"
              />
            )}
            <path d={area} fill={`url(#${summaryId}-fill)`} />
            <path
              d={line}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
            />
            <line
              x1={x(cursor)}
              x2={x(cursor)}
              y1={0}
              y2={H}
              className="stroke-foreground/20"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <span
            aria-hidden
            className="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-2 ring-card"
            style={{ left: `${cx}%`, top: `${cy}%` }}
          />
        </div>
      </div>
      <div
        aria-hidden
        className="ml-16 flex justify-between text-[11px] text-muted-foreground tabular-nums"
      >
        <span>{dayLabel(end, current.length - 1)}</span>
        <span>{dayLabel(end, Math.floor((current.length - 1) / 2))}</span>
        <span>{dayLabel(end, 0)}</span>
      </div>
    </div>
  );
}

const compactFormat = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});
function compact(v: number) {
  return compactFormat.format(v);
}

/* ── Block ──────────────────────────────────────────────────────────── */

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(REDUCED_MOTION);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false
  );
}

export function KpiDrilldown({
  kpis,
  dimensions = [],
  end = new Date().toISOString().slice(0, 10),
  defaultRange = "30",
  selected: selectedProp,
  onSelectedChange,
  title = "Overview",
  className,
}: KpiDrilldownProps) {
  const uid = useId().replaceAll(":", "");
  const [range, setRange] = useState<KpiRange>(defaultRange);
  const days = Number(range);
  const [uncontrolled, setUncontrolled] = useState<string | null>(null);
  const controlled = selectedProp !== undefined;
  const selectedId = controlled ? selectedProp : uncontrolled;
  const openKpi = kpis.find((k) => k.id === selectedId) ?? null;

  const reduced = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef(new Map<string, HTMLButtonElement>());
  const closeRef = useRef<HTMLButtonElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  // The detail grows out of its card's rectangle and folds back into it.
  // `shownKpi` lags behind the selection while the fold-back runs.
  const [shownId, setShownId] = useState<string | null>(selectedId);
  const [clip, setClip] = useState<string | null>(null);
  const animateOpen = useRef(false);
  const returnFocus = useRef<string | null>(null);
  const shownKpi = kpis.find((k) => k.id === shownId) ?? null;

  function setSelected(id: string | null) {
    if (!controlled) setUncontrolled(id);
    onSelectedChange?.(id);
  }

  function cardInset(id: string) {
    const wrap = wrapRef.current?.getBoundingClientRect();
    const card = cardRefs.current.get(id)?.getBoundingClientRect();
    if (!wrap || !card) return null;
    const detailH = detailRef.current?.offsetHeight ?? wrap.height;
    return `inset(${card.top - wrap.top}px ${wrap.right - card.right}px ${Math.max(
      detailH - (card.bottom - wrap.top),
      0
    )}px ${card.left - wrap.left}px round 12px)`;
  }

  // Selection changed (click, Escape, or the URL): open or start folding back.
  useEffect(() => {
    if (selectedId && selectedId !== shownId) {
      animateOpen.current = !reduced && shownId === null && animateOpen.current;
      setShownId(selectedId);
    } else if (!selectedId && shownId) {
      const target = !reduced && cardInset(shownId);
      if (!target) {
        setShownId(null);
        return;
      }
      setClip(target);
      const t = setTimeout(() => {
        setShownId(null);
        setClip(null);
      }, DURATION);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  // After the detail mounts, start it clipped to the card, then expand.
  useLayoutEffect(() => {
    if (!shownId || !selectedId) return;
    closeRef.current?.focus({ preventScroll: true });
    if (!animateOpen.current) return;
    animateOpen.current = false;
    const start = cardInset(shownId);
    if (!start) return;
    setClip(start);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setClip("inset(0px 0px 0px 0px round 12px)"))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shownId]);

  // Escape folds back from anywhere inside the open detail.
  useEffect(() => {
    if (!openKpi) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openKpi]);

  function open(id: string) {
    animateOpen.current = true;
    setSelected(id);
  }

  function close() {
    returnFocus.current = selectedId;
    setSelected(null);
  }

  // Focus returns to the card once the grid is interactive again.
  useEffect(() => {
    if (shownId !== null || !returnFocus.current) return;
    cardRefs.current.get(returnFocus.current)?.focus({ preventScroll: true });
    returnFocus.current = null;
  }, [shownId]);

  const isOpen = shownKpi !== null;

  return (
    <section
      aria-labelledby={`${uid}-title`}
      className={cn("@container flex flex-col gap-4", className)}
    >
      <div className="flex flex-col gap-3 @min-[460px]:flex-row @min-[460px]:items-end @min-[460px]:justify-between">
        <div>
          <h1 id={`${uid}-title`} className="text-2xl font-semibold tracking-tight">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground">
            Last {days} days · compared with the {days} days before
          </p>
        </div>
        <SegmentedControl label="Date range" options={RANGES} value={range} onChange={setRange} />
      </div>

      <div ref={wrapRef} className="relative">
        <ul
          inert={isOpen}
          aria-hidden={isOpen || undefined}
          className={cn(
            "grid grid-cols-1 gap-3 transition-[opacity] duration-200 ease-out @min-[520px]:grid-cols-2 @min-[760px]:grid-cols-3",
            isOpen && "pointer-events-none absolute inset-x-0 top-0 opacity-0"
          )}
        >
          {kpis.map((kpi) => {
            const kind = kpi.kind ?? "level";
            const cur = periodValue(kpi.series, kind, days, 0);
            const prev = periodValue(kpi.series, kind, days, 1);
            const c = change(kind, cur, prev, kpi.lowerIsBetter);
            const value = fmt(kpi, cur);
            return (
              <li key={kpi.id}>
                <button
                  ref={(el) => {
                    if (el) cardRefs.current.set(kpi.id, el);
                    else cardRefs.current.delete(kpi.id);
                  }}
                  type="button"
                  aria-expanded={selectedId === kpi.id}
                  aria-controls={`${uid}-detail`}
                  aria-label={`${kpi.label}: ${value}, ${changeWords(c)} versus the previous ${days} days. Open details.`}
                  onClick={() => open(kpi.id)}
                  className="group flex w-full flex-col gap-1 rounded-xl bg-card p-4 text-left shadow-(--shadow-border) transition-[box-shadow,scale] duration-150 ease-out outline-none hover:shadow-(--shadow-border-hover) focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.96]"
                >
                  <span className="text-xs font-medium text-muted-foreground">{kpi.label}</span>
                  <span className="truncate text-2xl font-semibold tracking-tight tabular-nums">
                    {value}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <ChangeChip c={c} />
                    {c.direction === "flat" ? "no change" : `vs previous ${days}d`}
                  </span>
                  <span className="mt-2 text-primary/70 transition-[color] duration-150 group-hover:text-primary">
                    <Sparkline values={kpi.series.slice(-days)} />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {shownKpi && (
          <div
            ref={detailRef}
            id={`${uid}-detail`}
            role="region"
            aria-labelledby={`${uid}-detail-title`}
            style={{
              clipPath: clip ?? undefined,
              transition: clip && !reduced ? `clip-path ${DURATION}ms ${EASE}` : undefined,
            }}
            className="rounded-xl bg-card shadow-(--shadow-border)"
          >
            <Detail
              kpi={shownKpi}
              days={days}
              end={end}
              dimensions={dimensions}
              uid={uid}
              closeRef={closeRef}
              onClose={close}
            />
          </div>
        )}
      </div>
    </section>
  );
}

function Detail({
  kpi,
  days,
  end,
  dimensions,
  uid,
  closeRef,
  onClose,
}: {
  kpi: Kpi;
  days: number;
  end: string;
  dimensions: KpiDimension[];
  uid: string;
  closeRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}) {
  const kind = kpi.kind ?? "level";
  const cur = periodValue(kpi.series, kind, days, 0);
  const prev = periodValue(kpi.series, kind, days, 1);
  const c = change(kind, cur, prev, kpi.lowerIsBetter);

  const current = kpi.series.slice(-days);
  const previous = kpi.series.slice(-2 * days, -days);

  const available = dimensions.filter((d) => kpi.breakdowns?.[d.value]?.length);
  const [dim, setDim] = useState(available[0]?.value);
  const dimension = available.find((d) => d.value === dim) ?? available[0];

  const rows = useMemo(() => {
    if (!dimension) return [];
    return (kpi.breakdowns?.[dimension.value] ?? [])
      .map((r) => {
        const rc = periodValue(r.series, kind, days, 0);
        const rp = periodValue(r.series, kind, days, 1);
        return { ...r, current: rc, previous: rp, change: change(kind, rc, rp, kpi.lowerIsBetter) };
      })
      .filter((r) => r.current !== 0 || r.previous !== 0)
      .sort((a, b) => Math.abs(b.current) - Math.abs(a.current));
  }, [kpi, dimension, kind, days]);

  const summaryId = `${uid}-summary`;
  const first = current[0] ?? 0;
  const last = current.at(-1) ?? 0;
  const summary =
    `${kpi.label} over the last ${days} days: ${fmt(kpi, cur)}, ${changeWords(c)} versus ${fmt(kpi, prev)} in the previous ${days} days. ` +
    `Daily values went from ${fmt(kpi, first)} on ${dayLabel(end, current.length - 1, true)} to ${fmt(kpi, last)} on ${dayLabel(end, 0, true)}, ` +
    `ranging between ${fmt(kpi, Math.min(...current))} and ${fmt(kpi, Math.max(...current))}.`;

  return (
    <div className="flex flex-col gap-5 p-4 @min-[520px]:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 id={`${uid}-detail-title`} className="text-sm font-medium text-muted-foreground">
            {kpi.label}
          </h2>
          <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">{fmt(kpi, cur)}</p>
          <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <ChangeChip c={c} />
            <span>
              vs {fmt(kpi, prev)} in the previous {days} days
              {kind === "total" ? " (period total)" : ""}
            </span>
          </p>
          {kpi.description && (
            <p className="mt-2 max-w-prose text-sm text-muted-foreground">{kpi.description}</p>
          )}
        </div>
        <Button
          ref={closeRef}
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label={`Close ${kpi.label} details`}
        >
          <X />
        </Button>
      </div>

      <p id={summaryId} className="sr-only">
        {summary}
      </p>
      <DetailChart
        key={`${kpi.id}-${days}`}
        kpi={kpi}
        current={current}
        previous={previous}
        end={end}
        days={days}
        summaryId={summaryId}
      />

      {dimension && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-medium">Breakdown</h3>
            {available.length > 1 && (
              <SegmentedControl
                label="Break down by"
                options={available}
                value={dimension.value}
                onChange={setDim}
              />
            )}
          </div>
          {rows.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Nothing to break down in this period.
            </p>
          ) : (
            <table className="w-full text-sm">
              <caption className="sr-only">
                {kpi.label} by {dimension.label.toLowerCase()}, last {days} days versus the
                previous {days} days
              </caption>
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th scope="col" className="py-2 text-left font-medium">
                    {dimension.label}
                  </th>
                  <th scope="col" className="py-2 text-right font-medium">
                    Current
                  </th>
                  <th scope="col" className="hidden py-2 text-right font-medium @min-[520px]:table-cell">
                    Previous
                  </th>
                  <th scope="col" className="py-2 text-right font-medium">
                    Change
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((r) => (
                  <tr key={r.id}>
                    <th scope="row" className="max-w-0 truncate py-2 pr-3 text-left font-medium">
                      {r.label}
                    </th>
                    <td className="py-2 text-right font-mono tabular-nums">{fmt(kpi, r.current)}</td>
                    <td className="hidden py-2 text-right font-mono text-muted-foreground tabular-nums @min-[520px]:table-cell">
                      {fmt(kpi, r.previous)}
                    </td>
                    <td className="py-2 pl-3 text-right">
                      <ChangeChip c={r.change} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
