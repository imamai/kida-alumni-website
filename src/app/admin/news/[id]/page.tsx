import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { NewsForm } from "@/components/admin/news-form";
import { getNewsById, getNewsCategories } from "@/lib/data/admin-news";

export const metadata: Metadata = { title: "Edit Post" };

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [news, categories] = await Promise.all([getNewsById(id), getNewsCategories()]);
  if (!news) notFound();

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
        <h1 className="font-heading text-2xl font-semibold">Edit Post</h1>
        <p className="mt-1 text-sm text-muted-foreground">{news.title}</p>
      </div>

      <NewsForm news={news} categories={categories} />
    </div>
  );
}
