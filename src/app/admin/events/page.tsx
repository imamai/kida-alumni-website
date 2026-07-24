import type { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { EventStatusBadge } from "@/components/admin/event-status-badge";
import { EventStatusActions } from "@/components/admin/event-status-actions";
import { getEventsList, getEventStatusCounts, type EventStatus } from "@/lib/data/admin-events";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Events" };

const PAGE_SIZE = 20;
const STATUS_TABS: { label: string; value?: EventStatus }[] = [
  { label: "All" },
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  const { status: rawStatus, q, page: rawPage } = await searchParams;
  const status = STATUS_TABS.some((t) => t.value === rawStatus) ? (rawStatus as EventStatus) : undefined;
  const page = Math.max(1, Number(rawPage) || 1);

  const [{ items, total }, counts] = await Promise.all([
    getEventsList({ status, search: q, page, pageSize: PAGE_SIZE }),
    getEventStatusCounts(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const allCount = counts.draft + counts.published + counts.cancelled + counts.completed;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Events</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage AGMs, reunions, chapter meetings, and more.</p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/events/new" />} className="bg-kida-purple hover:bg-kida-purple-dark">
          New Event
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {STATUS_TABS.map((tab) => {
          const active = status === tab.value;
          const count = tab.value ? counts[tab.value] : allCount;
          return (
            <Link
              key={tab.label}
              href={`/admin/events${tab.value ? `?status=${tab.value}` : ""}`}
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
              <TableHead>Category</TableHead>
              <TableHead>When</TableHead>
              <TableHead>Where</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  No events found.
                </TableCell>
              </TableRow>
            )}
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Link href={`/admin/events/${item.id}`} className="font-medium hover:underline">
                    {item.title}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground capitalize">{item.category.replace("_", " ")}</TableCell>
                <TableCell className="text-muted-foreground">{format(new Date(item.start_at), "MMM d, yyyy h:mm a")}</TableCell>
                <TableCell className="text-muted-foreground">{item.is_virtual ? "Virtual" : (item.location_name ?? "—")}</TableCell>
                <TableCell>
                  <EventStatusBadge status={item.status} />
                </TableCell>
                <TableCell>
                  <EventStatusActions id={item.id} status={item.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Page {page} of {totalPages} ({total} events)
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              nativeButton={false}
              render={
                <Link
                  href={`/admin/events?${new URLSearchParams({ ...(status ? { status } : {}), ...(q ? { q } : {}), page: String(page - 1) })}`}
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
                  href={`/admin/events?${new URLSearchParams({ ...(status ? { status } : {}), ...(q ? { q } : {}), page: String(page + 1) })}`}
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
