import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ImpactStatsForm } from "@/components/admin/impact-stats-form";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata: Metadata = { title: "Homepage Statistics" };

export default async function StatisticsSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Homepage Statistics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The impact numbers shown on the public homepage — no code changes needed.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Impact Statistics</CardTitle>
          <CardDescription>Each stat needs a label and value; the suffix (e.g. &quot;+&quot;) is optional.</CardDescription>
        </CardHeader>
        <CardContent>
          <ImpactStatsForm stats={settings.impact_stats} />
        </CardContent>
      </Card>
    </div>
  );
}
