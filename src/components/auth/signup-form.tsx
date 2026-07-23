"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GoogleButton } from "@/components/auth/google-button";
import { signUpWithPassword, type AuthState } from "@/app/actions/auth";

const initialState: AuthState = { status: "idle" };

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signUpWithPassword, initialState);

  if (state.status === "success") {
    return (
      <div className="rounded-lg border border-kida-gold/40 bg-kida-gold/10 p-4 text-sm">
        {state.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GoogleButton />
      <div className="relative">
        <Separator />
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
          or sign up with email
        </span>
      </div>
      <form action={formAction} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" name="fullName" autoComplete="name" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="admissionNumber">Admission No.</Label>
            <Input id="admissionNumber" name="admissionNumber" placeholder="Optional" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="graduationYear">Graduation Year</Label>
            <Input id="graduationYear" name="graduationYear" type="number" min={1960} max={2100} placeholder="e.g. 2012" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
        </div>
        {state.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}
        <p className="text-xs text-muted-foreground">
          New accounts start as pending members. A KIDA Membership Officer verifies your admission details before
          full alumni access is unlocked.
        </p>
        <Button type="submit" className="w-full bg-kida-purple hover:bg-kida-purple-dark" disabled={pending}>
          {pending ? "Creating account…" : "Create Account"}
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Already a member?{" "}
        <Link href="/login" className="font-medium text-kida-purple hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
