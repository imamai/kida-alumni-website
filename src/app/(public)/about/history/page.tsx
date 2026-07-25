import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { Timeline } from "@/components/home/timeline";
import { getTimelineMilestones } from "@/lib/data/content";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata: Metadata = { title: "Our History" };

export default async function HistoryPage() {
  const [milestones, settings] = await Promise.all([getTimelineMilestones(), getSiteSettings()]);

  return (
    <>
      <PageHeader eyebrow="Our Journey" title="Our History" description="From a single high school to a global alumni network." />
      <div className="mx-auto max-w-3xl px-4 pt-16 sm:px-6 lg:px-8">
        <p className="whitespace-pre-wrap text-muted-foreground text-pretty">{settings.about.story}</p>
      </div>
      <Timeline milestones={milestones} />
    </>
  );
}
