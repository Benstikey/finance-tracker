"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createLoan, updateLoan, deleteLoan, toggleLoanSettled } from "./actions";
import type { LoanWithCurrency, Currency } from "@/lib/types/database";
import { formatCurrency } from "@/lib/exchange-rates";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Pencil,
  Trash2,
  Check,
  Undo2,
  Handshake,
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
import { Separator } from "@/components/ui/separator";

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
  return (
    <div
      className={`flex items-center justify-between rounded-lg border p-4 transition-opacity ${
        loan.settled ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            loan.direction === "lent" ? "bg-muted" : "bg-muted"
          }`}
        >
          {loan.direction === "lent" ? (
            <ArrowUpRight className="h-4 w-4" />
          ) : (
            <ArrowDownLeft className="h-4 w-4" />
          )}
        </div>
        <div>
          <p className="font-medium">{loan.person}</p>
          <div className="flex items-center gap-2 mt-0.5">
            {loan.description && (
              <span className="text-xs text-muted-foreground">
                {loan.description}
              </span>
            )}
            {loan.settled && (
              <Badge variant="secondary" className="text-xs">
                Settled
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <p className="font-mono font-bold text-right">
          {formatCurrency(loan.amount, loan.currencies.code)}
        </p>
        <div className="flex gap-0.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onToggleSettled}
            title={loan.settled ? "Mark unsettled" : "Mark settled"}
          >
            {loan.settled ? (
              <Undo2 className="h-3.5 w-3.5" />
            ) : (
              <Check className="h-3.5 w-3.5" />
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

export function LoansClient({
  loans,
  currencies,
}: {
  loans: LoanWithCurrency[];
  currencies: Currency[];
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editLoan, setEditLoan] = useState<LoanWithCurrency | undefined>();
  const [defaultDirection, setDefaultDirection] = useState<
    "lent" | "borrowed"
  >("lent");
  const router = useRouter();

  const lentLoans = loans.filter((l) => l.direction === "lent");
  const borrowedLoans = loans.filter((l) => l.direction === "borrowed");

  const activeLent = lentLoans.filter((l) => !l.settled);
  const activeBorrowed = borrowedLoans.filter((l) => !l.settled);

  const totalLent = activeLent.reduce((sum, l) => sum + l.amount, 0);
  const totalBorrowed = activeBorrowed.reduce((sum, l) => sum + l.amount, 0);

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Loans</h1>
          <p className="text-muted-foreground">
            Track money you lent and borrowed
          </p>
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditLoan(undefined);
          }}
        >
          <DialogTrigger render={<Button />}>
            <Plus className="h-4 w-4 mr-1" /> Add Loan
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editLoan ? "Edit Loan" : "New Loan"}
              </DialogTitle>
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
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Owed to me</CardDescription>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              {activeLent.length > 0
                ? activeLent
                    .map(
                      (l) =>
                        `${l.currencies.symbol}${l.amount.toLocaleString()}`
                    )
                    .join(" + ")
                : "—"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeLent.length} active loan{activeLent.length !== 1 && "s"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>I owe</CardDescription>
            <ArrowDownLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              {activeBorrowed.length > 0
                ? activeBorrowed
                    .map(
                      (l) =>
                        `${l.currencies.symbol}${l.amount.toLocaleString()}`
                    )
                    .join(" + ")
                : "—"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeBorrowed.length} active loan
              {activeBorrowed.length !== 1 && "s"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="lent">
        <TabsList>
          <TabsTrigger value="lent">
            <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
            Owed to me ({lentLoans.length})
          </TabsTrigger>
          <TabsTrigger value="borrowed">
            <ArrowDownLeft className="h-3.5 w-3.5 mr-1" />
            I owe ({borrowedLoans.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lent" className="space-y-3 mt-4">
          {lentLoans.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center py-12 text-center">
                <Handshake className="h-8 w-8 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  No one owes you money right now
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => openAddDialog("lent")}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add
                </Button>
              </CardContent>
            </Card>
          ) : (
            lentLoans.map((loan) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                onEdit={() => {
                  setEditLoan(loan);
                  setDefaultDirection("lent");
                  setDialogOpen(true);
                }}
                onDelete={() => handleDelete(loan.id)}
                onToggleSettled={() =>
                  handleToggleSettled(loan.id, loan.settled)
                }
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="borrowed" className="space-y-3 mt-4">
          {borrowedLoans.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center py-12 text-center">
                <Handshake className="h-8 w-8 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  You don&apos;t owe anyone right now
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => openAddDialog("borrowed")}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add
                </Button>
              </CardContent>
            </Card>
          ) : (
            borrowedLoans.map((loan) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                onEdit={() => {
                  setEditLoan(loan);
                  setDefaultDirection("borrowed");
                  setDialogOpen(true);
                }}
                onDelete={() => handleDelete(loan.id)}
                onToggleSettled={() =>
                  handleToggleSettled(loan.id, loan.settled)
                }
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
