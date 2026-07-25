"use client";

import { useActionState, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { uploadGalleryPhotos, type GalleryActionState } from "@/app/actions/admin-gallery";

const initialState: GalleryActionState = { status: "idle" };

export function GalleryPhotoUpload({ albumId }: { albumId: string }) {
  const [state, formAction, pending] = useActionState(uploadGalleryPhotos.bind(null, albumId), initialState);
  const [count, setCount] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={() => {
        setTimeout(() => {
          formRef.current?.reset();
          setCount(0);
        }, 0);
      }}
      className="flex flex-wrap items-end gap-3 rounded-xl border border-dashed border-border p-4"
    >
      <div className="space-y-1.5">
        <Label htmlFor="photos">Upload Photos</Label>
        <input
          id="photos"
          name="photos"
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => setCount(e.target.files?.length ?? 0)}
          className="block text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-kida-purple file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-kida-purple-dark"
        />
      </div>
      <Button type="submit" disabled={pending || count === 0} className="bg-kida-purple hover:bg-kida-purple-dark">
        {pending ? "Uploading…" : count > 1 ? `Upload ${count} Photos` : "Upload Photo"}
      </Button>
      {state.status !== "idle" && (
        <p className={state.status === "error" ? "w-full text-sm text-destructive" : "w-full text-sm text-kida-purple"}>
          {state.message}
        </p>
      )}
    </form>
  );
}
