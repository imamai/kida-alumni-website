import Link from "next/link";
import { Button } from "@/components/ui/button";
import { setMilestoneStatus, deleteMilestone } from "@/app/actions/admin-timeline";
import type { MilestoneStatus } from "@/lib/data/admin-timeline";

export function TimelineStatusActions({ id, status }: { id: string; status: MilestoneStatus }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="outline" nativeButton={false} render={<Link href={`/admin/timeline/${id}`} />}>
        Edit
      </Button>
      <form action={setMilestoneStatus.bind(null, id, status === "active" ? "inactive" : "active")}>
        <Button type="submit" size="sm" variant={status === "active" ? "outline" : "default"}>
          {status === "active" ? "Hide" : "Show"}
        </Button>
      </form>
      <form action={deleteMilestone.bind(null, id)}>
        <Button type="submit" size="sm" variant="outline">
          Delete
        </Button>
      </form>
    </div>
  );
}
