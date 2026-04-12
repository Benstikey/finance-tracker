"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createObjective,
  updateObjective,
  deleteObjective,
  toggleObjectiveComplete,
} from "./actions";
import type { ObjectiveWithCurrency, Currency } from "@/lib/types/database";
import { formatCurrency } from "@/lib/exchange-rates";
import {
  Target,
  CircleCheck,
  Pencil,
  Trash2,
  Plus,
  Check,
  Undo2,
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
import { Separator } from "@/components/ui/separator";

function CircularProgress({
  value,
  size = 120,
  strokeWidth = 8,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(value, 100) / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/50"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-foreground transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold font-mono">
          {Math.round(value)}%
        </span>
      </div>
    </div>
  );
}

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

function ObjectiveForm({
  currencies,
  objective,
  onDone,
}: {
  currencies: Currency[];
  objective?: ObjectiveWithCurrency;
  onDone: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [currencyId, setCurrencyId] = useState(
    objective?.currency_id || currencies[0]?.id || ""
  );
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      if (objective) {
        formData.set("id", objective.id);
        formData.set("completed", String(objective.completed));
        await updateObjective(formData);
      } else {
        await createObjective(formData);
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
        <Label htmlFor="name">What do you want to buy?</Label>
        <Input
          id="name"
          name="name"
          defaultValue={objective?.name}
          placeholder="e.g. Yamaha Tracer 9"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="target_amount">Target Price</Label>
          <Input
            id="target_amount"
            name="target_amount"
            type="number"
            step="0.01"
            defaultValue={objective?.target_amount}
            placeholder="136000"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="current_saved">Already Saved</Label>
          <Input
            id="current_saved"
            name="current_saved"
            type="number"
            step="0.01"
            defaultValue={objective?.current_saved || 0}
          />
        </div>
      </div>
      <CurrencySelect
        currencies={currencies}
        value={currencyId}
        onChange={setCurrencyId}
      />
      <div className="space-y-2">
        <Label htmlFor="priority">Priority (1 = highest)</Label>
        <Input
          id="priority"
          name="priority"
          type="number"
          defaultValue={objective?.priority || 1}
          min={1}
        />
      </div>
      <Button type="submit" className="w-full h-11" disabled={loading}>
        {loading
          ? "Saving..."
          : objective
            ? "Update Objective"
            : "Add Objective"}
      </Button>
    </form>
  );
}

export function ObjectivesClient({
  objectives,
  currencies,
}: {
  objectives: ObjectiveWithCurrency[];
  currencies: Currency[];
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editObjective, setEditObjective] = useState<
    ObjectiveWithCurrency | undefined
  >();
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm("Delete this objective?")) return;
    await deleteObjective(id);
    router.refresh();
  }

  async function handleToggleComplete(id: string, completed: boolean) {
    await toggleObjectiveComplete(id, !completed);
    router.refresh();
  }

  const activeObjectives = objectives.filter((o) => !o.completed);
  const completedObjectives = objectives.filter((o) => o.completed);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Objectives</h1>
          <p className="text-muted-foreground">
            Track your savings goals
          </p>
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditObjective(undefined);
          }}
        >
          <DialogTrigger render={<Button />}>
            <Plus className="h-4 w-4 mr-1" /> Add Objective
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editObjective ? "Edit Objective" : "New Objective"}
              </DialogTitle>
              <DialogDescription>
                {editObjective
                  ? "Update your savings goal"
                  : "Set a new savings target"}
              </DialogDescription>
            </DialogHeader>
            <ObjectiveForm
              currencies={currencies}
              objective={editObjective}
              onDone={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {objectives.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No objectives yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Set a savings target for something you want to buy and track your
              progress toward it.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Active objectives */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeObjectives.map((obj) => {
              const progress =
                obj.target_amount > 0
                  ? (obj.current_saved / obj.target_amount) * 100
                  : 0;
              const remaining = Math.max(
                obj.target_amount - obj.current_saved,
                0
              );

              return (
                <Card key={obj.id} className="relative overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{obj.name}</CardTitle>
                        <CardDescription>
                          <Badge variant="secondary" className="font-mono">
                            {obj.currencies.code}
                          </Badge>
                        </CardDescription>
                      </div>
                      <div className="flex gap-0.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() =>
                            handleToggleComplete(obj.id, obj.completed)
                          }
                        >
                          <Check className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            setEditObjective(obj);
                            setDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive"
                          onClick={() => handleDelete(obj.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="flex items-center gap-6">
                      <CircularProgress value={progress} />
                      <div className="flex-1 space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">
                            Saved
                          </p>
                          <p className="text-xl font-bold font-mono">
                            {formatCurrency(
                              obj.current_saved,
                              obj.currencies.code
                            )}
                          </p>
                        </div>
                        <Separator />
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">
                            Remaining
                          </p>
                          <p className="text-sm font-mono font-medium text-muted-foreground">
                            {formatCurrency(remaining, obj.currencies.code)}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Bottom bar showing target */}
                    <div className="mt-4 flex items-center justify-between rounded-lg bg-muted px-3 py-2">
                      <span className="text-xs text-muted-foreground">
                        Target
                      </span>
                      <span className="text-sm font-mono font-bold">
                        {formatCurrency(
                          obj.target_amount,
                          obj.currencies.code
                        )}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Completed objectives */}
          {completedObjectives.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Completed
              </h2>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {completedObjectives.map((obj) => (
                  <Card
                    key={obj.id}
                    className="opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <CircleCheck className="h-5 w-5" />
                        <div>
                          <p className="font-medium">{obj.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {formatCurrency(
                              obj.target_amount,
                              obj.currencies.code
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() =>
                            handleToggleComplete(obj.id, obj.completed)
                          }
                        >
                          <Undo2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive"
                          onClick={() => handleDelete(obj.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
