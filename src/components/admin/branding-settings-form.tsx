"use client";

import { useActionState, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateBrandingSettings, type SettingsActionState } from "@/app/actions/admin-settings";
import type { SiteSettings } from "@/lib/data/settings";

const initialState: SettingsActionState = { status: "idle" };

export function BrandingSettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction, pending] = useActionState(updateBrandingSettings, initialState);
  // Seed once from the initial props and ignore later `settings` prop changes (e.g. from
  // revalidatePath after a save) — these are uncontrolled fields, so their defaultValue must
  // never change after mount or Base UI's FieldControl warns/misbehaves.
  const [initialSettings] = useState(settings);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="site_name">Site Name</Label>
          <Input id="site_name" name="site_name" defaultValue={initialSettings.site_name} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="site_short_name">Short Name</Label>
          <Input
            id="site_short_name"
            name="site_short_name"
            defaultValue={initialSettings.site_short_name}
            required
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="tagline">Tagline</Label>
        <Input id="tagline" name="tagline" defaultValue={initialSettings.tagline} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="contact_email">Contact Email</Label>
          <Input
            id="contact_email"
            name="contact_email"
            type="email"
            defaultValue={initialSettings.contact_email}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact_phone">Contact Phone</Label>
          <Input
            id="contact_phone"
            name="contact_phone"
            defaultValue={initialSettings.contact_phone}
            required
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="contact_address">Contact Address</Label>
        <Input
          id="contact_address"
          name="contact_address"
          defaultValue={initialSettings.contact_address}
          required
        />
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
