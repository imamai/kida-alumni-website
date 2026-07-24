import { Badge } from "@/components/ui/badge";
import type { EventStatus } from "@/lib/data/admin-events";

const STATUS_CONFIG: Record<EventStatus, { label: string; variant: "default" | "outline" | "destructive" }> = {
  draft: { label: "Draft", variant: "outline" },
  published: { label: "Published", variant: "default" },
  cancelled: { label: "Cancelled", variant: "destructive" },
  completed: { label: "Completed", variant: "outline" },
};

export function EventStatusBadge({ status }: { status: EventStatus }) {
  const { label, variant } = STATUS_CONFIG[status];
  return <Badge variant={variant}>{label}</Badge>;
}
