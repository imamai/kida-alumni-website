import Link from "next/link";
import { Button } from "@/components/ui/button";
import { setFeaturedAlumniStatus, deleteFeaturedAlumni } from "@/app/actions/admin-featured-alumni";
import type { FeaturedAlumniStatus } from "@/lib/data/admin-featured-alumni";

export function FeaturedAlumniStatusActions({ id, status }: { id: string; status: FeaturedAlumniStatus }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="outline" nativeButton={false} render={<Link href={`/admin/featured-alumni/${id}`} />}>
        Edit
      </Button>
      <form action={setFeaturedAlumniStatus.bind(null, id, status === "active" ? "inactive" : "active")}>
        <Button type="submit" size="sm" variant={status === "active" ? "outline" : "default"}>
          {status === "active" ? "Hide" : "Show"}
        </Button>
      </form>
      <form action={deleteFeaturedAlumni.bind(null, id)}>
        <Button type="submit" size="sm" variant="outline">
          Delete
        </Button>
      </form>
    </div>
  );
}
