"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAccount, updateAccount, deleteAccount } from "./actions";
import { addTransaction, deleteTransaction } from "./transaction-actions";
import type { AccountWithCurrency, Currency, Transaction } from "@/lib/types/database";
import {
  Landmark,
  Wallet,
  Banknote,
  Pencil,
  Trash2,
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const accountTypes = [
  { value: "bank", label: "Bank", icon: Landmark },
  { value: "wallet", label: "Digital Wallet", icon: Wallet },
  { value: "cash", label: "Cash", icon: Banknote },
];

const accountTypeIconMap: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  bank: Landmark,
  wallet: Wallet,
  cash: Banknote,
};

function CurrencySelect({
  currencies,
  value,
  onChange,
}: {
  currencies: Currency[];
  value: string;
  onChange: (val: string) => void;
}) {
  const selected = currencies.find((c) => c.id === value);
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
      {selected && (
        <input type="hidden" name="currency_id" value={selected.id} />
      )}
    </div>
  );
}

function TypeSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>Type</Label>
      <div className="grid grid-cols-2 gap-2">
        {accountTypes.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange(t.value)}
            className={`flex items-center gap-2 rounded-lg border p-2.5 text-sm transition-colors ${
              value === t.value
                ? "border-primary bg-primary/5 font-medium"
                : "border-border hover:border-primary/50"
            }`}
          >
            <t.icon className="h-4 w-4" />
            <span>{t.label}</span>
          </button>
        ))}
      </div>
      <input type="hidden" name="type" value={value} />
    </div>
  );
}

