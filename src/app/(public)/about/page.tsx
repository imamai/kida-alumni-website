import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, Target, Compass, ListChecks } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { SectionHeading } from "@/components/site/section-heading";
import { Timeline } from "@/components/home/timeline";

export const metadata: Metadata = { title: "About KIDA" };

const pillars = [
  {
    icon: Compass,
    title: "Vision",
    copy: "To be the leading alumni association in Kenya, empowering Kibabiians to achieve excellence and give back to their community.",
  },
  {
    icon: Target,
    title: "Mission",
    copy: "To connect, develop, and mobilize Kibabii High School alumni for lifelong networking, mentorship, and the sustained growth of our alma mater.",
  },
  {
    icon: ListChecks,
    title: "Objectives",
    copy: "Strengthen alumni networks, support scholarships and school infrastructure, promote mentorship, and champion the achievements of Kibabiians everywhere.",
  },
];

export default function AboutPage() {
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
            <p className="mt-3 text-muted-foreground text-pretty">
              Since 1998, KIDA has united generations of Kibabii High School graduates under one banner —
              &ldquo;Advancing our Prosperity.&rdquo; What began as informal reunions among former students has grown
              into a structured association with county chapters, a diaspora network, scholarship programmes, and a
              growing digital community connecting Kibabiians across the world.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="rounded-2xl border border-border bg-card p-6">
              <pillar.icon className="size-6 text-kida-gold" />
              <h3 className="mt-4 font-heading text-lg font-semibold">{pillar.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground text-pretty">{pillar.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <Timeline />

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
