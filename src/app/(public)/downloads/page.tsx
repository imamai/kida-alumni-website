import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { getDocuments } from "@/lib/data/content";

export const metadata: Metadata = { title: "Downloads" };

function formatBytes(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function DownloadsPage() {
  const documents = await getDocuments();

  return (
    <>
      <PageHeader eyebrow="Resources" title="Downloads" description="Constitution, forms, and other documents published by KIDA." />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        {documents.length === 0 ? (
          <p className="text-center text-muted-foreground">No documents published yet — check back soon.</p>
        ) : (
          <ul className="divide-y divide-border rounded-2xl border border-border">
            {documents.map((doc) => (
              <li key={doc.id}>
                <a href={doc.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 hover:bg-muted">
                  <FileText className="size-5 shrink-0 text-kida-purple" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{doc.caption ?? doc.folder}</p>
                    <p className="text-xs text-muted-foreground">{formatBytes(doc.size_bytes)}</p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
