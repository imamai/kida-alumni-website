import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/page-header";
import { getPublishedAlbums } from "@/lib/data/content";

export const metadata: Metadata = { title: "Gallery" };

const PAGE_SIZE = 12;
const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop";

export default async function GalleryPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: rawPage } = await searchParams;
  const page = Math.max(1, Number(rawPage) || 1);

  const { items, total } = await getPublishedAlbums({ page, pageSize: PAGE_SIZE });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <PageHeader eyebrow="Moments" title="Gallery" description="Photos from reunions, chapter meetups, and life at KIDA." />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {items.length === 0 ? (
          <p className="text-center text-muted-foreground">No albums published yet — check back soon.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((album) => (
              <Link
                key={album.id}
                href={`/gallery/${album.slug}`}
                className="group block overflow-hidden rounded-2xl border border-border bg-card"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={album.cover_media?.url ?? PLACEHOLDER_IMAGE}
                    alt={album.cover_media?.alt_text ?? ""}
                    fill
                    sizes="(min-width: 1024px) 33vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-lg font-medium group-hover:text-kida-purple">{album.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {album.item_count} photo{album.item_count === 1 ? "" : "s"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                nativeButton={false}
                render={<Link href={`/gallery?page=${page - 1}`} />}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                nativeButton={false}
                render={<Link href={`/gallery?page=${page + 1}`} />}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
