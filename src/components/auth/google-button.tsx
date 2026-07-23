"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/site/social-icons";
import { signInWithGoogle } from "@/app/actions/auth";

export function GoogleButton({ next }: { next?: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      disabled={pending}
      onClick={() => startTransition(() => signInWithGoogle(next))}
    >
      <GoogleIcon className="size-4" />
      {pending ? "Redirecting…" : "Continue with Google"}
    </Button>
  );
}
