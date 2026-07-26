"use client";

import { useActionState, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateSocialLinks, type SettingsActionState } from "@/app/actions/admin-settings";
import type { SocialLinks } from "@/lib/data/settings";

const initialState: SettingsActionState = { status: "idle" };

const FIELDS: { name: keyof SocialLinks; label: string; placeholder: string }[] = [
  { name: "facebook", label: "Facebook", placeholder: "https://facebook.com/kidaalumni" },
  { name: "instagram", label: "Instagram", placeholder: "https://instagram.com/kidaalumni" },
  { name: "twitter", label: "X (Twitter)", placeholder: "https://x.com/kidaalumni" },
  { name: "youtube", label: "YouTube", placeholder: "https://youtube.com/@kidaalumni" },
  { name: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/kidaalumni" },
];

export function SocialLinksForm({ links }: { links: SocialLinks }) {
  const [state, formAction, pending] = useActionState(updateSocialLinks, initialState);
  const [initialLinks] = useState(links);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <div key={field.name} className="space-y-1.5">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              name={field.name}
              type="url"
              defaultValue={initialLinks[field.name] ?? ""}
              placeholder={field.placeholder}
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Leave a field blank to hide that icon from the site footer.</p>
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
