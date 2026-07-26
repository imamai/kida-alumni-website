import type { Metadata } from "next";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { RoleStatusActions } from "@/components/admin/role-status-actions";
import { getMembersWithRoles } from "@/lib/data/admin-roles";
import { getCurrentUser, isAdmin } from "@/lib/auth/roles";

export const metadata: Metadata = { title: "Roles & Permissions" };

const PAGE_SIZE = 20;

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function RolesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page: rawPage } = await searchParams;
  const page = Math.max(1, Number(rawPage) || 1);

  const [{ items, total }, currentUser, admin] = await Promise.all([
    getMembersWithRoles({ search: q, page, pageSize: PAGE_SIZE }),
    getCurrentUser(),
    isAdmin(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Roles & Permissions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Grant or revoke admin panel access. Staff access lets someone sign in to /admin and manage content.
        </p>
      </div>

      {!admin && (
        <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
          Only Super Admins and Administrators can grant or revoke staff access. You can view the list below.
        </p>
      )}

      <form method="get" className="flex max-w-sm gap-2">
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
              <TableHead>Roles</TableHead>
              <TableHead>Access</TableHead>
              {admin && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={admin ? 4 : 3} className="py-8 text-center text-muted-foreground">
                  No members found.
                </TableCell>
              </TableRow>
            )}
            {items.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar size="sm">
                      <AvatarImage src={member.avatar_url ?? undefined} alt="" />
                      <AvatarFallback>{initials(member.full_name)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{member.full_name}</span>
                    {member.id === currentUser?.id && <span className="text-xs text-muted-foreground">(you)</span>}
                  </div>
                </TableCell>
                <TableCell>
                  {member.roles.length === 0 ? (
                    <span className="text-muted-foreground">—</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {member.roles.map((role) => (
                        <Badge key={role.name} variant="outline">
                          {role.label}
                        </Badge>
                      ))}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={member.is_staff ? "default" : "secondary"}>
                    {member.is_staff ? "Staff" : "Member"}
                  </Badge>
                </TableCell>
                {admin && (
                  <TableCell>
                    <RoleStatusActions id={member.id} isStaff={member.is_staff} isSelf={member.id === currentUser?.id} />
                  </TableCell>
                )}
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
              render={<Link href={`/admin/roles?${new URLSearchParams({ ...(q ? { q } : {}), page: String(page - 1) })}`} />}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              nativeButton={false}
              render={<Link href={`/admin/roles?${new URLSearchParams({ ...(q ? { q } : {}), page: String(page + 1) })}`} />}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