function AccountForm({
  currencies,
  account,
  onDone,
}: {
  currencies: Currency[];
  account?: AccountWithCurrency;
  onDone: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [currencyId, setCurrencyId] = useState(
    account?.currency_id || currencies[0]?.id || ""
  );
  const [accountType, setAccountType] = useState(account?.type || "bank");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      if (account) {
        formData.set("id", account.id);
        await updateAccount(formData);
      } else {
        await createAccount(formData);
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
      <div className="space-y-2">
        <Label htmlFor="name">Account Name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={account?.name}
          placeholder="e.g. Wise, CIH Bank"
          required
        />
      </div>

      <TypeSelect value={accountType} onChange={setAccountType} />
      <CurrencySelect
        currencies={currencies}
        value={currencyId}
        onChange={setCurrencyId}
      />

      <div className="space-y-2">
        <Label htmlFor="balance">Balance</Label>
        <Input
          id="balance"
          name="balance"
          type="number"
          step="0.01"
          defaultValue={account?.balance || 0}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Input
          id="notes"
          name="notes"
          defaultValue={account?.notes || ""}
          placeholder="Any extra details"
        />
      </div>

      <Button type="submit" className="w-full h-11" disabled={loading}>
        {loading ? "Saving..." : account ? "Update Account" : "Add Account"}
      </Button>
    </form>
  );
}

function TransactionDialog({
  account,
  onDone,
}: {
  account: AccountWithCurrency;
  onDone: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [txType, setTxType] = useState<"deposit" | "withdrawal">("deposit");
  const today = new Date().toISOString().split("T")[0];
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("account_id", account.id);
    formData.set("type", txType);
    try {
      await addTransaction(formData);
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
      <div className="space-y-2">
        <Label>Type</Label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setTxType("deposit")}
            className={`flex items-center gap-2 rounded-lg border p-2.5 text-sm transition-colors ${
              txType === "deposit"
                ? "border-green-500 bg-green-50 dark:bg-green-950/20 font-medium text-green-700 dark:text-green-400"
                : "border-border hover:border-primary/50"
            }`}
          >
            <ArrowUpCircle className="h-4 w-4" />
            Deposit
          </button>
          <button
            type="button"
            onClick={() => setTxType("withdrawal")}
            className={`flex items-center gap-2 rounded-lg border p-2.5 text-sm transition-colors ${
              txType === "withdrawal"
                ? "border-red-500 bg-red-50 dark:bg-red-950/20 font-medium text-red-700 dark:text-red-400"
                : "border-border hover:border-primary/50"
            }`}
          >
            <ArrowDownCircle className="h-4 w-4" />
            Withdrawal
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount ({account.currencies.code})</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          name="date"
          type="date"
          defaultValue={today}
          max={today}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Input
          id="description"
          name="description"
          placeholder="e.g. Salary, Rent payment"
        />
      </div>

      <Button
        type="submit"
        className={`w-full h-11 ${
          txType === "deposit"
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-red-600 hover:bg-red-700 text-white"
        }`}
        disabled={loading}
      >
        {loading
          ? "Saving..."
          : txType === "deposit"
          ? "Add Deposit"
          : "Add Withdrawal"}
      </Button>
    </form>
  );
}

function AccountRow({
  account,
  transactions,
  onEdit,
  onDelete,
}: {
  account: AccountWithCurrency;
  transactions: Transaction[];
  onEdit: (account: AccountWithCurrency) => void;
  onDelete: (id: string) => void;
}) {
  const [txDialogOpen, setTxDialogOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [deletingTx, setDeletingTx] = useState<string | null>(null);
  const router = useRouter();
  const Icon = accountTypeIconMap[account.type] || Wallet;
  const accountTxs = transactions.filter((t) => t.account_id === account.id);

  async function handleDeleteTx(tx: Transaction) {
    if (!confirm("Remove this transaction? The account balance will be adjusted.")) return;
    setDeletingTx(tx.id);
    try {
      await deleteTransaction(tx.id, account.id, tx.amount);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error");
    } finally {
      setDeletingTx(null);
    }
  }

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">
          <span className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            {account.name}
          </span>
        </TableCell>
        <TableCell>
          <Badge variant="secondary">{account.type}</Badge>
        </TableCell>
        <TableCell>
          {account.currencies.symbol} {account.currencies.code}
        </TableCell>
        <TableCell className="text-right font-mono font-semibold">
          {account.balance.toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}
        </TableCell>
        <TableCell className="text-muted-foreground max-w-[200px] truncate">
          {account.notes || "—"}
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-1">
            <Dialog open={txDialogOpen} onOpenChange={setTxDialogOpen}>
              <DialogTrigger render={<Button variant="ghost" size="sm" title="Add transaction" />}>
                <Plus className="h-3.5 w-3.5" />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Transaction — {account.name}</DialogTitle>
                  <DialogDescription>
                    Record a deposit or withdrawal with the date it occurred.
                  </DialogDescription>
                </DialogHeader>
                <TransactionDialog
                  account={account}
                  onDone={() => setTxDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="sm"
              title={historyOpen ? "Hide history" : "Show history"}
              onClick={() => setHistoryOpen((v) => !v)}
            >
              {historyOpen ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(account)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={() => onDelete(account.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
      {historyOpen && (
        <TableRow>
          <TableCell colSpan={6} className="p-0">
            <div className="bg-muted/30 px-4 py-3 border-b">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Transaction History ({accountTxs.length})
              </p>
              {accountTxs.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2">
                  No transactions recorded yet. Use the + button to add one.
                </p>
              ) : (
                <div className="space-y-1">
                  {accountTxs.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between rounded-md bg-background border px-3 py-2 text-sm"
                    >
                      <div className="flex items-center gap-3">
                        {tx.amount >= 0 ? (
                          <ArrowUpCircle className="h-4 w-4 text-green-500 shrink-0" />
                        ) : (
                          <ArrowDownCircle className="h-4 w-4 text-red-500 shrink-0" />
                        )}
                        <div>
                          <p className="font-medium">
                            {tx.description || (tx.amount >= 0 ? "Deposit" : "Withdrawal")}
                          </p>
                          <p className="text-xs text-muted-foreground">{tx.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono font-semibold ${
                            tx.amount >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {tx.amount >= 0 ? "+" : ""}
                          {tx.amount.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}{" "}
                          {account.currencies.code}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                          disabled={deletingTx === tx.id}
                          onClick={() => handleDeleteTx(tx)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export function AccountsClient({
  accounts,
  currencies,
  transactions,
}: {
  accounts: AccountWithCurrency[];
  currencies: Currency[];
  transactions: Transaction[];
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editAccount, setEditAccount] = useState<
    AccountWithCurrency | undefined
  >();
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm("Delete this account?")) return;
    await deleteAccount(id);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground">
            Manage your money across banks and wallets
          </p>
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditAccount(undefined);
          }}
        >
          <DialogTrigger render={<Button />}>
            <Plus className="h-4 w-4 mr-1" /> Add Account
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editAccount ? "Edit Account" : "Add Account"}
              </DialogTitle>
              <DialogDescription>
                {editAccount
                  ? "Update your account details"
                  : "Add a new account to track"}
              </DialogDescription>
            </DialogHeader>
            <AccountForm
              currencies={currencies}
              account={editAccount}
              onDone={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Accounts</CardTitle>
          <CardDescription>
            {accounts.length} account{accounts.length !== 1 && "s"} tracked —
            use the + button on any row to record a deposit or withdrawal
          </CardDescription>
        </CardHeader>
        <CardContent>
          {accounts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No accounts yet. Click &quot;Add Account&quot; to get started.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <AccountRow
                    key={account.id}
                    account={account}
                    transactions={transactions}
                    onEdit={(a) => {
                      setEditAccount(a);
                      setDialogOpen(true);
                    }}
                    onDelete={handleDelete}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
