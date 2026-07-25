import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FeaturedAlumniForm } from "@/components/admin/featured-alumni-form";

export const metadata: Metadata = { title: "Add Featured Alumnus" };

export default function NewFeaturedAlumniPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/featured-alumni"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Featured Alumni
      </Link>

      <div>
        <h1 className="font-heading text-2xl font-semibold">Add Featured Alumnus</h1>
        <p className="mt-1 text-sm text-muted-foreground">Spotlight a distinguished Kibabiian on the homepage.</p>
      </div>

      <FeaturedAlumniForm />
    </div>
  );
}
