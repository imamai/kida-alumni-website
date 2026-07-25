import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { getDocuments } from "@/lib/data/content";

export const metadata: Metadata = { title: "Governance" };

export default async function GovernancePage() {
  const documents = await getDocuments("governance");

  return (
    <>
      <PageHeader
        eyebrow="Governance"
        title="Governance & Constitution"
        description="KIDA operates under a formal constitution governing membership, elections, committees, and financial accountability."
      />

      <div className="mx-auto max-w-3xl space-y-8 px-4 py-16 sm:px-6 lg:px-8">
        <section className="space-y-2">
          <h2 className="font-heading text-lg font-semibold">Structure</h2>
          <p className="text-sm text-muted-foreground text-pretty">
            KIDA is governed by an Executive Committee elected at the Annual General Meeting, supported by Patrons
            and a set of Standing Committees responsible for finance, scholarships, events, and chapter coordination.
            See the current{" "}
            <Link href="/about/leadership" className="text-kida-purple hover:underline">
              Leadership
            </Link>{" "}
            for who currently holds each role.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading text-lg font-semibold">The Constitution</h2>
          {documents.length === 0 ? (
            <p className="text-sm text-muted-foreground text-pretty">
              The constitution document will be published here once uploaded via the admin Media Library.
            </p>
          ) : (
            <ul className="divide-y divide-border rounded-2xl border border-border">
              {documents.map((doc) => (
                <li key={doc.id}>
                  <a href={doc.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 hover:bg-muted">
                    <FileText className="size-5 shrink-0 text-kida-purple" />
                    <span className="text-sm font-medium">{doc.caption ?? "KIDA Constitution"}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-2">
          <h2 className="font-heading text-lg font-semibold">Elections</h2>
          <p className="text-sm text-muted-foreground text-pretty">
            Executive Committee elections are held at the Annual General Meeting per the constitution&apos;s election
            procedures. Contact the secretariat for the current election calendar.
          </p>
        </section>
      </div>
    </>
  );
}
