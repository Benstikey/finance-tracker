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
  ArrowUpRight,
  ArrowDownLeft,
  PiggyBank,
  Landmark,
  Wallet,
  Banknote,
  Target,
  CircleCheck,
} from "lucide-react";
import type {
  AccountWithCurrency,
  ObjectiveWithCurrency,
  LoanWithCurrency,
} from "@/lib/types/database";

const accountTypeIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  bank: Landmark,
  wallet: Wallet,
  cash: Banknote,
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const [accountsRes, objectivesRes, loansRes, rates] = await Promise.all([
    supabase
      .from("accounts")
      .select("*, currencies(*)")
      .order("type", { ascending: true }),
    supabase
      .from("objectives")
      .select("*, currencies(*)")
      .order("priority", { ascending: true }),
    supabase
      .from("loans")
      .select("*, currencies(*)")
      .eq("settled", false),
    getExchangeRates("USD"),
  ]);

  const accounts = (accountsRes.data ||
    []) as unknown as AccountWithCurrency[];
  const objectives = (objectivesRes.data ||
    []) as unknown as ObjectiveWithCurrency[];
  const loans = (loansRes.data || []) as unknown as LoanWithCurrency[];

  let totalMAD = 0;
  let totalEUR = 0;

  for (const account of accounts) {
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

  const lentLoans = loans.filter((l) => l.direction === "lent");
  const borrowedLoans = loans.filter((l) => l.direction === "borrowed");

  let totalLentMAD = 0;
  for (const loan of lentLoans) {
    totalLentMAD += convertCurrency(
      loan.amount,
      loan.currencies.code,
      "MAD",
      rates
    );
  }
  let totalBorrowedMAD = 0;
  for (const loan of borrowedLoans) {
    totalBorrowedMAD += convertCurrency(
      loan.amount,
      loan.currencies.code,
      "MAD",
      rates
    );
  }

  // Total with loans: accounts + money owed to me - money I owe
  const totalWithLoansMAD = totalMAD + totalLentMAD - totalBorrowedMAD;

  return (
    <div className="flex flex-col gap-6 min-h-[calc(100vh-57px)]">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Your financial overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Net Worth (MAD)</CardDescription>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
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
            <div className="text-2xl font-bold">
              {formatCurrency(totalEUR, "EUR")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Euro</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Owed to me</CardDescription>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalLentMAD, "MAD")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {lentLoans.length} loan{lentLoans.length !== 1 && "s"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>I owe</CardDescription>
            <ArrowDownLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalBorrowedMAD, "MAD")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {borrowedLoans.length} loan
              {borrowedLoans.length !== 1 && "s"}
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Total (with loans)</CardDescription>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalWithLoansMAD, "MAD")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Accounts + lent - borrowed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Accounts & Objectives — fill remaining space */}
      <div className="grid gap-4 md:grid-cols-2 flex-1">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Landmark className="h-5 w-5" />
              Accounts
            </CardTitle>
            <CardDescription>Your money across all accounts</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {accounts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No accounts yet. Go to Accounts to add some.
              </p>
            ) : (
              <div className="space-y-3">
                {accounts.map((account) => {
                  const IconComp = accountTypeIcons[account.type] || Wallet;
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
                          <Badge
                            variant="secondary"
                            className="text-xs mt-1"
                          >
                            {account.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono font-bold">
                          {formatCurrency(
                            account.balance,
                            account.currencies.code
                          )}
                        </p>
                        {account.currencies.code !== "MAD" && (
                          <p className="text-xs text-muted-foreground font-mono">
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

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Objectives
            </CardTitle>
            <CardDescription>Savings goals</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
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
                            <CircleCheck className="h-4 w-4" />
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
                        {progress.toFixed(1)}% complete
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
