import { createClient } from "@/lib/supabase/server";
import {
  getExchangeRates,
  convertCurrency,
  formatCurrency,
} from "@/lib/exchange-rates";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Euro,
  HandCoins,
  PiggyBank,
  Landmark,
  Wallet,
  Banknote,
  Handshake,
  Target,
  CircleCheck,
} from "lucide-react";
import type {
  AccountWithCurrency,
  ObjectiveWithCurrency,
} from "@/lib/types/database";

const accountTypeIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  bank: Landmark,
  wallet: Wallet,
  cash: Banknote,
  loan: Handshake,
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const [accountsRes, objectivesRes, rates] = await Promise.all([
    supabase
      .from("accounts")
      .select("*, currencies(*)")
      .order("type", { ascending: true }),
    supabase
      .from("objectives")
      .select("*, currencies(*)")
      .order("priority", { ascending: true }),
    getExchangeRates("USD"),
  ]);

  const accounts = (accountsRes.data ||
    []) as unknown as AccountWithCurrency[];
  const objectives = (objectivesRes.data ||
    []) as unknown as ObjectiveWithCurrency[];

  let totalMAD = 0;
  let totalEUR = 0;

  const regularAccounts = accounts.filter((a) => a.type !== "loan");
  const loanAccounts = accounts.filter((a) => a.type === "loan");

  for (const account of regularAccounts) {
    totalMAD += convertCurrency(
      account.balance,
      account.currencies.code,
      "MAD",
      rates
    );
    totalEUR += convertCurrency(
      account.balance,
      account.currencies.code,
      "EUR",
      rates
    );
  }

  let totalLoansMAD = 0;
  for (const loan of loanAccounts) {
    totalLoansMAD += convertCurrency(
      loan.balance,
      loan.currencies.code,
      "MAD",
      rates
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Your financial overview</p>
      </div>

      {/* Net Worth Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Net Worth (MAD)</CardDescription>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalMAD, "MAD")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Moroccan Dirham
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Net Worth (EUR)</CardDescription>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalEUR, "EUR")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Euro</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Outstanding Loans</CardDescription>
            <HandCoins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(totalLoansMAD, "MAD")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Money to get back
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Total (incl. Loans)</CardDescription>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalMAD + totalLoansMAD, "MAD")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Everything combined
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Accounts & Objectives */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Landmark className="h-5 w-5" />
              Accounts
            </CardTitle>
            <CardDescription>Your money across all accounts</CardDescription>
          </CardHeader>
          <CardContent>
            {accounts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No accounts yet. Go to Accounts to add some.
              </p>
            ) : (
              <div className="space-y-3">
                {accounts.map((account) => {
                  const IconComp =
                    accountTypeIcons[account.type] || Wallet;
                  return (
                    <div
                      key={account.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                          <IconComp className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-none">
                            {account.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {account.type}
                            </Badge>
                            {account.notes && (
                              <span className="text-xs text-muted-foreground">
                                {account.notes}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">
                          {formatCurrency(
                            account.balance,
                            account.currencies.code
                          )}
                        </p>
                        {account.currencies.code !== "MAD" && (
                          <p className="text-xs text-muted-foreground">
                            ~{" "}
                            {formatCurrency(
                              convertCurrency(
                                account.balance,
                                account.currencies.code,
                                "MAD",
                                rates
                              ),
                              "MAD"
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Objectives
            </CardTitle>
            <CardDescription>Things you want to buy</CardDescription>
          </CardHeader>
          <CardContent>
            {objectives.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No objectives yet. Go to Objectives to add some.
              </p>
            ) : (
              <div className="space-y-4">
                {objectives.map((obj) => {
                  const progress =
                    obj.target_amount > 0
                      ? (obj.current_saved / obj.target_amount) * 100
                      : 0;
                  return (
                    <div key={obj.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {obj.completed ? (
                            <CircleCheck className="h-4 w-4 text-green-600" />
                          ) : (
                            <Target className="h-4 w-4 text-muted-foreground" />
                          )}
                          <p className="text-sm font-medium">{obj.name}</p>
                        </div>
                        <p className="text-xs font-mono font-semibold">
                          {formatCurrency(
                            obj.current_saved,
                            obj.currencies.code
                          )}{" "}
                          /{" "}
                          {formatCurrency(
                            obj.target_amount,
                            obj.currencies.code
                          )}
                        </p>
                      </div>
                      <Progress value={Math.min(progress, 100)} />
                      <p className="text-xs text-muted-foreground">
                        {progress.toFixed(1)}% — Need{" "}
                        {formatCurrency(
                          Math.max(
                            obj.target_amount - obj.current_saved,
                            0
                          ),
                          obj.currencies.code
                        )}{" "}
                        more
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Loans Detail */}
      {loanAccounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Handshake className="h-5 w-5" />
              Outstanding Loans
            </CardTitle>
            <CardDescription>Money people owe you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {loanAccounts.map((loan) => (
                <div
                  key={loan.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{loan.name}</p>
                    {loan.notes && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {loan.notes}
                      </p>
                    )}
                  </div>
                  <p className="font-bold text-orange-600">
                    {formatCurrency(loan.balance, loan.currencies.code)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
