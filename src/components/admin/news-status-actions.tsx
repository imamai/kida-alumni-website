import Link from "next/link";
import { Button } from "@/components/ui/button";
import { setNewsStatus, deleteNews } from "@/app/actions/admin-news";
import type { NewsStatus } from "@/lib/data/admin-news";

function StatusForm({
  id,
  target,
  label,
  variant,
}: {
  id: string;
  target: NewsStatus;
  label: string;
  variant: "default" | "outline" | "destructive";
}) {
  return (
    <form action={setNewsStatus.bind(null, id, target)}>
      <Button type="submit" size="sm" variant={variant}>
        {label}
      </Button>
    </form>
  );
}

export function NewsStatusActions({ id, status }: { id: string; status: NewsStatus }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="outline" nativeButton={false} render={<Link href={`/admin/news/${id}`} />}>
        Edit
      </Button>
      {status === "draft" && <StatusForm id={id} target="published" label="Publish" variant="default" />}
      {status === "published" && <StatusForm id={id} target="archived" label="Archive" variant="destructive" />}
      {status === "archived" && <StatusForm id={id} target="draft" label="Restore to Draft" variant="outline" />}
      <form action={deleteNews.bind(null, id)}>
        <Button type="submit" size="sm" variant="outline">
          Delete
        </Button>
      </form>
    </div>
  );
}
