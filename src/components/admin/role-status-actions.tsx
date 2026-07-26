import { Button } from "@/components/ui/button";
import { grantStaffAccess, revokeStaffAccess } from "@/app/actions/admin-roles";

export function RoleStatusActions({ id, isStaff, isSelf }: { id: string; isStaff: boolean; isSelf: boolean }) {
  if (isStaff) {
    return (
      <form action={revokeStaffAccess.bind(null, id)}>
        <Button type="submit" size="sm" variant="outline" disabled={isSelf} title={isSelf ? "You can't revoke your own access" : undefined}>
          Revoke Staff Access
        </Button>
      </form>
    );
  }

  return (
    <form action={grantStaffAccess.bind(null, id)}>
      <Button type="submit" size="sm" className="bg-kida-purple hover:bg-kida-purple-dark">
        Grant Staff Access
      </Button>
    </form>
  );
}
