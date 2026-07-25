import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HeroSettingsForm } from "@/components/admin/hero-settings-form";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata: Metadata = { title: "Hero Section" };

export default async function HeroSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Hero Section</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The banner at the top of the homepage — background image, headline, and buttons.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Homepage Hero</CardTitle>
          <CardDescription>Shown full-width at the top of the public homepage.</CardDescription>
        </CardHeader>
        <CardContent>
          <HeroSettingsForm hero={settings.hero} />
        </CardContent>
      </Card>
    </div>
  );
}
