import type { Metadata } from "next";
import Link from "next/link";
import { Settings, Users, Newspaper, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Admin Dashboard" };

const modules = [
  { label: "Branding & Settings", href: "/admin/settings/branding", icon: Settings, ready: true },
  { label: "Members", href: "/admin/members", icon: Users, ready: false },
  { label: "News & Announcements", href: "/admin/news", icon: Newspaper, ready: false },
  { label: "Events", href: "/admin/events", icon: CalendarDays, ready: false },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Phase 1 of the KIDA platform. Membership, events, news, and analytics modules land in upcoming phases.
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
                <Link href={m.href} className="text-sm font-medium text-kida-purple hover:underline">
                  Manage →
                </Link>
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
