"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateAuthPanel, type SettingsActionState } from "@/app/actions/admin-settings";
import type { AuthPanelSettings } from "@/lib/data/settings";

const initialState: SettingsActionState = { status: "idle" };

export function AuthPanelForm({ panel }: { panel: AuthPanelSettings }) {
  const [state, formAction, pending] = useActionState(updateAuthPanel, initialState);
  const [initialPanel] = useState(panel);
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="panel_image">Background Image</Label>
        <div className="mb-2 h-40 w-full max-w-md overflow-hidden rounded-xl border border-border bg-muted/40">
          <Image
            src={preview ?? initialPanel.image_url}
            alt=""
            width={480}
            height={160}
            className="h-full w-full object-cover"
            unoptimized={Boolean(preview)}
          />
        </div>
        <input
          id="panel_image"
          name="panel_image"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => {
            const file = e.target.files?.[0];
            setPreview(file ? URL.createObjectURL(file) : null);
          }}
          className="block text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-kida-purple file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-kida-purple-dark"
        />
        <p className="text-xs text-muted-foreground">Shown beside the Sign Up and Log In forms. Leave blank to keep the current image.</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="quote">Quote</Label>
        <Textarea id="quote" name="quote" defaultValue={initialPanel.quote} rows={3} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="quote_author">Quote Attribution</Label>
        <Input id="quote_author" name="quote_author" defaultValue={initialPanel.quote_author} required />
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
  );
}
