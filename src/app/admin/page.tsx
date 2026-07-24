import type { Metadata } from "next";
import Link from "next/link";
import { Settings, Users, Newspaper, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMembershipStatusCounts } from "@/lib/data/members";
import { getNewsStatusCounts } from "@/lib/data/admin-news";
import { getEventStatusCounts } from "@/lib/data/admin-events";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const [counts, newsCounts, eventCounts] = await Promise.all([
    getMembershipStatusCounts(),
    getNewsStatusCounts(),
    getEventStatusCounts(),
  ]);

  const modules = [
    { label: "Branding & Settings", href: "/admin/settings/branding", icon: Settings, ready: true },
    {
      label: "Members",
      href: "/admin/members",
      icon: Users,
      ready: true,
      note: counts.pending > 0 ? `${counts.pending} pending review` : undefined,
    },
    {
      label: "News & Announcements",
      href: "/admin/news",
      icon: Newspaper,
      ready: true,
      note: newsCounts.draft > 0 ? `${newsCounts.draft} draft${newsCounts.draft === 1 ? "" : "s"}` : undefined,
    },
    {
      label: "Events",
      href: "/admin/events",
      icon: CalendarDays,
      ready: true,
      note: eventCounts.draft > 0 ? `${eventCounts.draft} draft${eventCounts.draft === 1 ? "" : "s"}` : undefined,
    },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Phase 1 of the KIDA platform. Events, news, and analytics modules land in upcoming phases.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {modules.map((m) => (
          <Card key={m.href} className={!m.ready ? "opacity-60" : undefined}>
            <CardHeader>
              <m.icon className="size-5 text-kida-purple" />
              <CardTitle className="mt-2 text-base">{m.label}</CardTitle>
            </CardHeader>
            <CardContent>
              {m.ready ? (
                <div className="flex items-center justify-between gap-2">
                  <Link href={m.href} className="text-sm font-medium text-kida-purple hover:underline">
                    Manage →
                  </Link>
                  {m.note && <span className="text-xs text-muted-foreground">{m.note}</span>}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Coming in a later phase</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
