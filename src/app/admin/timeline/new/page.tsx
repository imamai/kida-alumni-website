import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TimelineForm } from "@/components/admin/timeline-form";

export const metadata: Metadata = { title: "Add Milestone" };

export default function NewMilestonePage() {
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
        <h1 className="font-heading text-2xl font-semibold">Add Milestone</h1>
        <p className="mt-1 text-sm text-muted-foreground">Add a new entry to the homepage timeline.</p>
      </div>

      <TimelineForm />
    </div>
  );
}
