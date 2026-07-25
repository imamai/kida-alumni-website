import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FileText, Video } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MediaUploadForm } from "@/components/admin/media-upload-form";
import { getMediaList, getMediaFolders, type MediaType } from "@/lib/data/admin-media";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Media Library" };

const PAGE_SIZE = 24;
const TYPE_TABS: { label: string; value?: MediaType }[] = [
  { label: "All" },
  { label: "Images", value: "image" },
  { label: "Videos", value: "video" },
  { label: "Documents", value: "document" },
];

function formatBytes(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function MediaLibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; folder?: string; q?: string; page?: string }>;
}) {
  const { type: rawType, folder: rawFolder, q, page: rawPage } = await searchParams;
  const type = TYPE_TABS.some((t) => t.value === rawType) ? (rawType as MediaType) : undefined;
  const page = Math.max(1, Number(rawPage) || 1);

  const [{ items, total }, folders] = await Promise.all([
    getMediaList({ type, folder: rawFolder, search: q, page, pageSize: PAGE_SIZE }),
    getMediaFolders(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const baseParams = { ...(type ? { type } : {}), ...(rawFolder ? { folder: rawFolder } : {}), ...(q ? { q } : {}) };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Media Library</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every image, video, and document uploaded across the site — branding, news, events, and more.
        </p>
      </div>

      <MediaUploadForm />

      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {TYPE_TABS.map((tab) => {
          const active = type === tab.value;
          return (
            <Link
              key={tab.label}
              href={`/admin/media${tab.value ? `?type=${tab.value}` : ""}`}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted",
                active && "bg-kida-purple/10 text-kida-purple",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {folders.length > 0 && (
          <div className="flex flex-wrap gap-1.5 text-sm">
            <Link
              href={`/admin/media${type ? `?type=${type}` : ""}`}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs",
                !rawFolder ? "bg-kida-purple/10 text-kida-purple" : "text-muted-foreground hover:bg-muted",
              )}
            >
              All folders
            </Link>
            {folders.map((folder) => (
              <Link
                key={folder}
                href={`/admin/media?${new URLSearchParams({ ...(type ? { type } : {}), folder })}`}
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs",
                  rawFolder === folder ? "bg-kida-purple/10 text-kida-purple" : "text-muted-foreground hover:bg-muted",
                )}
              >
                {folder}
              </Link>
            ))}
          </div>
        )}
        <form method="get" className="ml-auto flex max-w-xs gap-2">
          {type && <input type="hidden" name="type" value={type} />}
          {rawFolder && <input type="hidden" name="folder" value={rawFolder} />}
          <Input name="q" placeholder="Search alt text, caption…" defaultValue={q} />
          <Button type="submit" variant="outline">
            Search
          </Button>
        </form>
      </div>

      {items.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">No files found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/admin/media/${item.id}`}
              className="group overflow-hidden rounded-xl border border-border bg-card"
            >
              <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-muted/40">
                {item.type === "image" ? (
                  <Image
                    src={item.url}
                    alt={item.alt_text ?? ""}
                    fill
                    sizes="(min-width: 1024px) 16vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : item.type === "video" ? (
                  <Video className="size-8 text-muted-foreground" />
                ) : (
                  <FileText className="size-8 text-muted-foreground" />
                )}
              </div>
              <div className="p-2">
                <p className="truncate text-xs font-medium">{item.folder}</p>
                <p className="text-[11px] text-muted-foreground">{formatBytes(item.size_bytes)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Page {page} of {totalPages} ({total} files)
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              nativeButton={false}
              render={<Link href={`/admin/media?${new URLSearchParams({ ...baseParams, page: String(page - 1) })}`} />}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              nativeButton={false}
              render={<Link href={`/admin/media?${new URLSearchParams({ ...baseParams, page: String(page + 1) })}`} />}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
