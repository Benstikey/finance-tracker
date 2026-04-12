"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createCashFlow,
  updateCashFlow,
  deleteCashFlow,
  toggleCashFlowActive,
} from "./actions";
import type { CashFlowWithCurrency, Currency } from "@/lib/types/database";
import type { ExchangeRates } from "@/lib/exchange-rates";
import { formatCurrency } from "@/lib/exchange-rates";
import {
  Plus,
  Pencil,
  Trash2,
  TrendingUp,
  TrendingDown,
  Repeat,
  CalendarDays,
  Pause,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CashFlowCalendar } from "./calendar";

const frequencies = [
  { value: "one_time" as const, label: "One-time" },
  { value: "daily" as const, label: "Daily" },
  { value: "weekly" as const, label: "Weekly" },
  { value: "monthly" as const, label: "Monthly" },
  { value: "yearly" as const, label: "Yearly" },
];

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
            className={`flex items-center gap-2 rounded-lg border p-2 text-sm transition-colors ${
              value === c.id
                ? "border-primary bg-primary/5 font-medium"
                : "border-border hover:border-primary/50"
            }`}
          >
            <span>{c.symbol}</span>
            <span>{c.code}</span>
          </button>
        ))}
      </div>
      <input type="hidden" name="currency_id" value={value} />
    </div>
  );
}

