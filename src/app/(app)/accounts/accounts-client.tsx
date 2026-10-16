"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAccount, updateAccount, deleteAccount } from "./actions";
import { addTransaction, addTransfer, deleteTransaction } from "./transaction-actions";
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
  X,
  ArrowLeftRight,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { convertCurrency, type ExchangeRates } from "@/lib/exchange-rates";
import {
  formatMAD,
  MetricTabs,
  PageHeader,
  Panel,
  PanelHeader,
} from "@/components/metrics";
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
                ? "border-primary bg-primary/5 font-medium"
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
                ? "border-primary bg-primary/5 font-medium"
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
        className="w-full h-11"
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

const selectClass =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

function TransferForm({
  accounts,
  rates,
  onDone,
}: {
  accounts: AccountWithCurrency[];
  rates: ExchangeRates;
  onDone: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [fromId, setFromId] = useState(accounts[0]?.id ?? "");
  const [toId, setToId] = useState(accounts[1]?.id ?? "");
  const [amount, setAmount] = useState("");
  // null = follow the live rate; a string once the user edits it (fees, own rate).
  const [receivedOverride, setReceivedOverride] = useState<string | null>(null);
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const from = accounts.find((a) => a.id === fromId);
  const to = accounts.find((a) => a.id === toId);
  const crossCurrency = !!from && !!to && from.currencies.code !== to.currencies.code;
  const sent = parseFloat(amount) || 0;
  const converted =
    from && to ? convertCurrency(sent, from.currencies.code, to.currencies.code, rates) : sent;
  const received = receivedOverride ?? (sent ? converted.toFixed(2) : "");
  const rate =
    from && to ? convertCurrency(1, from.currencies.code, to.currencies.code, rates) : 1;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    if (!crossCurrency) formData.set("received", amount);
    try {
      await addTransfer(formData);
      router.refresh();
      onDone();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  if (accounts.length < 2) {
    return (
      <p className="py-4 text-sm text-muted-foreground">
        Add a second account to move money between them.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
        <div className="space-y-2">
          <Label htmlFor="from_account_id">From</Label>
          <select
            id="from_account_id"
            name="from_account_id"
            className={selectClass}
            value={fromId}
            onChange={(e) => {
              setFromId(e.target.value);
              setReceivedOverride(null);
            }}
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.currencies.code})
              </option>
            ))}
          </select>
        </div>
        <ArrowRight className="mb-2 size-4 text-muted-foreground" aria-hidden />
        <div className="space-y-2">
          <Label htmlFor="to_account_id">To</Label>
          <select
            id="to_account_id"
            name="to_account_id"
            className={selectClass}
            value={toId}
            onChange={(e) => {
              setToId(e.target.value);
              setReceivedOverride(null);
            }}
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id} disabled={a.id === fromId}>
                {a.name} ({a.currencies.code})
              </option>
            ))}
          </select>
        </div>
      </div>
      {fromId === toId && (
        <p className="text-xs text-destructive">Pick two different accounts.</p>
      )}

      <div className={crossCurrency ? "grid grid-cols-2 gap-3" : ""}>
        <div className="space-y-2">
          <Label htmlFor="transfer-amount">
            {crossCurrency ? "Sent" : "Amount"} ({from?.currencies.code})
          </Label>
          <Input
            id="transfer-amount"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setReceivedOverride(null);
            }}
            required
          />
        </div>
        {crossCurrency && (
          <div className="space-y-2">
            <Label htmlFor="transfer-received">Received ({to?.currencies.code})</Label>
            <Input
              id="transfer-received"
              name="received"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={received}
              onChange={(e) => setReceivedOverride(e.target.value)}
              required
            />
          </div>
        )}
      </div>
      {crossCurrency && (
        <p className="-mt-2 text-xs text-muted-foreground">
          Live rate: 1 {from?.currencies.code} = {rate.toFixed(4)} {to?.currencies.code}. Change
          the received amount if fees applied.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="transfer-date">Date</Label>
          <Input id="transfer-date" name="date" type="date" defaultValue={today} max={today} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="transfer-description">Note (optional)</Label>
          <Input id="transfer-description" name="description" placeholder="e.g. Savings" />
        </div>
      </div>

      <Button type="submit" className="w-full h-11" disabled={loading || fromId === toId}>
        {loading ? "Moving..." : "Transfer"}
      </Button>
    </form>
  );
}

