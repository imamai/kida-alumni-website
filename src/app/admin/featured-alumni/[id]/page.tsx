import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { FeaturedAlumniForm } from "@/components/admin/featured-alumni-form";
import { getFeaturedAlumniById } from "@/lib/data/admin-featured-alumni";

export const metadata: Metadata = { title: "Edit Featured Alumnus" };

export default async function EditFeaturedAlumniPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const alumnus = await getFeaturedAlumniById(id);
  if (!alumnus) notFound();

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
        <h1 className="font-heading text-2xl font-semibold">Edit Featured Alumnus</h1>
        <p className="mt-1 text-sm text-muted-foreground">{alumnus.full_name}</p>
      </div>

      <FeaturedAlumniForm alumnus={alumnus} />
    </div>
  );
}
