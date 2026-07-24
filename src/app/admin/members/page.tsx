import type { Metadata } from "next";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { MemberStatusBadge } from "@/components/admin/member-status-badge";
import { MemberStatusActions } from "@/components/admin/member-status-actions";
import { getMembers, getMembershipStatusCounts, type MembershipStatus } from "@/lib/data/members";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Members" };

const PAGE_SIZE = 20;
const STATUS_TABS: { label: string; value?: MembershipStatus }[] = [
  { label: "All" },
  { label: "Pending", value: "pending" },
  { label: "Verified", value: "verified" },
  { label: "Rejected", value: "rejected" },
  { label: "Suspended", value: "suspended" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  const { status: rawStatus, q, page: rawPage } = await searchParams;
  const status = STATUS_TABS.some((t) => t.value === rawStatus) ? (rawStatus as MembershipStatus) : undefined;
  const page = Math.max(1, Number(rawPage) || 1);

  const [{ items, total }, counts] = await Promise.all([
    getMembers({ status, search: q, page, pageSize: PAGE_SIZE }),
    getMembershipStatusCounts(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const allCount = counts.pending + counts.verified + counts.rejected + counts.suspended;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Members</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review alumni sign-ups and manage membership status.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {STATUS_TABS.map((tab) => {
          const active = status === tab.value;
          const count = tab.value ? counts[tab.value] : allCount;
          return (
            <Link
              key={tab.label}
              href={`/admin/members${tab.value ? `?status=${tab.value}` : ""}`}
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
        <Input name="q" placeholder="Search by name…" defaultValue={q} />
        <Button type="submit" variant="outline">
          Search
        </Button>
      </form>

      <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Admission #</TableHead>
              <TableHead>Grad Year</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  No members found.
                </TableCell>
              </TableRow>
            )}
            {items.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <Link href={`/admin/members/${member.id}`} className="flex items-center gap-2.5 hover:underline">
                    <Avatar size="sm">
                      <AvatarImage src={member.avatar_url ?? undefined} alt="" />
                      <AvatarFallback>{initials(member.full_name)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{member.full_name}</span>
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{member.admission_number ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{member.graduation_year ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">
                  {[member.county, member.country].filter(Boolean).join(", ") || "—"}
                </TableCell>
                <TableCell>
                  <MemberStatusBadge status={member.membership_status} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(member.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <MemberStatusActions id={member.id} status={member.membership_status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Page {page} of {totalPages} ({total} members)
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              nativeButton={false}
              render={
                <Link
                  href={`/admin/members?${new URLSearchParams({ ...(status ? { status } : {}), ...(q ? { q } : {}), page: String(page - 1) })}`}
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
                  href={`/admin/members?${new URLSearchParams({ ...(status ? { status } : {}), ...(q ? { q } : {}), page: String(page + 1) })}`}
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
