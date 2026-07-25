"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateHeroSettings, type SettingsActionState } from "@/app/actions/admin-settings";
import type { HeroSettings } from "@/lib/data/settings";

const initialState: SettingsActionState = { status: "idle" };

export function HeroSettingsForm({ hero }: { hero: HeroSettings }) {
  const [state, formAction, pending] = useActionState(updateHeroSettings, initialState);
  const [initialHero] = useState(hero);
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="hero_image">Background Image</Label>
        <div className="mb-2 h-40 w-full max-w-md overflow-hidden rounded-xl border border-border bg-muted/40">
          <Image
            src={preview ?? initialHero.media_url}
            alt=""
            width={480}
            height={160}
            className="h-full w-full object-cover"
            unoptimized={Boolean(preview)}
          />
        </div>
        <input
          id="hero_image"
          name="hero_image"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => {
            const file = e.target.files?.[0];
            setPreview(file ? URL.createObjectURL(file) : null);
          }}
          className="block text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-kida-purple file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-kida-purple-dark"
        />
        <p className="text-xs text-muted-foreground">PNG, JPEG, or WebP. Max 8MB. Leave blank to keep the current image.</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="eyebrow">Eyebrow</Label>
        <Input id="eyebrow" name="eyebrow" defaultValue={initialHero.eyebrow} required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="headline">Headline</Label>
        <Input id="headline" name="headline" defaultValue={initialHero.headline} required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="subheadline">Subheadline</Label>
        <Textarea id="subheadline" name="subheadline" defaultValue={initialHero.subheadline} rows={2} required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="primary_cta_label">Primary Button Label</Label>
          <Input id="primary_cta_label" name="primary_cta_label" defaultValue={initialHero.primary_cta_label} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="primary_cta_href">Primary Button Link</Label>
          <Input id="primary_cta_href" name="primary_cta_href" defaultValue={initialHero.primary_cta_href} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="secondary_cta_label">Secondary Button Label</Label>
          <Input
            id="secondary_cta_label"
            name="secondary_cta_label"
            defaultValue={initialHero.secondary_cta_label}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="secondary_cta_href">Secondary Button Link</Label>
          <Input id="secondary_cta_href" name="secondary_cta_href" defaultValue={initialHero.secondary_cta_href} required />
        </div>
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
