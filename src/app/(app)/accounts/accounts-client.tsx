"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAccount, updateAccount, deleteAccount } from "./actions";
import type { AccountWithCurrency, Currency } from "@/lib/types/database";
import {
  Landmark,
  Wallet,
  Banknote,
  Handshake,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  { value: "loan", label: "Loan (owed to you)", icon: Handshake },
];

const accountTypeIconMap: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  bank: Landmark,
  wallet: Wallet,
  cash: Banknote,
  loan: Handshake,
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

      {accountType === "loan" && (
        <div className="space-y-2">
          <Label htmlFor="notes">Who owes you?</Label>
          <Textarea
            id="notes"
            name="notes"
            defaultValue={account?.notes || ""}
            placeholder="e.g. Ahmed — laptop purchase"
          />
        </div>
      )}
      {accountType !== "loan" && (
        <div className="space-y-2">
          <Label htmlFor="notes">Notes (optional)</Label>
          <Input
            id="notes"
            name="notes"
            defaultValue={account?.notes || ""}
            placeholder="Any extra details"
          />
        </div>
      )}

      <Button type="submit" className="w-full h-11" disabled={loading}>
        {loading ? "Saving..." : account ? "Update Account" : "Add Account"}
      </Button>
    </form>
  );
}

export function AccountsClient({
  accounts,
  currencies,
}: {
  accounts: AccountWithCurrency[];
  currencies: Currency[];
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
            {accounts.length} account{accounts.length !== 1 && "s"} tracked
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
                {accounts.map((account) => {
                  const Icon = accountTypeIconMap[account.type] || Wallet;
                  return (
                    <TableRow key={account.id}>
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
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditAccount(account);
                              setDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleDelete(account.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
