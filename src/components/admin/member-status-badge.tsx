import { Badge } from "@/components/ui/badge";
import type { MembershipStatus } from "@/lib/data/members";

const STATUS_CONFIG: Record<MembershipStatus, { label: string; variant: "default" | "outline" | "destructive" }> = {
  pending: { label: "Pending", variant: "outline" },
  verified: { label: "Verified", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
  suspended: { label: "Suspended", variant: "destructive" },
};

export function MemberStatusBadge({ status }: { status: MembershipStatus }) {
  const { label, variant } = STATUS_CONFIG[status];
  return <Badge variant={variant}>{label}</Badge>;
}
