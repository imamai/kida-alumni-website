"use client";

import { useActionState, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createAlbum, updateAlbum, type GalleryActionState } from "@/app/actions/admin-gallery";
import { slugify } from "@/lib/slug";
import type { GalleryAlbumDetail } from "@/lib/data/admin-gallery";

const initialState: GalleryActionState = { status: "idle" };

export function GalleryAlbumForm({ album }: { album?: GalleryAlbumDetail }) {
  const action = album ? updateAlbum.bind(null, album.id) : createAlbum;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [slug, setSlug] = useState(album?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(album));

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={album?.title}
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

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={album?.description ?? ""} rows={2} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="sort_order">Sort Order</Label>
          <Input id="sort_order" name="sort_order" type="number" min={0} defaultValue={album?.sort_order ?? 0} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={album?.status ?? "draft"}>
            <SelectTrigger id="status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {state.status !== "idle" && (
        <p className={state.status === "error" ? "text-sm text-destructive" : "text-sm text-kida-purple"}>
          {state.message}
        </p>
      )}
      <Button type="submit" disabled={pending} className="bg-kida-purple hover:bg-kida-purple-dark">
        {pending ? "Saving…" : album ? "Save Changes" : "Create Album"}
      </Button>
    </form>
  );
}