function AccountRow({
  account,
  transactions,
  accountNames,
  onEdit,
  onDelete,
}: {
  account: AccountWithCurrency;
  transactions: Transaction[];
  accountNames: Map<string, string>;
  onEdit: (account: AccountWithCurrency) => void;
  onDelete: (id: string) => void;
}) {
  const [txDialogOpen, setTxDialogOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [deletingTx, setDeletingTx] = useState<string | null>(null);
  const router = useRouter();
  const Icon = accountTypeIconMap[account.type] || Wallet;
  const accountTxs = transactions.filter((t) => t.account_id === account.id);

  // The other leg of a transfer, for "Transfer to X" / "Transfer from X".
  function counterpart(tx: Transaction) {
    if (!tx.transfer_id) return null;
    const other = transactions.find(
      (t) => t.transfer_id === tx.transfer_id && t.id !== tx.id
    );
    return other ? (accountNames.get(other.account_id) ?? "another account") : null;
  }

  async function handleDeleteTx(tx: Transaction) {
    const message = tx.transfer_id
      ? "Remove this transfer? Both accounts will be adjusted."
      : "Remove this transaction? The account balance will be adjusted.";
    if (!confirm(message)) return;
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
              <ChevronDown
                className={`h-3.5 w-3.5 transition-[rotate] duration-200 ease-[cubic-bezier(0.2,0,0,1)] ${
                  historyOpen ? "rotate-180" : ""
                }`}
              />
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
                        {tx.transfer_id ? (
                          <ArrowLeftRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        ) : tx.amount >= 0 ? (
                          <ArrowUpCircle className="h-4 w-4 text-foreground shrink-0" />
                        ) : (
                          <ArrowDownCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                        <div>
                          <p className="font-medium">
                            {tx.transfer_id
                              ? `Transfer ${tx.amount < 0 ? "to" : "from"} ${counterpart(tx) ?? "another account"}`
                              : tx.description || (tx.amount >= 0 ? "Deposit" : "Withdrawal")}
                          </p>
                          {tx.transfer_id && tx.description && (
                            <p className="text-xs text-muted-foreground">{tx.description}</p>
                          )}
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
  rates,
}: {
  accounts: AccountWithCurrency[];
  currencies: Currency[];
  transactions: Transaction[];
  rates: ExchangeRates;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editAccount, setEditAccount] = useState<
    AccountWithCurrency | undefined
  >();
  const [typeFilter, setTypeFilter] = useState("all");
  const [transferOpen, setTransferOpen] = useState(false);
  const accountNames = new Map(accounts.map((a) => [a.id, a.name]));
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm("Delete this account?")) return;
    await deleteAccount(id);
    router.refresh();
  }

  const toMAD = (a: AccountWithCurrency) =>
    convertCurrency(a.balance, a.currencies.code, "MAD", rates);
  const tabs = [{ value: "all", label: "All accounts" }, ...accountTypes].map(
    (t) => {
      const matching = accounts.filter(
        (a) => t.value === "all" || a.type === t.value
      );
      return {
        key: t.value,
        label: t.label,
        value: formatMAD(matching.reduce((s, a) => s + toMAD(a), 0)),
        footer: `${matching.length} account${matching.length !== 1 ? "s" : ""}`,
      };
    }
  );
  const visible = accounts.filter(
    (a) => typeFilter === "all" || a.type === typeFilter
  );

  return (
    <div className="@container flex flex-col gap-5">
      <PageHeader
        title="Accounts"
        subtitle="Manage your money across banks and wallets"
        actions={
          <>
          <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
            <DialogTrigger render={<Button variant="outline" />}>
              <ArrowLeftRight /> Transfer
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Transfer between accounts</DialogTitle>
                <DialogDescription>
                  Moves money in one step. Net worth only changes by any conversion difference.
                </DialogDescription>
              </DialogHeader>
              <TransferForm
                accounts={accounts}
                rates={rates}
                onDone={() => setTransferOpen(false)}
              />
            </DialogContent>
          </Dialog>
          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) setEditAccount(undefined);
            }}
          >
            <DialogTrigger render={<Button />}>
              <Plus /> Add Account
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
          </>
        }
      />

      <Panel>
        <MetricTabs
          label="Account type"
          className="border-b border-border"
          value={typeFilter}
          onChange={setTypeFilter}
          tabs={tabs}
        />
        <PanelHeader title={tabs.find((t) => t.key === typeFilter)?.label}>
          <span className="text-xs text-muted-foreground">
            Use + on a row to record a deposit or withdrawal
          </span>
        </PanelHeader>
        {visible.length === 0 ? (
          <p className="px-5 pb-8 pt-4 text-center text-sm text-muted-foreground">
            {accounts.length === 0
              ? "No accounts yet. Click \u201cAdd Account\u201d to get started."
              : "No accounts of this type."}
          </p>
        ) : (
          <div className="px-2 pb-2 @min-[460px]:px-3">
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
                {visible.map((account) => (
                  <AccountRow
                    key={account.id}
                    account={account}
                    transactions={transactions}
                    accountNames={accountNames}
                    onEdit={(a) => {
                      setEditAccount(a);
                      setDialogOpen(true);
                    }}
                    onDelete={handleDelete}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Panel>
    </div>
  );
}
