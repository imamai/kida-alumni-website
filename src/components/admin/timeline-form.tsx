"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createMilestone, updateMilestone, type TimelineActionState } from "@/app/actions/admin-timeline";
import type { MilestoneItem } from "@/lib/data/admin-timeline";

const initialState: TimelineActionState = { status: "idle" };

export function TimelineForm({ milestone }: { milestone?: MilestoneItem }) {
  const action = milestone ? updateMilestone.bind(null, milestone.id) : createMilestone;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
        <div className="space-y-1.5">
          <Label htmlFor="year">Year</Label>
          <Input id="year" name="year" defaultValue={milestone?.year} placeholder="1985" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={milestone?.title} required />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={milestone?.description} rows={3} required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="sort_order">Sort Order</Label>
          <Input id="sort_order" name="sort_order" type="number" min={0} defaultValue={milestone?.sort_order ?? 0} />
          <p className="text-xs text-muted-foreground">Lower numbers appear first on the timeline.</p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={milestone?.status ?? "active"}>
            <SelectTrigger id="status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active (shown on homepage)</SelectItem>
              <SelectItem value="inactive">Inactive (hidden)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {state.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}

      <Button type="submit" disabled={pending} className="bg-kida-purple hover:bg-kida-purple-dark">
        {pending ? "Saving…" : milestone ? "Save Changes" : "Add Milestone"}
      </Button>
    </form>
  );
}
