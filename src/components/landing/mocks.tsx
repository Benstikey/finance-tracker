// Monochrome mockups of the app's own screens, used on the landing page.
// Sample data only; nothing here touches real accounts.

import { cn } from "@/lib/utils";

const ink = "text-[#0a0a0a]";
const muted = "text-[#737373]";
const card =
  "rounded-[10px] bg-white shadow-[0_1px_1.5px_#0000000a,inset_0_0_0_1px_#0a0a0a0e]";

function linePath(values: number[], w: number, h: number, pad = 4) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const y = (v: number) => pad + (1 - (v - min) / (max - min || 1)) * (h - pad * 2);
  const x = (i: number) => (i / (values.length - 1)) * w;
  return values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");
}

const NET_WORTH = [96, 98, 97, 101, 104, 103, 107, 110, 108, 113, 117, 116, 121, 125, 124, 129, 133, 131, 136, 142];
const PREVIOUS = [90, 91, 93, 92, 94, 96, 95, 97, 99, 98, 100, 101, 103, 102, 104, 106, 105, 107, 108, 110];

export function Sparkline({
  values = NET_WORTH,
  className,
}: {
  values?: number[];
  className?: string;
}) {
  return (
    <svg viewBox="0 0 200 48" preserveAspectRatio="none" className={cn("w-full", className)} aria-hidden>
      <path d={`${linePath(values, 200, 48)}L200,48L0,48Z`} fill="#0a0a0a" opacity={0.05} />
      <path d={linePath(values, 200, 48)} fill="none" stroke="#0a0a0a" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function Kpi({ label, value, change, down }: { label: string; value: string; change: string; down?: boolean }) {
  return (
    <div className={cn(card, "flex flex-col gap-0.5 p-3")}>
      <span className={cn("text-[10px] font-medium", muted)}>{label}</span>
      <span className={cn("text-[15px] font-semibold tracking-tight tabular-nums", ink)}>{value}</span>
      <span className="flex items-center gap-1 text-[9px] text-[#737373]">
        <span className={cn("rounded px-1 py-px font-medium", down ? "bg-[#0000000a] text-[#737373]" : "bg-[#0a0a0a] text-white")}>
          {change}
        </span>
        vs previous 30d
      </span>
    </div>
  );
}

/* ── Full screens for the tabbed section ────────────────────────────── */

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  const nav = ["Dashboard", "Accounts", "Net Worth", "Cash Flow", "Objectives", "Loans"];
  return (
    <div className="flex h-[440px] bg-[#fafafa] text-left sm:h-[480px]">
      <aside className="hidden w-40 shrink-0 flex-col gap-0.5 border-r border-[#0a0a0a0e] bg-[#fcfcfc] p-3 sm:flex">
        <div className="mb-3 flex items-center gap-2 px-1.5">
          <span className="size-4 rounded-[5px] bg-[#0a0a0a]" />
          <span className={cn("text-[12px] font-semibold", ink)}>Finance</span>
        </div>
        {nav.map((n) => (
          <span
            key={n}
            className={cn(
              "rounded-md px-2 py-1.5 text-[11px] font-medium",
              n === title ? "bg-[#0000000a] text-[#0a0a0a]" : muted
            )}
          >
            {n}
          </span>
        ))}
      </aside>
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <span className={cn("text-[15px] font-semibold tracking-tight", ink)}>{title}</span>
          <span className="flex rounded-md bg-[#0000000a] p-0.5 text-[10px] font-medium">
            {["7D", "30D", "90D"].map((r) => (
              <span key={r} className={cn("rounded px-2 py-0.5", r === "30D" ? "bg-white text-[#0a0a0a] shadow-[0_0_0_1px_#0a0a0a0e]" : muted)}>
                {r}
              </span>
            ))}
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

export function DashboardScreen() {
  return (
    <Shell title="Dashboard">
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
        <Kpi label="Net worth" value="142,800 MAD" change="+8.4%" />
        <Kpi label="Owed to me" value="2,500 MAD" change="−20.0%" down />
        <Kpi label="Net transactions" value="+6,240 MAD" change="+12.1%" />
      </div>
      <div className={cn(card, "flex flex-1 flex-col gap-2 p-3")}>
        <span className={cn("text-[11px] font-medium", ink)}>Net worth</span>
        <svg viewBox="0 0 400 140" preserveAspectRatio="none" className="h-full min-h-0 w-full flex-1" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={0} x2={400} y1={10 + i * 40} y2={10 + i * 40} stroke="#e5e5e5" vectorEffect="non-scaling-stroke" />
          ))}
          <path d={linePath(PREVIOUS, 400, 140, 14)} fill="none" stroke="#a3a3a3" strokeDasharray="4 4" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
          <path d={`${linePath(NET_WORTH, 400, 140, 14)}L400,140L0,140Z`} fill="#0a0a0a" opacity={0.05} />
          <path d={linePath(NET_WORTH, 400, 140, 14)} fill="none" stroke="#0a0a0a" strokeWidth={2} vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
    </Shell>
  );
}

