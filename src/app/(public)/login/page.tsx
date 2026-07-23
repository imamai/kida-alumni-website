import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Sign In" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your KIDA alumni account.">
      <LoginForm next={next} />
    </AuthShell>
  );
}
