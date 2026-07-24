import { Button } from "@/components/ui/button";
import { updateMembershipStatus } from "@/app/actions/admin-members";
import type { MembershipStatus } from "@/lib/data/members";

function ActionForm({
  id,
  target,
  label,
  variant,
}: {
  id: string;
  target: MembershipStatus;
  label: string;
  variant: "default" | "outline" | "destructive";
}) {
  return (
    <form action={updateMembershipStatus.bind(null, id, target)}>
      <Button type="submit" size="sm" variant={variant}>
        {label}
      </Button>
    </form>
  );
}

export function MemberStatusActions({ id, status }: { id: string; status: MembershipStatus }) {
  return (
    <div className="flex flex-wrap gap-2">
      {status === "pending" && (
        <>
          <ActionForm id={id} target="verified" label="Approve" variant="default" />
          <ActionForm id={id} target="rejected" label="Reject" variant="destructive" />
        </>
      )}
      {status === "verified" && <ActionForm id={id} target="suspended" label="Suspend" variant="destructive" />}
      {(status === "rejected" || status === "suspended") && (
        <ActionForm id={id} target="pending" label="Reinstate for Review" variant="outline" />
      )}
    </div>
  );
}
