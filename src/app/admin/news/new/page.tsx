import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewsForm } from "@/components/admin/news-form";
import { getNewsCategories } from "@/lib/data/admin-news";

export const metadata: Metadata = { title: "New Post" };

export default async function NewNewsPage() {
  const categories = await getNewsCategories();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/news"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to News
      </Link>

      <div>
        <h1 className="font-heading text-2xl font-semibold">New Post</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create a news article, announcement, or blog post.</p>
      </div>

      <NewsForm categories={categories} />
    </div>
  );
}
