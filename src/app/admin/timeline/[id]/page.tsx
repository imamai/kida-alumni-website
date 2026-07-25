import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { TimelineForm } from "@/components/admin/timeline-form";
import { getMilestoneById } from "@/lib/data/admin-timeline";

export const metadata: Metadata = { title: "Edit Milestone" };

export default async function EditMilestonePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const milestone = await getMilestoneById(id);
  if (!milestone) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/timeline"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Timeline
      </Link>

      <div>
        <h1 className="font-heading text-2xl font-semibold">Edit Milestone</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {milestone.year} · {milestone.title}
        </p>
      </div>

      <TimelineForm milestone={milestone} />
    </div>
  );
}
