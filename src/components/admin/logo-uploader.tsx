"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { uploadLogo, type SettingsActionState } from "@/app/actions/admin-settings";

const initialState: SettingsActionState = { status: "idle" };

export function LogoUploader({ currentLogoUrl }: { currentLogoUrl: string }) {
  const [state, formAction, pending] = useActionState(uploadLogo, initialState);
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <form action={formAction} className="space-y-4">
      <div className="flex items-center gap-6">
        <div className="flex size-24 items-center justify-center rounded-xl border border-border bg-muted/40 p-2">
          <Image
            src={preview ?? currentLogoUrl}
            alt="Current KIDA logo"
            width={80}
            height={80}
            className="h-full w-full object-contain"
            unoptimized={Boolean(preview)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="logo">Replace Logo</Label>
          <input
            id="logo"
            name="logo"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setPreview(file ? URL.createObjectURL(file) : null);
            }}
            className="block text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-kida-purple file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-kida-purple-dark"
          />
          <p className="text-xs text-muted-foreground">PNG, JPEG, WebP, or SVG. Max 5MB.</p>
        </div>
      </div>
      {state.status !== "idle" && (
        <p className={state.status === "error" ? "text-sm text-destructive" : "text-sm text-kida-purple"}>
          {state.message}
        </p>
      )}
      <Button type="submit" disabled={pending || !preview} className="bg-kida-purple hover:bg-kida-purple-dark">
        {pending ? "Uploading…" : "Upload Logo"}
      </Button>
    </form>
  );
}
