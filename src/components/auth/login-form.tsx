"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GoogleButton } from "@/components/auth/google-button";
import { signInWithPassword, type AuthState } from "@/app/actions/auth";

const initialState: AuthState = { status: "idle" };

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(signInWithPassword, initialState);

  return (
    <div className="space-y-6">
      <GoogleButton next={next} />
      <div className="relative">
        <Separator />
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
          or continue with email
        </span>
      </div>
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="next" value={next ?? ""} />
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-xs text-kida-purple hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input id="password" name="password" type="password" autoComplete="current-password" required />
        </div>
        {state.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}
        <Button type="submit" className="w-full bg-kida-purple hover:bg-kida-purple-dark" disabled={pending}>
          {pending ? "Signing in…" : "Sign In"}
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Not a member yet?{" "}
        <Link href="/signup" className="font-medium text-kida-purple hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
