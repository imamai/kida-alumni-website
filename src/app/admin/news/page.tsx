import type { Metadata } from "next";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { NewsStatusBadge } from "@/components/admin/news-status-badge";
import { NewsStatusActions } from "@/components/admin/news-status-actions";
import { getNewsList, getNewsStatusCounts, type NewsStatus } from "@/lib/data/admin-news";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "News & Announcements" };

const PAGE_SIZE = 20;
const STATUS_TABS: { label: string; value?: NewsStatus }[] = [
  { label: "All" },
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Archived", value: "archived" },
];

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  const { status: rawStatus, q, page: rawPage } = await searchParams;
  const status = STATUS_TABS.some((t) => t.value === rawStatus) ? (rawStatus as NewsStatus) : undefined;
  const page = Math.max(1, Number(rawPage) || 1);

  const [{ items, total }, counts] = await Promise.all([
    getNewsList({ status, search: q, page, pageSize: PAGE_SIZE }),
    getNewsStatusCounts(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const allCount = counts.draft + counts.published + counts.archived;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold">News & Announcements</h1>
          <p className="mt-1 text-sm text-muted-foreground">Publish news, announcements, and blog posts.</p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/news/new" />} className="bg-kida-purple hover:bg-kida-purple-dark">
          New Post
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {STATUS_TABS.map((tab) => {
          const active = status === tab.value;
          const count = tab.value ? counts[tab.value] : allCount;
          return (
            <Link
              key={tab.label}
              href={`/admin/news${tab.value ? `?status=${tab.value}` : ""}`}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted",
                active && "bg-kida-purple/10 text-kida-purple",
              )}
            >
              {tab.label} <span className="text-muted-foreground">({count})</span>
            </Link>
          );
        })}
      </div>

      <form method="get" className="flex max-w-sm gap-2">
        {status && <input type="hidden" name="status" value={status} />}
        <Input name="q" placeholder="Search by title…" defaultValue={q} />
        <Button type="submit" variant="outline">
          Search
        </Button>
      </form>

      <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  No posts found.
                </TableCell>
              </TableRow>
            )}
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Link href={`/admin/news/${item.id}`} className="font-medium hover:underline">
                    {item.title}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground capitalize">{item.type}</TableCell>
                <TableCell className="text-muted-foreground">{item.category_name ?? "—"}</TableCell>
                <TableCell>
                  <NewsStatusBadge status={item.status} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(item.published_at ?? item.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <NewsStatusActions id={item.id} status={item.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Page {page} of {totalPages} ({total} posts)
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              nativeButton={false}
              render={
                <Link
                  href={`/admin/news?${new URLSearchParams({ ...(status ? { status } : {}), ...(q ? { q } : {}), page: String(page - 1) })}`}
                />
              }
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              nativeButton={false}
              render={
                <Link
                  href={`/admin/news?${new URLSearchParams({ ...(status ? { status } : {}), ...(q ? { q } : {}), page: String(page + 1) })}`}
                />
              }
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
