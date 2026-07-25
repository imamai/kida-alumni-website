import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GalleryAlbumForm } from "@/components/admin/gallery-album-form";

export const metadata: Metadata = { title: "New Album" };

export default function NewAlbumPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/gallery"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Gallery
      </Link>

      <div>
        <h1 className="font-heading text-2xl font-semibold">New Album</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create the album first, then add photos to it.</p>
      </div>

      <GalleryAlbumForm />
    </div>
  );
}
