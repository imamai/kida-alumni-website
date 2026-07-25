import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, Video } from "lucide-react";
import { MediaEditForm } from "@/components/admin/media-edit-form";
import { getMediaById } from "@/lib/data/admin-media";

export const metadata: Metadata = { title: "Edit Media" };

function formatBytes(bytes: number | null) {
  if (!bytes) return "Unknown size";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function MediaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const media = await getMediaById(id);
  if (!media) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/media"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Media Library
      </Link>

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <div>
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/40">
            {media.type === "image" ? (
              <Image src={media.url} alt={media.alt_text ?? ""} width={320} height={320} className="h-full w-full object-cover" />
            ) : media.type === "video" ? (
              <Video className="size-10 text-muted-foreground" />
            ) : (
              <FileText className="size-10 text-muted-foreground" />
            )}
          </div>
          <dl className="mt-4 space-y-1.5 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <dt>Type</dt>
              <dd className="capitalize">{media.type}</dd>
            </div>
            <div className="flex justify-between">
              <dt>MIME</dt>
              <dd>{media.mime_type ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Size</dt>
              <dd>{formatBytes(media.size_bytes)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Uploaded</dt>
              <dd>{new Date(media.created_at).toLocaleDateString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt>URL</dt>
              <dd className="max-w-40 truncate">
                <a href={media.url} target="_blank" rel="noreferrer" className="text-kida-purple hover:underline">
                  {media.url}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h1 className="font-heading text-2xl font-semibold">Edit Media</h1>
          <p className="mt-1 mb-6 text-sm text-muted-foreground">Update accessibility text, caption, and folder.</p>
          <MediaEditForm media={media} />
        </div>
      </div>
    </div>
  );
}
