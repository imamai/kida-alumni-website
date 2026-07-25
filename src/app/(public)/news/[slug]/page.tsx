import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RichText } from "@/components/site/rich-text";
import { getNewsBySlug } from "@/lib/data/content";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);
  return { title: news?.title ?? "News" };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);
  if (!news) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/news" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to News
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="bg-kida-gold/15 text-kida-charcoal capitalize">
          {news.type}
        </Badge>
        {news.category_name && <Badge variant="outline">{news.category_name}</Badge>}
      </div>

      <h1 className="mt-4 font-heading text-3xl font-semibold text-balance sm:text-4xl">{news.title}</h1>
      {news.published_at && (
        <p className="mt-3 text-sm text-muted-foreground">{format(new Date(news.published_at), "MMMM d, yyyy")}</p>
      )}

      {news.cover_media?.url && (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl">
          <Image src={news.cover_media.url} alt={news.cover_media.alt_text ?? ""} fill priority sizes="100vw" className="object-cover" />
        </div>
      )}

      <div className="mt-8 space-y-4 text-base text-foreground">
        <RichText text={news.content_text} />
      </div>

      {news.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-1.5 border-t border-border pt-6">
          {news.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </article>
  );
}
