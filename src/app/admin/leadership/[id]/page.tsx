import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { LeadershipForm } from "@/components/admin/leadership-form";
import { getLeadershipById } from "@/lib/data/admin-leadership";

export const metadata: Metadata = { title: "Edit Leader" };

export default async function EditLeaderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const leader = await getLeadershipById(id);
  if (!leader) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/leadership"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Leadership
      </Link>

      <div>
        <h1 className="font-heading text-2xl font-semibold">Edit Leader</h1>
        <p className="mt-1 text-sm text-muted-foreground">{leader.full_name}</p>
      </div>

      <LeadershipForm leader={leader} />
    </div>
  );
}
