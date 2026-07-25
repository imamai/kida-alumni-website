import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" description="Last updated 2026." />
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-16 text-sm text-muted-foreground sm:px-6 lg:px-8">
        <section className="space-y-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">Information We Collect</h2>
          <p>
            When you create a KIDA account we collect information you provide directly, such as your name, admission
            number, graduation year, contact details, and professional information. We also collect information you
            submit through contact forms, event registrations, and newsletter sign-ups.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">How We Use It</h2>
          <p>
            We use your information to verify membership, operate the alumni directory, communicate news and event
            updates, process event registrations, and administer the scholarship program. We do not sell your
            personal information to third parties.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">Visibility Controls</h2>
          <p>
            Your profile visibility (public, alumni-only, or private) determines who can see your directory listing.
            You can change this at any time from your account settings.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">Data Retention & Security</h2>
          <p>
            We retain member data for as long as your account is active, and take reasonable technical and
            organizational measures to protect it. You may request deletion of your account at any time by
            contacting us.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">Contact</h2>
          <p>
            Questions about this policy or your data can be sent through our{" "}
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
