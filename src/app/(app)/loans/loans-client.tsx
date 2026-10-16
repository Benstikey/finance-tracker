"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  addRepayment,
  createLoan,
  deleteLoan,
  deleteRepayment,
  toggleLoanSettled,
  updateLoan,
} from "./actions";
import type { LoanWithCurrency, Currency } from "@/lib/types/database";
import {
  convertCurrency,
  formatCurrency,
  type ExchangeRates,
} from "@/lib/exchange-rates";
import {
  madFormat,
  MetricTabs,
  PageHeader,
  Panel,
  PanelHeader,
  RankedList,
} from "@/components/metrics";
import { useMoney } from "@/components/display-currency";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Pencil,
  Trash2,
  Check,
  Undo2,
  Handshake,
  HandCoins,
  ChevronDown,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconSwap } from "@/components/ui/icon-swap";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

function CurrencySelect({
  currencies,
  value,
  onChange,
}: {
  currencies: Currency[];
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>Currency</Label>
      <div className="grid grid-cols-3 gap-2">
        {currencies.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onChange(c.id)}
            className={`flex items-center gap-2 rounded-lg border p-2.5 text-sm transition-colors ${
              value === c.id
                ? "border-primary bg-primary/5 font-medium"
                : "border-border hover:border-primary/50"
            }`}
          >
            <span className="text-base">{c.symbol}</span>
            <span>{c.code}</span>
          </button>
        ))}
      </div>
      <input type="hidden" name="currency_id" value={value} />
    </div>
  );
}

function LoanForm({
  currencies,
  loan,
  defaultDirection,
  onDone,
}: {
  currencies: Currency[];
  loan?: LoanWithCurrency;
  defaultDirection: "lent" | "borrowed";
  onDone: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [currencyId, setCurrencyId] = useState(
    loan?.currency_id || currencies[0]?.id || ""
  );
  const [direction, setDirection] = useState<"lent" | "borrowed">(
    loan?.direction || defaultDirection
  );
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("direction", direction);
    try {
      if (loan) {
        formData.set("id", loan.id);
        await updateLoan(formData);
      } else {
        await createLoan(formData);
      }
      router.refresh();
      onDone();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Direction toggle */}
      <div className="space-y-2">
        <Label>Direction</Label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setDirection("lent")}
            className={`flex items-center gap-2 rounded-lg border p-3 text-sm transition-colors ${
              direction === "lent"
                ? "border-primary bg-primary/5 font-medium"
                : "border-border hover:border-primary/50"
            }`}
          >
            <ArrowUpRight className="h-4 w-4" />
            They owe me
          </button>
          <button
            type="button"
            onClick={() => setDirection("borrowed")}
            className={`flex items-center gap-2 rounded-lg border p-3 text-sm transition-colors ${
              direction === "borrowed"
                ? "border-primary bg-primary/5 font-medium"
                : "border-border hover:border-primary/50"
            }`}
          >
            <ArrowDownLeft className="h-4 w-4" />
            I owe them
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="person">
          {direction === "lent" ? "Who owes you?" : "Who do you owe?"}
        </Label>
        <Input
          id="person"
          name="person"
          defaultValue={loan?.person}
          placeholder="e.g. Ahmed, Sarah"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          defaultValue={loan?.amount}
          placeholder="500"
          required
        />
      </div>

      <CurrencySelect
        currencies={currencies}
        value={currencyId}
        onChange={setCurrencyId}
      />

      <div className="space-y-2">
        <Label htmlFor="description">What for? (optional)</Label>
        <Input
          id="description"
          name="description"
          defaultValue={loan?.description || ""}
          placeholder="e.g. Dinner, laptop purchase"
        />
      </div>

      <Button type="submit" className="w-full h-11" disabled={loading}>
        {loading ? "Saving..." : loan ? "Update Loan" : "Add Loan"}
      </Button>
    </form>
  );
}

function outstanding(loan: LoanWithCurrency) {
  return loan.settled ? 0 : Math.max(loan.amount - loan.repaid, 0);
}

function RepaymentForm({
  loan,
  onDone,
}: {
  loan: LoanWithCurrency;
  onDone: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];
  const left = outstanding(loan);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("loan_id", loan.id);
    try {
      await addRepayment(formData);
      router.refresh();
      onDone();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="repay-amount">Amount ({loan.currencies.code})</Label>
          <Input
            id="repay-amount"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            defaultValue={left || ""}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="repay-date">Date</Label>
          <Input id="repay-date" name="date" type="date" defaultValue={today} max={today} required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="repay-note">Note (optional)</Label>
        <Input id="repay-note" name="note" placeholder="e.g. Bank transfer" />
      </div>
      <p className="text-xs text-muted-foreground">
        {formatCurrency(left, loan.currencies.code)} left of{" "}
        {formatCurrency(loan.amount, loan.currencies.code)}. Repaying it all marks the loan settled.
      </p>
      <Button type="submit" className="w-full h-11" disabled={loading}>
        {loading ? "Saving..." : "Record repayment"}
      </Button>
    </form>
  );
}

