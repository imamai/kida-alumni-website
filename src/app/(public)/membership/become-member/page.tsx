import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/page-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Become a Member" };

export default function BecomeMemberPage() {
  return (
    <>
      <PageHeader
        eyebrow="Join KIDA"
        title="Become a Member"
        description="Membership is open to every graduate of Kibabii High School — reconnect, network, and give back to your alma mater."
      />

      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-muted-foreground text-pretty">
          Creating your account takes a couple of minutes. Once verified, you&apos;ll get full access to the alumni
          directory, chapters, events, and mentorship network.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button size="lg" className="bg-kida-purple hover:bg-kida-purple-dark" nativeButton={false} render={<Link href="/signup" />}>
            Create Your Account
          </Button>
          <Button size="lg" variant="outline" nativeButton={false} render={<Link href="/membership/benefits" />}>
            See Membership Benefits
          </Button>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Not sure which category applies to you?{" "}
          <Link href="/membership/categories" className="text-kida-purple hover:underline">
            View membership categories
          </Link>
          .
        </p>
      </div>
    </>
  );
}
