import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata: Metadata = { title: "Become a Member" };

export default async function SignupPage() {
  const settings = await getSiteSettings();

  return (
    <AuthShell title="Join KIDA" subtitle="Create your alumni account to unlock the full KIDA network." panel={settings.auth_panel}>
      <SignupForm />
    </AuthShell>
  );
}
