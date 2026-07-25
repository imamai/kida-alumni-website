import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAlbumBySlug } from "@/lib/data/content";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const album = await getAlbumBySlug(slug);
  return { title: album?.title ?? "Gallery" };
}

export default async function AlbumDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const album = await getAlbumBySlug(slug);
  if (!album) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/gallery" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to Gallery
      </Link>

      <h1 className="mt-6 font-heading text-3xl font-semibold text-balance sm:text-4xl">{album.title}</h1>
      {album.description && <p className="mt-3 max-w-2xl text-muted-foreground text-pretty">{album.description}</p>}

      {album.photos.length === 0 ? (
        <p className="mt-10 text-muted-foreground">No photos in this album yet.</p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {album.photos.map((photo) => (
            <a key={photo.id} href={photo.url} target="_blank" rel="noreferrer" className="group block">
              <div className="relative aspect-square overflow-hidden rounded-xl">
                <Image
                  src={photo.url}
                  alt={photo.alt_text ?? ""}
                  fill
                  sizes="(min-width: 1024px) 25vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              {photo.caption && <p className="mt-1.5 text-xs text-muted-foreground">{photo.caption}</p>}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
