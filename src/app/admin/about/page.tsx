import type { Metadata } from "next";
import Link from "next/link";
import { History, UserCog } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AboutContentForm } from "@/components/admin/about-content-form";
import { getSiteSettings } from "@/lib/data/settings";
import { getMilestonesList } from "@/lib/data/admin-timeline";
import { getLeadershipList } from "@/lib/data/admin-leadership";

export const metadata: Metadata = { title: "About KIDA" };

export default async function AboutAdminPage() {
  const [settings, milestones, leaders] = await Promise.all([
    getSiteSettings(),
    getMilestonesList(),
    getLeadershipList(),
  ]);

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold">About KIDA</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Everything shown on the public &ldquo;About KIDA&rdquo; page — story, timeline, and leadership.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Our Story</CardTitle>
          <CardDescription>The story paragraph plus Vision, Mission, and Objectives.</CardDescription>
        </CardHeader>
        <CardContent>
          <AboutContentForm about={settings.about} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
          <CardDescription>The &ldquo;Our Journey&rdquo; milestones shown on the homepage and About page.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/admin/timeline"
            className="flex items-center justify-between gap-2 rounded-lg border border-border p-4 text-sm hover:bg-muted"
          >
            <span className="flex items-center gap-2">
              <History className="size-4 text-kida-purple" />
              Manage {milestones.length} milestone{milestones.length === 1 ? "" : "s"}
            </span>
            <span className="text-kida-purple">Open →</span>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Leadership</CardTitle>
          <CardDescription>Executive Committee, Patrons, and Standing Committees.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/admin/leadership"
            className="flex items-center justify-between gap-2 rounded-lg border border-border p-4 text-sm hover:bg-muted"
          >
            <span className="flex items-center gap-2">
              <UserCog className="size-4 text-kida-purple" />
              Manage {leaders.length} leader{leaders.length === 1 ? "" : "s"}
            </span>
            <span className="text-kida-purple">Open →</span>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
