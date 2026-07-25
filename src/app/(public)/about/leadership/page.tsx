import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/site/page-header";
import { RichText } from "@/components/site/rich-text";
import { getLeadership } from "@/lib/data/content";

export const metadata: Metadata = { title: "Leadership" };

const PLACEHOLDER_PORTRAIT =
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop";

const groups = [
  { key: "executive" as const, label: "Executive Committee" },
  { key: "patron" as const, label: "Patrons" },
  { key: "committee" as const, label: "Standing Committees" },
];

export default async function LeadershipPage() {
  const allLeadership = await Promise.all(groups.map((g) => getLeadership(g.key)));

  return (
    <>
      <PageHeader
        eyebrow="Governance"
        title="Leadership"
        description="The Executive Committee, Patrons, and Committees who steward KIDA's mission on behalf of every Kibabiian."
      />

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-16 sm:px-6 lg:px-8">
        {groups.map((group, i) => {
          const members = allLeadership[i];
          return (
            <section key={group.key}>
              <h2 className="font-heading text-2xl font-semibold">{group.label}</h2>
              {members.length === 0 ? (
                <p className="mt-4 rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
                  {group.label} will appear here once added via the admin CMS (Leadership module).
                </p>
              ) : (
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {members.map((member) => (
                    <div key={member.id} className="overflow-hidden rounded-2xl border border-border bg-card">
                      <div className="relative aspect-square">
                        <Image
                          src={member.photo?.url ?? PLACEHOLDER_PORTRAIT}
                          alt={member.photo?.alt_text ?? member.full_name}
                          fill
                          sizes="(min-width: 1024px) 33vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="font-heading font-medium">{member.full_name}</h3>
                        <p className="mt-0.5 text-xs text-kida-maroon">{member.title}</p>
                        {(member.county || member.term_start) && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {[
                              member.county,
                              member.term_start &&
                                `Term: ${new Date(member.term_start).getFullYear()}${member.term_end ? `–${new Date(member.term_end).getFullYear()}` : "–present"}`,
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        )}
                        {member.bio && <RichText text={member.bio} className="mt-2 text-sm text-muted-foreground" />}
                        {(member.linkedin_url || member.email) && (
                          <div className="mt-3 flex gap-4 text-sm">
                            {member.linkedin_url && (
                              <a href={member.linkedin_url} target="_blank" rel="noreferrer" className="text-kida-purple hover:underline">
                                LinkedIn
                              </a>
                            )}
                            {member.email && (
                              <a href={`mailto:${member.email}`} className="text-kida-purple hover:underline">
                                Email
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
