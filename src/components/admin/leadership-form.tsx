"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createLeader, updateLeader, type LeadershipActionState } from "@/app/actions/admin-leadership";
import type { LeadershipDetail } from "@/lib/data/admin-leadership";

const initialState: LeadershipActionState = { status: "idle" };

export function LeadershipForm({ leader }: { leader?: LeadershipDetail }) {
  const action = leader ? updateLeader.bind(null, leader.id) : createLeader;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="full_name">Full Name</Label>
          <Input id="full_name" name="full_name" defaultValue={leader?.full_name} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={leader?.title} placeholder="Chairperson" required />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="category">Category</Label>
        <Select name="category" defaultValue={leader?.category ?? "executive"}>
          <SelectTrigger id="category" className="w-full sm:w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="executive">Executive Committee</SelectItem>
            <SelectItem value="patron">Patron</SelectItem>
            <SelectItem value="committee">Standing Committee</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" name="bio" defaultValue={leader?.bio ?? ""} rows={3} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="term_start">Term Start</Label>
          <Input id="term_start" name="term_start" type="date" defaultValue={leader?.term_start ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="term_end">Term End</Label>
          <Input id="term_end" name="term_end" type="date" defaultValue={leader?.term_end ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="county">County</Label>
          <Input id="county" name="county" defaultValue={leader?.county ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={leader?.email ?? ""} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="linkedin_url">LinkedIn URL</Label>
        <Input id="linkedin_url" name="linkedin_url" type="url" defaultValue={leader?.linkedin_url ?? ""} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="photo">Photo</Label>
        {(preview ?? leader?.photo_url) && (
          <div className="mb-2 h-32 w-32 overflow-hidden rounded-full border border-border bg-muted/40">
            <Image
              src={preview ?? leader!.photo_url!}
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
          <Input id="sort_order" name="sort_order" type="number" min={0} defaultValue={leader?.sort_order ?? 0} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={leader?.status ?? "active"}>
            <SelectTrigger id="status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active (shown on site)</SelectItem>
              <SelectItem value="inactive">Inactive (hidden)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {state.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}

      <Button type="submit" disabled={pending} className="bg-kida-purple hover:bg-kida-purple-dark">
        {pending ? "Saving…" : leader ? "Save Changes" : "Add Leader"}
      </Button>
    </form>
  );
}
