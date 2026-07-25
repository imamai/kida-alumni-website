import Link from "next/link";
import { Button } from "@/components/ui/button";
import { setAlbumStatus, deleteAlbum } from "@/app/actions/admin-gallery";
import type { GalleryAlbumStatus } from "@/lib/data/admin-gallery";

export function GalleryAlbumStatusActions({ id, status }: { id: string; status: GalleryAlbumStatus }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="outline" nativeButton={false} render={<Link href={`/admin/gallery/${id}`} />}>
        Edit
      </Button>
      {status === "draft" && (
        <form action={setAlbumStatus.bind(null, id, "published")}>
          <Button type="submit" size="sm">
            Publish
          </Button>
        </form>
      )}
      {status === "published" && (
        <form action={setAlbumStatus.bind(null, id, "archived")}>
          <Button type="submit" size="sm" variant="destructive">
            Archive
          </Button>
        </form>
      )}
      {status === "archived" && (
        <form action={setAlbumStatus.bind(null, id, "draft")}>
          <Button type="submit" size="sm" variant="outline">
            Restore to Draft
          </Button>
        </form>
      )}
      <form action={deleteAlbum.bind(null, id)}>
        <Button type="submit" size="sm" variant="outline">
          Delete
        </Button>
      </form>
    </div>
  );
}
