import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata: Metadata = { title: "Sign In" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const [{ next }, settings] = await Promise.all([searchParams, getSiteSettings()]);

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your KIDA alumni account." panel={settings.auth_panel}>
      <LoginForm next={next} />
    </AuthShell>
  );
}
