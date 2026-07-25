import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = { title: "Membership Categories" };

const categories = [
  {
    title: "Regular Member",
    who: "Any graduate of Kibabii High School.",
    copy: "Full access to the alumni network, chapters, events, and mentorship opportunities.",
  },
  {
    title: "Life Member",
    who: "Alumni who choose a one-time lifetime commitment to KIDA.",
    copy: "All Regular Member benefits, recognized standing in KIDA governance, and lifelong voting rights at the Annual General Meeting.",
  },
  {
    title: "Honorary Member",
    who: "Patrons, retired staff, and distinguished friends of Kibabii High School.",
    copy: "Recognized for exceptional contribution to the school or the association, by nomination of the Executive Committee.",
  },
  {
    title: "Student / Recent Graduate",
    who: "Current Form 4 leavers and recent graduates.",
    copy: "An entry point into the network with access to mentorship and career support as they transition beyond school.",
  },
];

export default function MembershipCategoriesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Membership"
        title="Membership Categories"
        description="KIDA welcomes every Kibabiian — here's how membership is organized."
      />

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category.title} className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-heading text-lg font-semibold">{category.title}</h3>
              <p className="mt-1 text-xs font-medium text-kida-maroon">{category.who}</p>
              <p className="mt-3 text-sm text-muted-foreground text-pretty">{category.copy}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">
            Have questions about which category applies to you?{" "}
            <Link href="/contact" className="text-kida-purple hover:underline">
              Contact the secretariat
            </Link>
            .
          </p>
          <Link
            href="/membership/become-member"
            className="mt-5 inline-block rounded-lg bg-kida-purple px-6 py-3 text-sm font-medium text-white hover:bg-kida-purple-dark"
          >
            Become a Member
          </Link>
        </div>
      </div>
    </>
  );
}