function LoanCard({
  loan,
  onEdit,
  onDelete,
  onToggleSettled,
}: {
  loan: LoanWithCurrency;
  onEdit: () => void;
  onDelete: () => void;
  onToggleSettled: () => void;
}) {
  const [repayOpen, setRepayOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  const code = loan.currencies.code;
  const left = outstanding(loan);
  const repaidShare = loan.amount > 0 ? Math.min(loan.repaid / loan.amount, 1) : 0;
  const hasRepayments = loan.repayments.length > 0;
  const verb = loan.direction === "lent" ? "repaid to you" : "repaid";

  async function handleDeleteRepayment(id: string) {
    if (!confirm("Remove this repayment?")) return;
    setDeleting(id);
    try {
      await deleteRepayment(id);
      router.refresh();
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className={`transition-opacity ${loan.settled ? "opacity-50" : ""}`}>
      <div className="flex items-center justify-between gap-3 px-4 py-3 @min-[460px]:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
            {loan.direction === "lent" ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownLeft className="h-4 w-4" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium">{loan.person}</p>
            <div className="mt-0.5 flex flex-wrap items-center gap-2">
              {loan.description && (
                <span className="text-xs text-muted-foreground">{loan.description}</span>
              )}
              {loan.settled && (
                <Badge variant="secondary" className="text-xs">
                  Settled
                </Badge>
              )}
            </div>
            {hasRepayments && !loan.settled && (
              <div className="mt-1.5 flex items-center gap-2">
                <span className="h-1 w-24 overflow-hidden rounded-full bg-muted">
                  <span
                    className="block h-full rounded-full bg-primary"
                    style={{ width: `${repaidShare * 100}%` }}
                  />
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {formatCurrency(loan.repaid, code)} {verb}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-mono font-semibold tabular-nums">
              {formatCurrency(loan.settled ? loan.amount : left, code)}
            </p>
            {hasRepayments && !loan.settled && (
              <p className="text-xs text-muted-foreground tabular-nums">
                of {formatCurrency(loan.amount, code)}
              </p>
            )}
          </div>
          <div className="flex gap-0.5">
            {!loan.settled && (
              <Dialog open={repayOpen} onOpenChange={setRepayOpen}>
                <DialogTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      title="Record a repayment"
                      aria-label={`Record a repayment for ${loan.person}`}
                    />
                  }
                >
                  <HandCoins className="h-3.5 w-3.5" />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Repayment — {loan.person}</DialogTitle>
                    <DialogDescription>
                      Record part or all of what{" "}
                      {loan.direction === "lent" ? `${loan.person} paid you back` : `you paid back`}.
                    </DialogDescription>
                  </DialogHeader>
                  <RepaymentForm loan={loan} onDone={() => setRepayOpen(false)} />
                </DialogContent>
              </Dialog>
            )}
            {hasRepayments && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                aria-expanded={historyOpen}
                title={historyOpen ? "Hide repayments" : "Show repayments"}
                onClick={() => setHistoryOpen((v) => !v)}
              >
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-[rotate] duration-200 ease-[cubic-bezier(0.2,0,0,1)] ${
                    historyOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={onToggleSettled}
              title={loan.settled ? "Mark unsettled" : "Mark settled"}
            >
              <IconSwap
                active={loan.settled}
                activeIcon={<Undo2 className="h-3.5 w-3.5" />}
                inactiveIcon={<Check className="h-3.5 w-3.5" />}
              />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onEdit} title="Edit">
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-destructive"
              onClick={onDelete}
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {historyOpen && hasRepayments && (
        <ul className="mx-4 mb-3 divide-y divide-border rounded-lg bg-muted/40 @min-[460px]:mx-5">
          {loan.repayments.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
              <span className="min-w-0">
                <span className="tabular-nums">{r.date}</span>
                {r.note && <span className="ml-2 text-muted-foreground">{r.note}</span>}
              </span>
              <span className="flex items-center gap-2">
                <span className="font-mono tabular-nums">{formatCurrency(r.amount, code)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                  disabled={deleting === r.id}
                  aria-label={`Remove repayment of ${formatCurrency(r.amount, code)} on ${r.date}`}
                  onClick={() => handleDeleteRepayment(r.id)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

type LoanFilter = "lent" | "borrowed" | "active" | "settled";

const FILTER_TITLES: Record<LoanFilter, string> = {
  lent: "Money owed to me",
  borrowed: "Money I owe",
  active: "All active loans",
  settled: "Settled loans",
};

export function LoansClient({
  loans,
  currencies,
  rates,
}: {
  loans: LoanWithCurrency[];
  currencies: Currency[];
  rates: ExchangeRates;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editLoan, setEditLoan] = useState<LoanWithCurrency | undefined>();
  const [defaultDirection, setDefaultDirection] = useState<
    "lent" | "borrowed"
  >("lent");
  const [filter, setFilter] = useState<LoanFilter>("lent");
  const router = useRouter();

  const money = useMoney();
  // Active loans count what's still outstanding; settled ones their full amount.
  const toBase = (l: LoanWithCurrency) =>
    convertCurrency(l.settled ? l.amount : outstanding(l), l.currencies.code, money.code, rates);
  const sumBase = (ls: LoanWithCurrency[]) => ls.reduce((s, l) => s + toBase(l), 0);
  const plural = (n: number, word: string) => `${n} ${word}${n !== 1 ? "s" : ""}`;

  const active = loans.filter((l) => !l.settled);
  const settled = loans.filter((l) => l.settled);
  const activeLent = active.filter((l) => l.direction === "lent");
  const activeBorrowed = active.filter((l) => l.direction === "borrowed");
  const net = sumBase(activeLent) - sumBase(activeBorrowed);

  const visible =
    filter === "lent"
      ? activeLent
      : filter === "borrowed"
        ? activeBorrowed
        : filter === "settled"
          ? settled
          : active;

  // Net position per person: positive = they owe me.
  const byPersonMap = new Map<string, number>();
  for (const l of active) {
    const signed = l.direction === "lent" ? toBase(l) : -toBase(l);
    byPersonMap.set(l.person, (byPersonMap.get(l.person) ?? 0) + signed);
  }
  const byPerson = [...byPersonMap]
    .map(([label, value]) => ({ label, value: Math.round(value) }))
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

  async function handleDelete(id: string) {
    if (!confirm("Delete this loan?")) return;
    await deleteLoan(id);
    router.refresh();
  }

  async function handleToggleSettled(id: string, currentSettled: boolean) {
    await toggleLoanSettled(id, !currentSettled);
    router.refresh();
  }

  function openAddDialog(dir: "lent" | "borrowed") {
    setEditLoan(undefined);
    setDefaultDirection(dir);
    setDialogOpen(true);
  }

  return (
    <div className="@container flex flex-col gap-5">
      <PageHeader
        title="Loans"
        subtitle={`Money you lent and borrowed · ${money.code}`}
        actions={
          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) setEditLoan(undefined);
            }}
          >
            <DialogTrigger render={<Button />}>
              <Plus /> Add Loan
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editLoan ? "Edit Loan" : "New Loan"}</DialogTitle>
                <DialogDescription>
                  {editLoan
                    ? "Update loan details"
                    : "Track money you lent or borrowed"}
                </DialogDescription>
              </DialogHeader>
              <LoanForm
                currencies={currencies}
                loan={editLoan}
                defaultDirection={defaultDirection}
                onDone={() => setDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        }
      />

      <Panel>
        <MetricTabs
          label="Loans"
          className="border-b border-border"
          value={filter}
          onChange={setFilter}
          tabs={[
            {
              key: "lent",
              label: "Owed to me",
              value: money.format(sumBase(activeLent)),
              footer: plural(activeLent.length, "active loan"),
            },
            {
              key: "borrowed",
              label: "I owe",
              value: money.format(sumBase(activeBorrowed)),
              footer: plural(activeBorrowed.length, "active loan"),
            },
            {
              key: "active",
              label: "Net position",
              value: `${net < 0 ? "−" : ""}${money.format(Math.abs(net))}`,
              footer: net >= 0 ? "in your favour" : "you owe overall",
            },
            {
              key: "settled",
              label: "Settled",
              value: money.format(sumBase(settled)),
              footer: plural(settled.length, "loan"),
            },
          ]}
        />
        <PanelHeader title={FILTER_TITLES[filter]}>
          {(filter === "lent" || filter === "borrowed") && (
            <Button variant="ghost" size="sm" onClick={() => openAddDialog(filter)}>
              <Plus /> Add
            </Button>
          )}
        </PanelHeader>
        {visible.length === 0 ? (
          <div className="flex flex-col items-center px-5 pt-4 pb-10 text-center">
            <Handshake className="mb-3 size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {filter === "lent"
                ? "No one owes you money right now"
                : filter === "borrowed"
                  ? "You don\u2019t owe anyone right now"
                  : filter === "settled"
                    ? "No settled loans yet"
                    : "No active loans"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border border-t border-border">
            {visible.map((loan) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                onEdit={() => {
                  setEditLoan(loan);
                  setDefaultDirection(loan.direction);
                  setDialogOpen(true);
                }}
                onDelete={() => handleDelete(loan.id)}
                onToggleSettled={() =>
                  handleToggleSettled(loan.id, loan.settled)
                }
              />
            ))}
          </div>
        )}
      </Panel>

      <RankedList
        title="By person · active loans"
        unit={money.code}
        items={byPerson}
        empty="No active loans."
        format={(v) => `${v > 0 ? "+" : v < 0 ? "−" : ""}${madFormat.format(Math.abs(v))}`}
      />
    </div>
  );
}
