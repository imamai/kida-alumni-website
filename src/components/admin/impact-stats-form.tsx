"use client";

import { useActionState, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateImpactStats, type SettingsActionState } from "@/app/actions/admin-settings";
import type { ImpactStat } from "@/lib/data/settings";

const initialState: SettingsActionState = { status: "idle" };
const MAX_STATS = 8;

export function ImpactStatsForm({ stats }: { stats: ImpactStat[] }) {
  const [state, formAction, pending] = useActionState(updateImpactStats, initialState);
  // Seeded once from props, same reasoning as BrandingSettingsForm: these are uncontrolled
  // fields, so defaultValue must stay stable across revalidatePath-driven prop updates.
  const [initialStats] = useState(stats);
  const [rows, setRows] = useState(initialStats.map((_, i) => i));
  const [nextId, setNextId] = useState(initialStats.length);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="stat_count" value={rows.length} />
      <div className="space-y-4">
        {rows.map((rowId, i) => {
          const stat = initialStats[rowId];
          return (
            <div key={rowId} className="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-[1fr_auto_auto_auto]">
              <div className="space-y-1.5">
                <Label htmlFor={`stat_${i}_label`}>Label</Label>
                <Input
                  id={`stat_${i}_label`}
                  name={`stat_${i}_label`}
                  defaultValue={stat?.label}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`stat_${i}_value`}>Value</Label>
                <Input
                  id={`stat_${i}_value`}
                  name={`stat_${i}_value`}
                  type="number"
                  min={0}
                  className="w-28"
                  defaultValue={stat?.value}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`stat_${i}_suffix`}>Suffix</Label>
                <Input
                  id={`stat_${i}_suffix`}
                  name={`stat_${i}_suffix`}
                  className="w-20"
                  defaultValue={stat?.suffix ?? ""}
                  placeholder="+"
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  disabled={rows.length <= 1}
                  onClick={() => setRows((r) => r.filter((id) => id !== rowId))}
                >
                  Remove
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Button
        type="button"
        variant="outline"
        disabled={rows.length >= MAX_STATS}
        onClick={() => {
          setRows((r) => [...r, nextId]);
          setNextId((n) => n + 1);
        }}
      >
        Add Statistic
      </Button>

      {state.status !== "idle" && (
        <p className={state.status === "error" ? "text-sm text-destructive" : "text-sm text-kida-purple"}>
          {state.message}
        </p>
      )}
      <div>
        <Button type="submit" disabled={pending} className="bg-kida-purple hover:bg-kida-purple-dark">
          {pending ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
