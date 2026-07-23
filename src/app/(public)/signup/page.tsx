import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = { title: "Become a Member" };

export default function SignupPage() {
  return (
    <AuthShell title="Join KIDA" subtitle="Create your alumni account to unlock the full KIDA network.">
      <SignupForm />
    </AuthShell>
  );
}
