"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateMedia, deleteMedia, type MediaActionState } from "@/app/actions/admin-media";
import type { MediaListItem } from "@/lib/data/admin-media";

const initialState: MediaActionState = { status: "idle" };

export function MediaEditForm({ media }: { media: MediaListItem }) {
  const [state, formAction, pending] = useActionState(updateMedia.bind(null, media.id), initialState);

  return (
    <div className="max-w-xl space-y-6">
      <form action={formAction} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="alt_text">Alt Text</Label>
          <Input id="alt_text" name="alt_text" defaultValue={media.alt_text ?? ""} placeholder="Describes the image for accessibility" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="caption">Caption</Label>
          <Textarea id="caption" name="caption" defaultValue={media.caption ?? ""} rows={2} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="folder">Folder</Label>
          <Input id="folder" name="folder" defaultValue={media.folder} className="w-48" required />
        </div>

        {state.status !== "idle" && (
          <p className={state.status === "error" ? "text-sm text-destructive" : "text-sm text-kida-purple"}>
            {state.message}
          </p>
        )}
        <Button type="submit" disabled={pending} className="bg-kida-purple hover:bg-kida-purple-dark">
          {pending ? "Saving…" : "Save Changes"}
        </Button>
      </form>

      <div className="border-t border-border pt-4">
        <p className="mb-2 text-xs text-muted-foreground">
          Deleting only removes this file from the Media Library — any page or post still referencing it directly
          will keep showing it until you update that content.
        </p>
        <form action={deleteMedia.bind(null, media.id)}>
          <Button type="submit" variant="destructive" size="sm">
            Delete File
          </Button>
        </form>
      </div>
    </div>
  );
}
