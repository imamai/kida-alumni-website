import Link from "next/link";
import { Button } from "@/components/ui/button";
import { setLeaderStatus, deleteLeader } from "@/app/actions/admin-leadership";
import type { LeadershipStatus } from "@/lib/data/admin-leadership";

export function LeadershipStatusActions({ id, status }: { id: string; status: LeadershipStatus }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="outline" nativeButton={false} render={<Link href={`/admin/leadership/${id}`} />}>
        Edit
      </Button>
      <form action={setLeaderStatus.bind(null, id, status === "active" ? "inactive" : "active")}>
        <Button type="submit" size="sm" variant={status === "active" ? "outline" : "default"}>
          {status === "active" ? "Hide" : "Show"}
        </Button>
      </form>
      <form action={deleteLeader.bind(null, id)}>
        <Button type="submit" size="sm" variant="outline">
          Delete
        </Button>
      </form>
    </div>
  );
}
