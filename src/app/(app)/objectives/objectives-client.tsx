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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
        <Label htmlFor="name">Objective Name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={objective?.name}
          placeholder="e.g. Tracer 9"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="target_amount">Target Amount</Label>
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
        <Label htmlFor="currency_id">Currency</Label>
        <Select
          name="currency_id"
          defaultValue={objective?.currency_id || currencies[0]?.id}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.symbol} {c.code} — {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="current_saved">Currently Saved</Label>
        <Input
          id="current_saved"
          name="current_saved"
          type="number"
          step="0.01"
          defaultValue={objective?.current_saved || 0}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="priority">Priority (lower = higher priority)</Label>
        <Input
          id="priority"
          name="priority"
          type="number"
          defaultValue={objective?.priority || 0}
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
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
  const [editObjective, setEditObjective] = useState<ObjectiveWithCurrency | undefined>();
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Objectives</h1>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) setEditObjective(undefined);
          }}
        >
          <DialogTrigger render={<Button />}>+ Add Objective</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editObjective ? "Edit Objective" : "Add Objective"}
              </DialogTitle>
              <DialogDescription>
                {editObjective
                  ? "Update your objective"
                  : "Add something you want to save for"}
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

      <div className="grid gap-4 md:grid-cols-2">
        {objectives.length === 0 ? (
          <Card className="col-span-2">
            <CardContent className="py-8 text-center text-muted-foreground">
              No objectives yet. Click &quot;+ Add Objective&quot; to get
              started.
            </CardContent>
          </Card>
        ) : (
          objectives.map((obj) => {
            const progress =
              obj.target_amount > 0
                ? (obj.current_saved / obj.target_amount) * 100
                : 0;
            const remaining = Math.max(
              obj.target_amount - obj.current_saved,
              0
            );

            return (
              <Card
                key={obj.id}
                className={obj.completed ? "opacity-60" : ""}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {obj.completed ? "✅" : "🎯"} {obj.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        <Badge variant="secondary">
                          {obj.currencies.code}
                        </Badge>{" "}
                        Priority: {obj.priority}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleToggleComplete(obj.id, obj.completed)
                        }
                      >
                        {obj.completed ? "Undo" : "Done"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditObjective(obj);
                          setDialogOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDelete(obj.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>
                      Saved:{" "}
                      {formatCurrency(
                        obj.current_saved,
                        obj.currencies.code
                      )}
                    </span>
                    <span>
                      Target:{" "}
                      {formatCurrency(
                        obj.target_amount,
                        obj.currencies.code
                      )}
                    </span>
                  </div>
                  <Progress value={Math.min(progress, 100)} />
                  <p className="text-sm text-muted-foreground">
                    {progress.toFixed(1)}% complete —{" "}
                    {formatCurrency(remaining, obj.currencies.code)} remaining
                  </p>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
