import { createClient } from "@/lib/supabase/server";
import { getExchangeRates, convertCurrency, formatCurrency } from "@/lib/exchange-rates";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { AccountWithCurrency, ObjectiveWithCurrency } from "@/lib/types/database";

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

  const accounts = (accountsRes.data || []) as unknown as AccountWithCurrency[];
  const objectives = (objectivesRes.data || []) as unknown as ObjectiveWithCurrency[];

  // Calculate totals
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

  const accountTypeIcons: Record<string, string> = {
    bank: "🏦",
    wallet: "💳",
    cash: "💵",
    loan: "🤝",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Net Worth Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Net Worth</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {formatCurrency(totalMAD, "MAD")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">In Moroccan Dirham</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Net Worth</CardDescription>
            <CardTitle className="text-2xl text-blue-600">
              {formatCurrency(totalEUR, "EUR")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">In Euro</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Outstanding Loans</CardDescription>
            <CardTitle className="text-2xl text-orange-600">
              {formatCurrency(totalLoansMAD, "MAD")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Money to get back from people
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total (incl. Loans)</CardDescription>
            <CardTitle className="text-2xl">
              {formatCurrency(totalMAD + totalLoansMAD, "MAD")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Everything combined
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Accounts Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Accounts</CardTitle>
            <CardDescription>Your money across all accounts</CardDescription>
          </CardHeader>
          <CardContent>
            {accounts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No accounts yet. Go to Accounts to add some.
              </p>
            ) : (
              <div className="space-y-3">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">
                        {account.icon ||
                          accountTypeIcons[account.type] ||
                          "💰"}
                      </span>
                      <div>
                        <p className="font-medium">{account.name}</p>
                        <div className="flex items-center gap-2">
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
                      <p className="font-bold">
                        {formatCurrency(
                          account.balance,
                          account.currencies.code
                        )}
                      </p>
                      {account.currencies.code !== "MAD" && (
                        <p className="text-xs text-muted-foreground">
                          ≈{" "}
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
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Objectives */}
        <Card>
          <CardHeader>
            <CardTitle>Objectives</CardTitle>
            <CardDescription>Things you want to buy</CardDescription>
          </CardHeader>
          <CardContent>
            {objectives.length === 0 ? (
              <p className="text-sm text-muted-foreground">
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
                        <div>
                          <p className="font-medium">
                            {obj.completed ? "✅" : "🎯"} {obj.name}
                          </p>
                        </div>
                        <p className="text-sm font-bold">
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
            <CardTitle>🤝 Outstanding Loans</CardTitle>
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
                    <p className="font-medium">{loan.name}</p>
                    {loan.notes && (
                      <p className="text-sm text-muted-foreground">
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