const ACCOUNTS = [
  { name: "CIH Bank", type: "Bank", cur: "MAD", bal: "84,200.00", share: 59 },
  { name: "Wise", type: "Wallet", cur: "EUR", bal: "3,120.00", share: 24 },
  { name: "Revolut", type: "Wallet", cur: "USD", bal: "1,480.00", share: 10 },
  { name: "Cash", type: "Cash", cur: "MAD", bal: "9,600.00", share: 7 },
];

export function AccountsScreen() {
  return (
    <Shell title="Accounts">
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {[
          ["All accounts", "142,800"],
          ["Bank", "84,200"],
          ["Digital Wallet", "49,000"],
          ["Cash", "9,600"],
        ].map(([l, v]) => (
          <div key={l} className={cn(card, "p-3")}>
            <p className={cn("text-[10px] font-medium", muted)}>{l}</p>
            <p className={cn("text-[14px] font-semibold tabular-nums", ink)}>{v} MAD</p>
          </div>
        ))}
      </div>
      <div className={cn(card, "flex-1 overflow-hidden")}>
        <div className={cn("grid grid-cols-[1.4fr_1fr_1fr] border-b border-[#e5e5e5] px-3 py-2 text-[10px] font-medium", muted)}>
          <span>Account</span>
          <span>Share</span>
          <span className="text-right">Balance</span>
        </div>
        {ACCOUNTS.map((a) => (
          <div key={a.name} className="grid grid-cols-[1.4fr_1fr_1fr] items-center border-b border-[#f0f0f0] px-3 py-2.5 text-[11px] last:border-0">
            <span className={cn("font-medium", ink)}>
              {a.name} <span className={muted}>· {a.type}</span>
            </span>
            <span className="mr-4 h-1 rounded-full bg-[#0000000a]">
              <span className="block h-1 rounded-full bg-[#0a0a0a]" style={{ width: `${a.share}%` }} />
            </span>
            <span className={cn("text-right font-mono tabular-nums", ink)}>
              {a.bal} <span className={muted}>{a.cur}</span>
            </span>
          </div>
        ))}
      </div>
    </Shell>
  );
}

const LOANS = [
  { who: "Yassine", what: "Laptop", amt: "+4,500 MAD" },
  { who: "Sara", what: "Trip deposit", amt: "+1,200 MAD" },
  { who: "Omar", what: "Dinner", amt: "−350 MAD" },
  { who: "Lina", what: "Concert tickets", amt: "−800 MAD" },
];

export function LoansScreen() {
  return (
    <Shell title="Loans">
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        <Kpi label="Owed to me" value="5,700 MAD" change="+3 loans" />
        <Kpi label="I owe" value="1,150 MAD" change="2 loans" down />
        <div className="hidden lg:contents">
          <Kpi label="Net position" value="+4,550 MAD" change="in favour" />
          <Kpi label="Settled" value="12,300 MAD" change="9 loans" down />
        </div>
      </div>
      <div className={cn(card, "flex-1 divide-y divide-[#f0f0f0] overflow-hidden")}>
        {LOANS.map((l) => (
          <div key={l.who} className="flex items-center justify-between px-3 py-2.5 text-[11px]">
            <span className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-full bg-[#0000000a] text-[10px] font-medium text-[#0a0a0a]">
                {l.who[0]}
              </span>
              <span>
                <span className={cn("block font-medium", ink)}>{l.who}</span>
                <span className={muted}>{l.what}</span>
              </span>
            </span>
            <span className={cn("font-mono tabular-nums", ink)}>{l.amt}</span>
          </div>
        ))}
      </div>
    </Shell>
  );
}

export function CashFlowScreen() {
  const events: Record<number, string> = { 1: "Salary", 5: "Rent", 12: "Gym", 15: "Freelance", 22: "Internet", 28: "Savings" };
  return (
    <Shell title="Cash Flow">
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {[
          ["Income / month", "+18,500"],
          ["Expenses / month", "−9,240"],
          ["Net / month", "+9,260"],
          ["End balance", "152,060"],
        ].map(([l, v]) => (
          <div key={l} className={cn(card, "p-3")}>
            <p className={cn("text-[10px] font-medium", muted)}>{l}</p>
            <p className={cn("text-[14px] font-semibold tabular-nums", ink)}>{v} MAD</p>
          </div>
        ))}
      </div>
      <div className={cn(card, "grid flex-1 grid-cols-7 gap-px overflow-hidden bg-[#f0f0f0] p-px")}>
        {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
          <div key={d} className="flex flex-col gap-0.5 bg-white p-1.5">
            <span className={cn("text-[9px] tabular-nums", muted)}>{d}</span>
            {events[d] && (
              <span className={cn("truncate rounded-sm bg-[#0000000a] px-1 text-[8px] font-medium", ink)}>{events[d]}</span>
            )}
          </div>
        ))}
      </div>
    </Shell>
  );
}

