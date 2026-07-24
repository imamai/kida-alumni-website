import Link from "next/link";
import { Button } from "@/components/ui/button";
import { setEventStatus, deleteEvent } from "@/app/actions/admin-events";
import type { EventStatus } from "@/lib/data/admin-events";

function StatusForm({
  id,
  target,
  label,
  variant,
}: {
  id: string;
  target: EventStatus;
  label: string;
  variant: "default" | "outline" | "destructive";
}) {
  return (
    <form action={setEventStatus.bind(null, id, target)}>
      <Button type="submit" size="sm" variant={variant}>
        {label}
      </Button>
    </form>
  );
}

export function EventStatusActions({ id, status }: { id: string; status: EventStatus }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="outline" nativeButton={false} render={<Link href={`/admin/events/${id}`} />}>
        Edit
      </Button>
      {status === "draft" && <StatusForm id={id} target="published" label="Publish" variant="default" />}
      {status === "published" && (
        <>
          <StatusForm id={id} target="completed" label="Mark Completed" variant="outline" />
          <StatusForm id={id} target="cancelled" label="Cancel" variant="destructive" />
        </>
      )}
      {(status === "cancelled" || status === "completed") && (
        <StatusForm id={id} target="draft" label="Restore to Draft" variant="outline" />
      )}
      <form action={deleteEvent.bind(null, id)}>
        <Button type="submit" size="sm" variant="outline">
          Delete
        </Button>
      </form>
    </div>
  );
}
