"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  createFeaturedAlumni,
  updateFeaturedAlumni,
  type FeaturedAlumniActionState,
} from "@/app/actions/admin-featured-alumni";
import type { FeaturedAlumniDetail } from "@/lib/data/admin-featured-alumni";

const initialState: FeaturedAlumniActionState = { status: "idle" };

export function FeaturedAlumniForm({ alumnus }: { alumnus?: FeaturedAlumniDetail }) {
  const action = alumnus ? updateFeaturedAlumni.bind(null, alumnus.id) : createFeaturedAlumni;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="full_name">Full Name</Label>
        <Input id="full_name" name="full_name" defaultValue={alumnus?.full_name} required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="role_title">Role / Class</Label>
        <Input
          id="role_title"
          name="role_title"
          defaultValue={alumnus?.role_title}
          placeholder="Class of 2004 · Cardiothoracic Surgeon"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" name="bio" defaultValue={alumnus?.bio ?? ""} rows={3} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="linkedin_url">LinkedIn URL</Label>
          <Input id="linkedin_url" name="linkedin_url" type="url" defaultValue={alumnus?.linkedin_url ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="website_url">Website URL</Label>
          <Input id="website_url" name="website_url" type="url" defaultValue={alumnus?.website_url ?? ""} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="photo">Photo</Label>
        {(preview ?? alumnus?.photo_url) && (
          <div className="mb-2 h-32 w-32 overflow-hidden rounded-full border border-border bg-muted/40">
            <Image
              src={preview ?? alumnus!.photo_url!}
              alt=""
              width={128}
              height={128}
              className="h-full w-full object-cover"
              unoptimized={Boolean(preview)}
            />
          </div>
        )}
        <input
          id="photo"
          name="photo"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => {
            const file = e.target.files?.[0];
            setPreview(file ? URL.createObjectURL(file) : null);
          }}
          className="block text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-kida-purple file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-kida-purple-dark"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="sort_order">Sort Order</Label>
          <Input id="sort_order" name="sort_order" type="number" min={0} defaultValue={alumnus?.sort_order ?? 0} />
          <p className="text-xs text-muted-foreground">Lower numbers appear first on the homepage.</p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={alumnus?.status ?? "active"}>
            <SelectTrigger id="status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active (shown on homepage)</SelectItem>
              <SelectItem value="inactive">Inactive (hidden)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {state.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}

      <div>
        <Button type="submit" disabled={pending} className="bg-kida-purple hover:bg-kida-purple-dark">
          {pending ? "Saving…" : alumnus ? "Save Changes" : "Add Featured Alumnus"}
        </Button>
      </div>
    </form>
  );
}
