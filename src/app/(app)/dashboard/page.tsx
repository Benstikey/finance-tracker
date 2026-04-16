import { createClient } from "@/lib/supabase/server";
import {
  getExchangeRates,
  convertCurrency,
  formatCurrency,
} from "@/lib/exchange-rates";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Landmark,
  Wallet,
  Banknote,
  Target,
  CircleCheck,
  TrendingUp,
  TrendingDown,
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

  const accounts = (accountsRes.data || []) as unknown as AccountWithCurrency[];
  const objectives = (objectivesRes.data || []) as unknown as ObjectiveWithCurrency[];
  const loans = (loansRes.data || []) as unknown as LoanWithCurrency[];

  let totalMAD = 0;
  for (const account of accounts) {
    totalMAD += convertCurrency(account.balance, account.currencies.code, "MAD", rates);
  }

  const lentLoans = loans.filter((l) => l.direction === "lent");
  const borrowedLoans = loans.filter((l) => l.direction === "borrowed");

  let totalLentMAD = 0;
  for (const loan of lentLoans) {
    totalLentMAD += convertCurrency(loan.amount, loan.currencies.code, "MAD", rates);
  }
  let totalBorrowedMAD = 0;
  for (const loan of borrowedLoans) {
    totalBorrowedMAD += convertCurrency(loan.amount, loan.currencies.code, "MAD", rates);
  }

  const totalWithLoansMAD = totalMAD + totalLentMAD - totalBorrowedMAD;
  const activeObjectives = objectives.filter((o) => !o.completed);

  return (
    <div className="flex flex-col gap-6">
      {/* ── KPI strip ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-4">
        {[
          {
            label: "Net Worth",
            value: formatCurrency(totalMAD, "MAD"),
            sub: `${accounts.length} account${accounts.length !== 1 ? "s" : ""}`,
            icon: TrendingUp,
            positive: true,
          },
          {
            label: "Owed to Me",
            value: formatCurrency(totalLentMAD, "MAD"),
            sub: `${lentLoans.length} active loan${lentLoans.length !== 1 ? "s" : ""}`,
            icon: ArrowUpRight,
            positive: true,
          },
          {
            label: "I Owe",
            value: formatCurrency(totalBorrowedMAD, "MAD"),
            sub: `${borrowedLoans.length} active loan${borrowedLoans.length !== 1 ? "s" : ""}`,
            icon: ArrowDownLeft,
            positive: false,
          },
          {
            label: "Total (with loans)",
            value: formatCurrency(totalWithLoansMAD, "MAD"),
            sub: "Accounts + lent − borrowed",
            icon: totalWithLoansMAD >= 0 ? TrendingUp : TrendingDown,
            positive: totalWithLoansMAD >= 0,
          },
        ].map(({ label, value, sub, icon: Icon, positive }) => (
          <div key={label} className="flex items-center gap-4 bg-card px-5 py-5">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                positive ? "bg-primary/10" : "bg-destructive/10"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${positive ? "text-primary" : "text-destructive"}`}
              />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {label}
              </p>
              <p className="mt-0.5 truncate text-xl font-bold text-foreground">
                {value}
              </p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Accounts + Objectives ───────────────────────────────────── */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Accounts */}
        <Card className="flex flex-col shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
            <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
              <Landmark className="h-4 w-4 text-primary" />
              Accounts
            </CardTitle>
            <a
              href="/accounts"
              className="text-xs font-medium text-primary hover:underline"
            >
              View all →
            </a>
          </CardHeader>
          <CardContent className="flex-1 pt-4">
            {accounts.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No accounts yet.{" "}
                <a href="/accounts" className="text-primary hover:underline">
                  Add one →
                </a>
              </p>
            ) : (
              <div className="space-y-2">
                {accounts.map((account) => {
                  const IconComp = accountTypeIcons[account.type] || Wallet;
                  const balanceMAD = convertCurrency(
                    account.balance,
                    account.currencies.code,
                    "MAD",
                    rates
                  );
                  const pct = totalMAD > 0 ? (balanceMAD / totalMAD) * 100 : 0;
                  return (
                    <div
                      key={account.id}
                      className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-shadow hover:shadow-sm"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <IconComp className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {account.name}
                          </p>
                          <p className="shrink-0 font-mono text-sm font-bold text-foreground">
                            {formatCurrency(account.balance, account.currencies.code)}
                          </p>
                        </div>
                        <div className="mt-1.5 flex items-center gap-2">
                          <Progress value={pct} className="h-1.5 flex-1" />
                          <span className="w-9 shrink-0 text-right text-[11px] text-muted-foreground">
                            {pct.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="shrink-0 text-[11px]">
                        {account.type}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Objectives */}
        <Card className="flex flex-col shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
            <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
              <Target className="h-4 w-4 text-primary" />
              Objectives
            </CardTitle>
            <a
              href="/objectives"
              className="text-xs font-medium text-primary hover:underline"
            >
              View all →
            </a>
          </CardHeader>
          <CardContent className="flex-1 pt-4">
            {objectives.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No objectives yet.{" "}
                <a href="/objectives" className="text-primary hover:underline">
                  Add one →
                </a>
              </p>
            ) : (
              <div className="space-y-4">
                {activeObjectives.slice(0, 5).map((obj) => {
                  const progress =
                    obj.target_amount > 0
                      ? (obj.current_saved / obj.target_amount) * 100
                      : 0;
                  return (
                    <div key={obj.id} className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {obj.completed ? (
                            <CircleCheck className="h-4 w-4 text-primary" />
                          ) : (
                            <Target className="h-4 w-4 text-muted-foreground" />
                          )}
                          <p className="text-sm font-semibold text-foreground">
                            {obj.name}
                          </p>
                        </div>
                        <p className="shrink-0 font-mono text-xs text-muted-foreground">
                          {formatCurrency(obj.current_saved, obj.currencies.code)}
                          {" / "}
                          {formatCurrency(obj.target_amount, obj.currencies.code)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={Math.min(progress, 100)}
                          className="h-1.5 flex-1"
                        />
                        <span className="w-9 shrink-0 text-right text-[11px] font-medium text-muted-foreground">
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
                {objectives.filter((o) => o.completed).length > 0 && (
                  <p className="pt-1 text-xs text-muted-foreground">
                    +{objectives.filter((o) => o.completed).length} completed
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
