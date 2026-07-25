import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { GalleryAlbumForm } from "@/components/admin/gallery-album-form";
import { GalleryPhotoUpload } from "@/components/admin/gallery-photo-upload";
import { GalleryItemCard } from "@/components/admin/gallery-item-card";
import { GalleryMediaPicker } from "@/components/admin/gallery-media-picker";
import { getAlbumById, getPickableImages } from "@/lib/data/admin-gallery";

export const metadata: Metadata = { title: "Edit Album" };

export default async function EditAlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const album = await getAlbumById(id);
  if (!album) notFound();

  const pickableImages = await getPickableImages({
    excludeMediaIds: album.items.map((item) => item.media_id),
  });

  return (
    <div className="space-y-10">
      <Link
        href="/admin/gallery"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Gallery
      </Link>

      <section className="space-y-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Edit Album</h1>
          <p className="mt-1 text-sm text-muted-foreground">{album.title}</p>
        </div>
        <GalleryAlbumForm album={album} />
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-semibold">Photos ({album.items.length})</h2>
        <GalleryPhotoUpload albumId={album.id} />

        {album.items.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {album.items.map((item) => (
              <GalleryItemCard key={item.id} item={item} albumId={album.id} isCover={item.media_id === album.cover_media_id} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-semibold">Add from Media Library</h2>
        <p className="text-sm text-muted-foreground">Reuse a photo already uploaded elsewhere instead of uploading it again.</p>
        <GalleryMediaPicker albumId={album.id} media={pickableImages} />
      </section>
    </div>
  );
}
