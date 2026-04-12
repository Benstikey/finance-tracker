"use client";

import { useState, useMemo } from "react";
import type { CashFlowWithCurrency } from "@/lib/types/database";
import type { ExchangeRates } from "@/lib/exchange-rates";
import { convertCurrency, formatCurrency } from "@/lib/exchange-rates";
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DayData = {
  date: Date;
  income: { name: string; amount: number }[];
  expenses: { name: string; amount: number }[];
  netChange: number;
  runningBalance: number;
};

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function doesCashFlowTrigger(
  cf: CashFlowWithCurrency,
  date: Date,
  rates: ExchangeRates
): { triggers: boolean; amountMAD: number } {
  const startDate = new Date(cf.start_date + "T00:00:00");
  const endDate = cf.end_date ? new Date(cf.end_date + "T00:00:00") : null;

  // Check if date is within range
  if (date < startDate) return { triggers: false, amountMAD: 0 };
  if (endDate && date > endDate) return { triggers: false, amountMAD: 0 };

  const amountMAD = convertCurrency(
    cf.amount,
    cf.currencies.code,
    "MAD",
    rates
  );

  switch (cf.frequency) {
    case "one_time":
      return {
        triggers:
          date.getFullYear() === startDate.getFullYear() &&
          date.getMonth() === startDate.getMonth() &&
          date.getDate() === startDate.getDate(),
        amountMAD,
      };
    case "daily":
      return { triggers: true, amountMAD };
    case "weekly":
      return {
        triggers: date.getDay() === startDate.getDay(),
        amountMAD,
      };
    case "monthly": {
      const targetDay = cf.day_of_month || startDate.getDate();
      const daysInMonth = getDaysInMonth(date.getFullYear(), date.getMonth());
      const effectiveDay = Math.min(targetDay, daysInMonth);
      return {
        triggers: date.getDate() === effectiveDay,
        amountMAD,
      };
    }
    case "yearly":
      return {
        triggers:
          date.getMonth() === startDate.getMonth() &&
          date.getDate() === startDate.getDate(),
        amountMAD,
      };
    default:
      return { triggers: false, amountMAD: 0 };
  }
}

function computeMonthData(
  year: number,
  month: number,
  cashFlows: CashFlowWithCurrency[],
  startingBalance: number,
  rates: ExchangeRates
): DayData[] {
  const daysInMonth = getDaysInMonth(year, month);
  const days: DayData[] = [];
  let runningBalance = startingBalance;

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const income: { name: string; amount: number }[] = [];
    const expenses: { name: string; amount: number }[] = [];

    for (const cf of cashFlows) {
      const { triggers, amountMAD } = doesCashFlowTrigger(cf, date, rates);
      if (triggers) {
        if (cf.type === "income") {
          income.push({ name: cf.name, amount: amountMAD });
        } else {
          expenses.push({ name: cf.name, amount: amountMAD });
        }
      }
    }

    const totalIncome = income.reduce((s, i) => s + i.amount, 0);
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
    const netChange = totalIncome - totalExpenses;
    runningBalance += netChange;

    days.push({ date, income, expenses, netChange, runningBalance });
  }

  return days;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function CashFlowCalendar({
  cashFlows,
  currentBalanceMAD,
  rates,
}: {
  cashFlows: CashFlowWithCurrency[];
  currentBalanceMAD: number;
  rates: ExchangeRates;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const days = useMemo(
    () =>
      computeMonthData(viewYear, viewMonth, cashFlows, currentBalanceMAD, rates),
    [viewYear, viewMonth, cashFlows, currentBalanceMAD, rates]
  );

  // Compute first day offset (Monday-based)
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
  const startOffset = (firstDayOfMonth.getDay() + 6) % 7; // Monday=0

  // Monthly totals
  const monthlyIncome = days.reduce(
    (s, d) => s + d.income.reduce((ss, i) => ss + i.amount, 0),
    0
  );
  const monthlyExpenses = days.reduce(
    (s, d) => s + d.expenses.reduce((ss, e) => ss + e.amount, 0),
    0
  );
  const monthlyNet = monthlyIncome - monthlyExpenses;
  const endOfMonthBalance = days.length > 0 ? days[days.length - 1].runningBalance : currentBalanceMAD;

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }

  const isToday = (date: Date) =>
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Monthly Forecast</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[140px] text-center">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <Button variant="ghost" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Monthly summary */}
        <div className="grid grid-cols-4 gap-3 mt-2">
          <div className="rounded-lg bg-muted p-2.5">
            <p className="text-xs text-muted-foreground">Income</p>
            <p className="text-sm font-mono font-bold">
              +{formatCurrency(monthlyIncome, "MAD")}
            </p>
          </div>
          <div className="rounded-lg bg-muted p-2.5">
            <p className="text-xs text-muted-foreground">Expenses</p>
            <p className="text-sm font-mono font-bold">
              -{formatCurrency(monthlyExpenses, "MAD")}
            </p>
          </div>
          <div className="rounded-lg bg-muted p-2.5">
            <p className="text-xs text-muted-foreground">Net</p>
            <p className="text-sm font-mono font-bold">
              {monthlyNet >= 0 ? "+" : ""}
              {formatCurrency(monthlyNet, "MAD")}
            </p>
          </div>
          <div className="rounded-lg bg-muted p-2.5">
            <p className="text-xs text-muted-foreground">End Balance</p>
            <p className="text-sm font-mono font-bold">
              {formatCurrency(endOfMonthBalance, "MAD")}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
          {/* Weekday headers */}
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="bg-muted px-1 py-2 text-center text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}

          {/* Empty cells for offset */}
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-background p-1 min-h-[80px]" />
          ))}

          {/* Day cells */}
          {days.map((day) => {
            const hasEntries = day.income.length > 0 || day.expenses.length > 0;
            return (
              <div
                key={day.date.toISOString()}
                className={`bg-background p-1.5 min-h-[80px] flex flex-col ${
                  isToday(day.date) ? "ring-2 ring-primary ring-inset" : ""
                }`}
              >
                <span
                  className={`text-xs font-medium ${
                    isToday(day.date)
                      ? "text-primary font-bold"
                      : "text-muted-foreground"
                  }`}
                >
                  {day.date.getDate()}
                </span>

                {/* Entries */}
                <div className="flex-1 mt-0.5 space-y-0.5 overflow-hidden">
                  {day.income.map((item, i) => (
                    <div
                      key={`in-${i}`}
                      className="flex items-center gap-0.5 text-[10px] leading-tight"
                    >
                      <TrendingUp className="h-2.5 w-2.5 shrink-0 text-muted-foreground" />
                      <span className="truncate">{item.name}</span>
                    </div>
                  ))}
                  {day.expenses.map((item, i) => (
                    <div
                      key={`out-${i}`}
                      className="flex items-center gap-0.5 text-[10px] leading-tight"
                    >
                      <TrendingDown className="h-2.5 w-2.5 shrink-0 text-muted-foreground" />
                      <span className="truncate">{item.name}</span>
                    </div>
                  ))}
                </div>

                {/* Running balance */}
                {hasEntries && (
                  <div className="mt-auto pt-0.5">
                    <span className="text-[10px] font-mono font-medium text-muted-foreground">
                      {day.runningBalance >= 0
                        ? (day.runningBalance / 1000).toFixed(1) + "k"
                        : "-" + (Math.abs(day.runningBalance) / 1000).toFixed(1) + "k"}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground mt-3 text-center">
          All amounts converted to MAD for projection
        </p>
      </CardContent>
    </Card>
  );
}
