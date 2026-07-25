import type { Metadata } from "next";
import Link from "next/link";
import { Users, Briefcase, CalendarDays, GraduationCap, HeartHandshake, Handshake } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = { title: "Membership Benefits" };

const benefits = [
  {
    icon: Users,
    title: "Lifelong Networking",
    copy: "Stay connected with classmates and Kibabiians across every county and the diaspora through chapters and online community spaces.",
  },
  {
    icon: Handshake,
    title: "Mentorship",
    copy: "Access mentors in your field, or give back by mentoring current students and recent graduates.",
  },
  {
    icon: CalendarDays,
    title: "Events & Reunions",
    copy: "Priority access to the Annual Homecoming, chapter meetups, and members-only gatherings throughout the year.",
  },
  {
    icon: Briefcase,
    title: "Career Support",
    copy: "Tap into the alumni network for job leads, referrals, and professional connections as our Career Centre grows.",
  },
  {
    icon: GraduationCap,
    title: "Scholarship Program",
    copy: "A voice in how KIDA's scholarship fund supports needy students at Kibabii High School.",
  },
  {
    icon: HeartHandshake,
    title: "Give Back",
    copy: "Contribute your time, skills, or resources to school infrastructure projects and student welfare initiatives.",
  },
];

export default function BenefitsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Membership"
        title="Membership Benefits"
        description="Being a KIDA member connects you to a lifelong community — here's what that means in practice."
      />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="rounded-2xl border border-border bg-card p-6">
              <benefit.icon className="size-6 text-kida-gold" />
              <h3 className="mt-4 font-heading text-lg font-semibold">{benefit.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground text-pretty">{benefit.copy}</p>
            </div>
          ))}
        </div>

        <div id="volunteer" className="mt-16 scroll-mt-24 rounded-2xl border border-border bg-card p-8 text-center">
          <h2 className="font-heading text-2xl font-semibold">Volunteer With KIDA</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground text-pretty">
            Members can volunteer as mentors, event organizers, chapter leaders, or scholarship reviewers. Volunteering
            is one of the most direct ways to give back to fellow Kibabiians and the school.
          </p>
          <Link href="/contact" className="mt-5 inline-block text-sm font-medium text-kida-purple hover:underline">
            Get in touch to volunteer →
          </Link>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/membership/become-member"
            className="inline-block rounded-lg bg-kida-purple px-6 py-3 text-sm font-medium text-white hover:bg-kida-purple-dark"
          >
            Become a Member
          </Link>
        </div>
      </div>
    </>
  );
}
