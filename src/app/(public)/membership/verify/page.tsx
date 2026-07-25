import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { VerifyMembershipForm } from "@/components/site/verify-membership-form";

export const metadata: Metadata = { title: "Verify Membership" };

export default function VerifyMembershipPage() {
  return (
    <>
      <PageHeader
        eyebrow="Trust & Verification"
        title="Verify Membership"
        description="Confirm whether someone is a verified KIDA member using their Kibabii High School admission number."
      />
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <VerifyMembershipForm />
      </div>
    </>
  );
}
