import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LogoUploader } from "@/components/admin/logo-uploader";
import { BrandingSettingsForm } from "@/components/admin/branding-settings-form";
import { AuthPanelForm } from "@/components/admin/auth-panel-form";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata: Metadata = { title: "Branding & Settings" };

export default async function BrandingSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Branding & Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Controls the KIDA logo and contact details shown across the public site — no code changes needed.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Site Logo</CardTitle>
          <CardDescription>Shown in the header, footer, and admin sidebar.</CardDescription>
        </CardHeader>
        <CardContent>
          <LogoUploader currentLogoUrl={settings.logo_url} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Site Details</CardTitle>
          <CardDescription>Name, tagline, and contact information used throughout the site.</CardDescription>
        </CardHeader>
        <CardContent>
          <BrandingSettingsForm settings={settings} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sign Up / Login Panel</CardTitle>
          <CardDescription>The image and quote shown beside the sign up and log in forms.</CardDescription>
        </CardHeader>
        <CardContent>
          <AuthPanelForm panel={settings.auth_panel} />
        </CardContent>
      </Card>
    </div>
  );
}
