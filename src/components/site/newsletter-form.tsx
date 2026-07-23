"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { subscribeToNewsletter, type SubscribeState } from "@/app/actions/newsletter";

const initialState: SubscribeState = { status: "idle" };

export function NewsletterForm({
  variant = "light",
  className,
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(subscribeToNewsletter, initialState);

  return (
    <form action={formAction} className={cn("space-y-2", className)}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <Input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className={cn(
            variant === "dark" && "border-white/20 bg-white/10 text-white placeholder:text-white/50",
          )}
        />
        <Button
          type="submit"
          disabled={pending}
          className="shrink-0 bg-kida-gold text-kida-charcoal hover:bg-kida-gold-light"
        >
          {pending ? "Subscribing…" : "Subscribe"}
        </Button>
      </div>
      <p
        role="status"
        aria-live="polite"
        className={cn(
          "text-xs",
          state.status === "success" && "text-kida-gold",
          state.status === "error" && "text-destructive",
        )}
      >
        {state.message}
      </p>
    </form>
  );
}
