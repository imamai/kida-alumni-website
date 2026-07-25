"use client";

import { useActionState, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { uploadMedia, type MediaActionState } from "@/app/actions/admin-media";

const initialState: MediaActionState = { status: "idle" };

export function MediaUploadForm() {
  const [state, formAction, pending] = useActionState(uploadMedia, initialState);
  const [fileName, setFileName] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={() => {
        // Reset once the action completes so the same form can upload another file right away.
        setTimeout(() => {
          formRef.current?.reset();
          setFileName(null);
        }, 0);
      }}
      className="flex flex-wrap items-end gap-3 rounded-xl border border-dashed border-border p-4"
    >
      <div className="space-y-1.5">
        <Label htmlFor="file">File</Label>
        <input
          id="file"
          name="file"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif,video/mp4,video/webm,application/pdf"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
          className="block text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-kida-purple file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-kida-purple-dark"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="folder">Folder</Label>
        <Input id="folder" name="folder" defaultValue="general" className="w-36" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="alt_text">Alt Text</Label>
        <Input id="alt_text" name="alt_text" className="w-56" placeholder="Describes the image" />
      </div>
      <Button type="submit" disabled={pending || !fileName} className="bg-kida-purple hover:bg-kida-purple-dark">
        {pending ? "Uploading…" : "Upload"}
      </Button>
      {state.status !== "idle" && (
        <p className={state.status === "error" ? "w-full text-sm text-destructive" : "w-full text-sm text-kida-purple"}>
          {state.message}
        </p>
      )}
    </form>
  );
}
