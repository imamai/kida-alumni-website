"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createNews, updateNews, type NewsActionState } from "@/app/actions/admin-news";
import { slugify } from "@/lib/slug";
import type { NewsDetail, NewsCategory } from "@/lib/data/admin-news";

const initialState: NewsActionState = { status: "idle" };

export function NewsForm({ news, categories }: { news?: NewsDetail; categories: NewsCategory[] }) {
  const action = news ? updateNews.bind(null, news.id) : createNews;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [slug, setSlug] = useState(news?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(news));
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={news?.title}
          required
          onChange={(e) => {
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          name="slug"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="type">Type</Label>
          <Select name="type" defaultValue={news?.type ?? "news"}>
            <SelectTrigger id="type" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="news">News</SelectItem>
              <SelectItem value="announcement">Announcement</SelectItem>
              <SelectItem value="blog">Blog</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="category_id">Category</Label>
          <Select name="category_id" defaultValue="">
            <SelectTrigger id="category_id" className="w-full">
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" name="excerpt" defaultValue={news?.excerpt ?? ""} rows={2} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="content">Content</Label>
        <Textarea id="content" name="content" defaultValue={news?.content_text ?? ""} rows={10} required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tags">Tags</Label>
        <Input id="tags" name="tags" defaultValue={news?.tags.join(", ") ?? ""} placeholder="comma, separated" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cover">Cover Image</Label>
        {(preview ?? news?.cover_url) && (
          <div className="mb-2 h-32 w-56 overflow-hidden rounded-lg border border-border bg-muted/40">
            <Image
              src={preview ?? news!.cover_url!}
              alt=""
              width={224}
              height={128}
              className="h-full w-full object-cover"
              unoptimized={Boolean(preview)}
            />
          </div>
        )}
        <input
          id="cover"
          name="cover"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => {
            const file = e.target.files?.[0];
            setPreview(file ? URL.createObjectURL(file) : null);
          }}
          className="block text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-kida-purple file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-kida-purple-dark"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="status">Status</Label>
        <Select name="status" defaultValue={news?.status ?? "draft"}>
          <SelectTrigger id="status" className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {state.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}

      <div>
        <Button type="submit" disabled={pending} className="bg-kida-purple hover:bg-kida-purple-dark">
          {pending ? "Saving…" : news ? "Save Changes" : "Create Post"}
        </Button>
      </div>
    </form>
  );
}
