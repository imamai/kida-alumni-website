"use client";

import { useActionState, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateAboutContent, type SettingsActionState } from "@/app/actions/admin-settings";
import type { AboutContent } from "@/lib/data/settings";

const initialState: SettingsActionState = { status: "idle" };

export function AboutContentForm({ about }: { about: AboutContent }) {
  const [state, formAction, pending] = useActionState(updateAboutContent, initialState);
  const [initialAbout] = useState(about);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="story">Our Story</Label>
        <Textarea id="story" name="story" defaultValue={initialAbout.story} rows={4} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="vision">Vision</Label>
        <Textarea id="vision" name="vision" defaultValue={initialAbout.vision} rows={2} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="mission">Mission</Label>
        <Textarea id="mission" name="mission" defaultValue={initialAbout.mission} rows={2} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="objectives">Objectives</Label>
        <Textarea id="objectives" name="objectives" defaultValue={initialAbout.objectives} rows={2} required />
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
