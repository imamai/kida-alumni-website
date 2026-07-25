import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GalleryAlbumStatusBadge } from "@/components/admin/gallery-album-status-badge";
import { GalleryAlbumStatusActions } from "@/components/admin/gallery-album-status-actions";
import { getAlbumsList } from "@/lib/data/admin-gallery";

export const metadata: Metadata = { title: "Gallery" };

export default async function GalleryAlbumsPage() {
  const albums = await getAlbumsList();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Gallery</h1>
          <p className="mt-1 text-sm text-muted-foreground">Photo albums shown in the public gallery and homepage preview.</p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/gallery/new" />} className="bg-kida-purple hover:bg-kida-purple-dark">
          New Album
        </Button>
      </div>

      {albums.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">No albums yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <div key={album.id} className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="relative aspect-[16/10] bg-muted/40">
                {album.cover_url ? (
                  <Image src={album.cover_url} alt="" fill className="object-cover" sizes="33vw" />
                ) : null}
              </div>
              <div className="space-y-2 p-4">
                <div className="flex items-center justify-between gap-2">
                  <Link href={`/admin/gallery/${album.id}`} className="font-medium hover:underline">
                    {album.title}
                  </Link>
                  <GalleryAlbumStatusBadge status={album.status} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {album.item_count} photo{album.item_count === 1 ? "" : "s"}
                </p>
                <GalleryAlbumStatusActions id={album.id} status={album.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
