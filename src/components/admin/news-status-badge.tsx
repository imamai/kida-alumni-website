import { Badge } from "@/components/ui/badge";
import type { NewsStatus } from "@/lib/data/admin-news";

const STATUS_CONFIG: Record<NewsStatus, { label: string; variant: "default" | "outline" | "destructive" }> = {
  draft: { label: "Draft", variant: "outline" },
  published: { label: "Published", variant: "default" },
  archived: { label: "Archived", variant: "destructive" },
};

export function NewsStatusBadge({ status }: { status: NewsStatus }) {
  const { label, variant } = STATUS_CONFIG[status];
  return <Badge variant={variant}>{label}</Badge>;
}