function CashFlowForm({
  currencies,
  cashFlow,
  onDone,
}: {
  currencies: Currency[];
  cashFlow?: CashFlowWithCurrency;
  onDone: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [currencyId, setCurrencyId] = useState(
    cashFlow?.currency_id || currencies[0]?.id || ""
  );
  const [type, setType] = useState<"income" | "expense">(
    cashFlow?.type || "income"
  );
  const [frequency, setFrequency] = useState(
    cashFlow?.frequency || "monthly"
  );
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("type", type);
    formData.set("frequency", frequency);
    try {
      if (cashFlow) {
        formData.set("id", cashFlow.id);
        await updateCashFlow(formData);
      } else {
        await createCashFlow(formData);
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
      {/* Type toggle */}
      <div className="space-y-2">
        <Label>Type</Label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setType("income")}
            className={`flex items-center gap-2 rounded-lg border p-3 text-sm transition-colors ${
              type === "income"
                ? "border-primary bg-primary/5 font-medium"
                : "border-border hover:border-primary/50"
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            Income
          </button>
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`flex items-center gap-2 rounded-lg border p-3 text-sm transition-colors ${
              type === "expense"
                ? "border-primary bg-primary/5 font-medium"
                : "border-border hover:border-primary/50"
            }`}
          >
            <TrendingDown className="h-4 w-4" />
            Expense
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={cashFlow?.name}
          placeholder={
            type === "income" ? "e.g. Salary, Freelance" : "e.g. Rent, Netflix"
          }
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
          defaultValue={cashFlow?.amount}
          required
        />
      </div>

      <CurrencySelect
        currencies={currencies}
        value={currencyId}
        onChange={setCurrencyId}
      />

      {/* Frequency */}
      <div className="space-y-2">
        <Label>Frequency</Label>
        <div className="grid grid-cols-3 gap-2">
          {frequencies.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFrequency(f.value)}
              className={`rounded-lg border p-2 text-sm transition-colors ${
                frequency === f.value
                  ? "border-primary bg-primary/5 font-medium"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input type="hidden" name="frequency" value={frequency} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="start_date">
            {frequency === "one_time" ? "Date" : "Start Date"}
          </Label>
          <Input
            id="start_date"
            name="start_date"
            type="date"
            defaultValue={cashFlow?.start_date || new Date().toISOString().split("T")[0]}
            required
          />
        </div>
        {frequency !== "one_time" && (
          <div className="space-y-2">
            <Label htmlFor="end_date">End Date (optional)</Label>
            <Input
              id="end_date"
              name="end_date"
              type="date"
              defaultValue={cashFlow?.end_date || ""}
            />
          </div>
        )}
      </div>

      {frequency === "monthly" && (
        <div className="space-y-2">
          <Label htmlFor="day_of_month">Day of month</Label>
          <Input
            id="day_of_month"
            name="day_of_month"
            type="number"
            min={1}
            max={31}
            defaultValue={cashFlow?.day_of_month || 1}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Input
          id="notes"
          name="notes"
          defaultValue={cashFlow?.notes || ""}
          placeholder="Any extra details"
        />
      </div>

      <Button type="submit" className="w-full h-11" disabled={loading}>
        {loading ? "Saving..." : cashFlow ? "Update" : "Add Entry"}
      </Button>
    </form>
  );
}

function CashFlowItem({
  cf,
  onEdit,
  onDelete,
  onToggleActive,
}: {
  cf: CashFlowWithCurrency;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg border p-4 transition-opacity ${
        !cf.active ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          {cf.type === "income" ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
        </div>
        <div>
          <p className="font-medium">{cf.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge variant="secondary" className="text-xs">
              {cf.frequency === "one_time"
                ? "One-time"
                : cf.frequency.charAt(0).toUpperCase() + cf.frequency.slice(1)}
            </Badge>
            {cf.frequency !== "one_time" && (
              <Repeat className="h-3 w-3 text-muted-foreground" />
            )}
            {cf.notes && (
              <span className="text-xs text-muted-foreground">{cf.notes}</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="font-mono font-bold">
            {cf.type === "expense" ? "−" : "+"}
            {formatCurrency(cf.amount, cf.currencies.code)}
          </p>
          <p className="text-xs text-muted-foreground">
            {cf.frequency === "one_time"
              ? cf.start_date
              : `from ${cf.start_date}`}
          </p>
        </div>
        <div className="flex gap-0.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onToggleActive}
            title={cf.active ? "Pause" : "Resume"}
          >
            {cf.active ? (
              <Pause className="h-3.5 w-3.5" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onEdit}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CashFlowClient({
  cashFlows,
  currencies,
  currentBalanceMAD,
  rates,
}: {
  cashFlows: CashFlowWithCurrency[];
  currencies: Currency[];
  currentBalanceMAD: number;
  rates: ExchangeRates;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCashFlow, setEditCashFlow] = useState<
    CashFlowWithCurrency | undefined
  >();
  const router = useRouter();

  const incomeFlows = cashFlows.filter((cf) => cf.type === "income");
  const expenseFlows = cashFlows.filter((cf) => cf.type === "expense");

  async function handleDelete(id: string) {
    if (!confirm("Delete this entry?")) return;
    await deleteCashFlow(id);
    router.refresh();
  }

  async function handleToggleActive(id: string, currentActive: boolean) {
    await toggleCashFlowActive(id, !currentActive);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Cash Flow</h1>
          <p className="text-muted-foreground">
            Track income, expenses, and forecast your balance
          </p>
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditCashFlow(undefined);
          }}
        >
          <DialogTrigger render={<Button />}>
            <Plus className="h-4 w-4 mr-1" /> Add Entry
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editCashFlow ? "Edit Entry" : "New Cash Flow Entry"}
              </DialogTitle>
              <DialogDescription>
                {editCashFlow
                  ? "Update this cash flow entry"
                  : "Add recurring or one-time income/expense"}
              </DialogDescription>
            </DialogHeader>
            <CashFlowForm
              currencies={currencies}
              cashFlow={editCashFlow}
              onDone={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Calendar Forecast */}
      <CashFlowCalendar
        cashFlows={cashFlows.filter((cf) => cf.active)}
        currentBalanceMAD={currentBalanceMAD}
        rates={rates}
      />

      {/* Entries list */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">
            <CalendarDays className="h-3.5 w-3.5 mr-1" />
            All ({cashFlows.length})
          </TabsTrigger>
          <TabsTrigger value="income">
            <TrendingUp className="h-3.5 w-3.5 mr-1" />
            Income ({incomeFlows.length})
          </TabsTrigger>
          <TabsTrigger value="expense">
            <TrendingDown className="h-3.5 w-3.5 mr-1" />
            Expenses ({expenseFlows.length})
          </TabsTrigger>
        </TabsList>

        {(["all", "income", "expense"] as const).map((tab) => {
          const items =
            tab === "all"
              ? cashFlows
              : tab === "income"
                ? incomeFlows
                : expenseFlows;
          return (
            <TabsContent key={tab} value={tab} className="space-y-3 mt-4">
              {items.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center py-12 text-center">
                    <CalendarDays className="h-8 w-8 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No {tab === "all" ? "entries" : tab} yet
                    </p>
                  </CardContent>
                </Card>
              ) : (
                items.map((cf) => (
                  <CashFlowItem
                    key={cf.id}
                    cf={cf}
                    onEdit={() => {
                      setEditCashFlow(cf);
                      setDialogOpen(true);
                    }}
                    onDelete={() => handleDelete(cf.id)}
                    onToggleActive={() =>
                      handleToggleActive(cf.id, cf.active)
                    }
                  />
                ))
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
