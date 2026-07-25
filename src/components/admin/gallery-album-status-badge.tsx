import { Badge } from "@/components/ui/badge";
import type { GalleryAlbumStatus } from "@/lib/data/admin-gallery";

const STATUS_CONFIG: Record<GalleryAlbumStatus, { label: string; variant: "default" | "outline" | "destructive" }> = {
  draft: { label: "Draft", variant: "outline" },
  published: { label: "Published", variant: "default" },
  archived: { label: "Archived", variant: "destructive" },
};

export function GalleryAlbumStatusBadge({ status }: { status: GalleryAlbumStatus }) {
  const { label, variant } = STATUS_CONFIG[status];
  return <Badge variant={variant}>{label}</Badge>;
}
