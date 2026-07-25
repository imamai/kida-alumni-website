import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { TimelineStatusActions } from "@/components/admin/timeline-status-actions";
import { getMilestonesList } from "@/lib/data/admin-timeline";

export const metadata: Metadata = { title: "Timeline" };

export default async function TimelinePage() {
  const items = await getMilestonesList();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Timeline</h1>
          <p className="mt-1 text-sm text-muted-foreground">The &ldquo;Our Journey&rdquo; milestones shown on the homepage.</p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/timeline/new" />} className="bg-kida-purple hover:bg-kida-purple-dark">
          Add Milestone
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Year</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  No milestones yet.
                </TableCell>
              </TableRow>
            )}
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.year}</TableCell>
                <TableCell>
                  <Link href={`/admin/timeline/${item.id}`} className="hover:underline">
                    {item.title}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{item.sort_order}</TableCell>
                <TableCell>
                  <Badge variant={item.status === "active" ? "default" : "outline"}>
                    {item.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <TimelineStatusActions id={item.id} status={item.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
