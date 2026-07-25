import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, Target, Compass, ListChecks } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { SectionHeading } from "@/components/site/section-heading";
import { RichText } from "@/components/site/rich-text";
import { Timeline } from "@/components/home/timeline";
import { getTimelineMilestones } from "@/lib/data/content";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata: Metadata = { title: "About KIDA" };

export default async function AboutPage() {
  const [milestones, settings] = await Promise.all([getTimelineMilestones(), getSiteSettings()]);
  const { about } = settings;

  const pillars = [
    { icon: Compass, title: "Vision", copy: about.vision },
    { icon: Target, title: "Mission", copy: about.mission },
    { icon: ListChecks, title: "Objectives", copy: about.objectives },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Who We Are"
        title="About KIDA"
        description="The Kibabiians Development Association is the official alumni body of Kibabii High School — a lifelong community of leaders, professionals, and changemakers."
      />

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-kida-purple/10 text-kida-purple">
            <GraduationCap className="size-6" />
          </div>
          <div>
            <h2 className="font-heading text-2xl font-semibold">Our Story</h2>
            <RichText text={about.story} className="mt-3 text-muted-foreground text-pretty" />
          </div>
        </div>

        <div id="vision-mission" className="mt-14 grid scroll-mt-24 gap-6 sm:grid-cols-3">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="rounded-2xl border border-border bg-card p-6">
              <pillar.icon className="size-6 text-kida-gold" />
              <h3 className="mt-4 font-heading text-lg font-semibold">{pillar.title}</h3>
              <RichText text={pillar.copy} className="mt-2 text-sm text-muted-foreground text-pretty" />
            </div>
          ))}
        </div>
      </section>

      <Timeline milestones={milestones} />

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Leadership"
          title="Meet the People Behind KIDA"
          description="Our Executive Committee and Patrons guide the association's strategy and represent Kibabiians at every level."
          cta={{ label: "View full leadership", href: "/about/leadership" }}
        />
      </section>

      <section className="border-t border-border bg-card py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-semibold">Governance & Constitution</h2>
          <p className="mt-3 text-muted-foreground text-pretty">
            KIDA operates under a formal constitution governing membership, elections, committees, and financial
            accountability. Read the full document and meet our standing committees.
          </p>
          <Link href="/about/governance" className="mt-5 inline-block text-sm font-medium text-kida-purple hover:underline">
            Read the Constitution &amp; Governance →
          </Link>
        </div>
      </section>
    </>
  );
}
