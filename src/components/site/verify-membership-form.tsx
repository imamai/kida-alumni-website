"use client";

import { useActionState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { verifyMembership, type VerifyMembershipState } from "@/app/actions/membership";

const initialState: VerifyMembershipState = { status: "idle" };

export function VerifyMembershipForm() {
  const [state, formAction, pending] = useActionState(verifyMembership, initialState);

  return (
    <div className="mx-auto max-w-md">
      <form action={formAction} className="flex gap-2">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="admission_number" className="sr-only">
            Admission Number
          </Label>
          <Input id="admission_number" name="admission_number" placeholder="Admission number, e.g. KHS-2004-118" required />
        </div>
        <Button type="submit" disabled={pending} className="bg-kida-purple hover:bg-kida-purple-dark">
          {pending ? "Checking…" : "Verify"}
        </Button>
      </form>

      {state.status === "found" && state.result && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-kida-purple/20 bg-kida-purple/5 p-4">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-kida-purple" />
          <div>
            <p className="text-sm font-medium">Verified Member</p>
            <p className="text-sm text-muted-foreground">
              {state.result.full_name}
              {state.result.graduation_year ? ` · Class of ${state.result.graduation_year}` : ""}
            </p>
          </div>
        </div>
      )}

      {state.status === "not_found" && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
          <XCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
          <p className="text-sm text-muted-foreground">
            No verified member found with that admission number. Double-check the number, or{" "}
            <a href="/contact" className="text-kida-purple hover:underline">
              contact us
            </a>{" "}
            if you believe this is an error.
          </p>
        </div>
      )}

      {state.status === "error" && <p className="mt-4 text-sm text-destructive">{state.message}</p>}
    </div>
  );
}
