import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LeadershipForm } from "@/components/admin/leadership-form";

export const metadata: Metadata = { title: "Add Leader" };

export default function NewLeaderPage() {
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
        <h1 className="font-heading text-2xl font-semibold">Add Leader</h1>
        <p className="mt-1 text-sm text-muted-foreground">Add a member of the Executive Committee, a Patron, or a Standing Committee.</p>
      </div>

      <LeadershipForm />
    </div>
  );
}
