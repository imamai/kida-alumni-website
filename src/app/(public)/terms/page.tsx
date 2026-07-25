import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms of Use" description="Last updated 2026." />
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-16 text-sm text-muted-foreground sm:px-6 lg:px-8">
        <section className="space-y-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">Eligibility</h2>
          <p>
            Membership accounts are intended for verified alumni of Kibabii High School. KIDA staff may request
            supporting information (such as an admission number) to confirm eligibility before verifying an account.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">Acceptable Use</h2>
          <p>
            You agree to use the KIDA platform respectfully — no harassment, spam, impersonation, or misuse of the
            alumni directory for unsolicited commercial contact. KIDA may suspend accounts that violate these terms.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">Content</h2>
          <p>
            Content you submit (profile information, comments, event registrations) must be accurate and belong to
            you. KIDA reserves the right to remove content that violates these terms or applicable law.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">Events & Payments</h2>
          <p>
            Where events require registration or a fee, specific terms (capacity, refund policy, deadlines) will be
            stated on the event page at the time of registration.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">Changes</h2>
          <p>
            We may update these terms from time to time. Continued use of the platform after changes take effect
            constitutes acceptance of the updated terms.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">Contact</h2>
          <p>
            Questions about these terms can be sent through our{" "}
            <a href="/contact" className="text-kida-purple hover:underline">
              Contact page
            </a>
            .
          </p>
        </section>
      </div>
    </>
  );
}