function Ring({ value, size = 64 }: { value: number; size?: number }) {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90" aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#0000000f" strokeWidth={6} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#0a0a0a"
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - value / 100)}
      />
    </svg>
  );
}

const GOALS = [
  { name: "Yamaha Tracer 9", saved: "92,480", target: "136,000", pct: 68 },
  { name: "Emergency fund", saved: "41,000", target: "50,000", pct: 82 },
  { name: "Lisbon trip", saved: "6,300", target: "18,000", pct: 35 },
];

export function GoalsScreen() {
  return (
    <Shell title="Objectives">
      <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-3">
        {GOALS.map((g) => (
          <div key={g.name} className={cn(card, "flex flex-col items-center justify-center gap-3 p-4")}>
            <div className="relative grid place-items-center">
              <Ring value={g.pct} size={84} />
              <span className={cn("absolute text-[13px] font-semibold tabular-nums", ink)}>{g.pct}%</span>
            </div>
            <div className="text-center">
              <p className={cn("text-[12px] font-medium", ink)}>{g.name}</p>
              <p className={cn("text-[10px] tabular-nums", muted)}>
                {g.saved} / {g.target} MAD
              </p>
            </div>
          </div>
        ))}
      </div>
    </Shell>
  );
}

/* ── Small tiles for the hero wall ──────────────────────────────────── */

export function WallTile({ variant }: { variant: number }) {
  const base = cn(card, "flex h-full flex-col gap-2 p-4 text-left");
  switch (variant % 6) {
    case 0:
      return (
        <div className={base}>
          <span className={cn("text-[12px] font-medium", muted)}>Net worth</span>
          <span className={cn("text-[24px] font-semibold tracking-tight", ink)}>142,800 MAD</span>
          <Sparkline className="mt-auto h-20" />
        </div>
      );
    case 1:
      return (
        <div className={base}>
          {ACCOUNTS.map((a) => (
            <div key={a.name} className="flex items-center justify-between border-b border-[#f0f0f0] pb-2 text-[13px] last:border-0">
              <span className={cn("font-medium", ink)}>{a.name}</span>
              <span className={cn("font-mono", muted)}>
                {a.bal} {a.cur}
              </span>
            </div>
          ))}
        </div>
      );
    case 2:
      return (
        <div className={cn(base, "flex-row items-center gap-5")}>
          <div className="relative grid place-items-center">
            <Ring value={68} size={110} />
            <span className={cn("absolute text-[18px] font-semibold", ink)}>68%</span>
          </div>
          <div>
            <p className={cn("text-[15px] font-medium", ink)}>Yamaha Tracer 9</p>
            <p className={cn("text-[12px]", muted)}>92,480 / 136,000 MAD</p>
          </div>
        </div>
      );
    case 3:
      return (
        <div className={base}>
          {LOANS.slice(0, 3).map((l) => (
            <div key={l.who} className="flex items-center justify-between text-[13px]">
              <span className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-full bg-[#0000000a] text-[11px] font-medium">{l.who[0]}</span>
                <span className={cn("font-medium", ink)}>{l.who}</span>
              </span>
              <span className={cn("font-mono", ink)}>{l.amt}</span>
            </div>
          ))}
        </div>
      );
    case 4:
      return (
        <div className={cn(base, "grid grid-cols-7 gap-1")}>
          {Array.from({ length: 21 }, (_, i) => (
            <span
              key={i}
              className={cn("rounded-[4px]", [2, 6, 9, 13, 17].includes(i) ? "bg-[#0a0a0a]" : "bg-[#0000000a]")}
            />
          ))}
        </div>
      );
    default:
      return (
        <div className={base}>
          <span className={cn("text-[12px] font-medium", muted)}>Held in foreign currency</span>
          <span className={cn("text-[24px] font-semibold tracking-tight", ink)}>34.2%</span>
          <div className="mt-auto flex gap-1.5">
            {["MAD", "EUR", "USD"].map((c, i) => (
              <span
                key={c}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-medium",
                  i === 0 ? "bg-[#0a0a0a] text-white" : "bg-[#0000000a] text-[#0a0a0a]"
                )}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      );
  }
}
