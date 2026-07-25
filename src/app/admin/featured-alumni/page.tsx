import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { FeaturedAlumniStatusActions } from "@/components/admin/featured-alumni-status-actions";
import { getFeaturedAlumniList } from "@/lib/data/admin-featured-alumni";

export const metadata: Metadata = { title: "Featured Alumni" };

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function FeaturedAlumniPage() {
  const items = await getFeaturedAlumniList();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Featured Alumni</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Distinguished Kibabiians spotlighted on the homepage — shown in sort order, up to 4 at a time.
          </p>
        </div>
        <Button
          nativeButton={false}
          render={<Link href="/admin/featured-alumni/new" />}
          className="bg-kida-purple hover:bg-kida-purple-dark"
        >
          Add Featured Alumnus
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role / Class</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  No featured alumni yet.
                </TableCell>
              </TableRow>
            )}
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Link href={`/admin/featured-alumni/${item.id}`} className="flex items-center gap-2.5 hover:underline">
                    <div className="relative size-8 shrink-0 overflow-hidden rounded-full bg-muted">
                      {item.photo_url ? (
                        <Image src={item.photo_url} alt="" fill className="object-cover" />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-xs font-medium text-muted-foreground">
                          {initials(item.full_name)}
                        </span>
                      )}
                    </div>
                    <span className="font-medium">{item.full_name}</span>
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{item.role_title}</TableCell>
                <TableCell className="text-muted-foreground">{item.sort_order}</TableCell>
                <TableCell>
                  <Badge variant={item.status === "active" ? "default" : "outline"}>
                    {item.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <FeaturedAlumniStatusActions id={item.id} status={item.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
