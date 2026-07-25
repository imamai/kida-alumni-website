import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/site/page-header";
import { getHallOfFame } from "@/lib/data/content";

export const metadata: Metadata = { title: "Hall of Fame" };

const PLACEHOLDER_PHOTO =
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop";

export default async function HallOfFamePage() {
  const alumni = await getHallOfFame();

  return (
    <>
      <PageHeader
        eyebrow="Distinguished Kibabiians"
        title="Hall of Fame"
        description="Alumni whose achievements reflect the impact and legacy of Kibabii High School."
      />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {alumni.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Distinguished alumni will appear here once added via the admin CMS (Featured Alumni module).
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {alumni.map((alum) => (
              <div key={alum.id} className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={alum.photo?.url ?? PLACEHOLDER_PHOTO}
                    alt={alum.photo?.alt_text ?? alum.full_name}
                    fill
                    sizes="(min-width: 1024px) 33vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-lg font-medium">{alum.full_name}</h3>
                  <p className="mt-0.5 text-xs text-kida-maroon">{alum.role_title}</p>
                  {alum.bio && <p className="mt-3 text-sm whitespace-pre-wrap text-muted-foreground">{alum.bio}</p>}
                  {(alum.linkedin_url || alum.website_url) && (
                    <div className="mt-3 flex gap-4 text-sm">
                      {alum.linkedin_url && (
                        <a href={alum.linkedin_url} target="_blank" rel="noreferrer" className="text-kida-purple hover:underline">
                          LinkedIn
                        </a>
                      )}
                      {alum.website_url && (
                        <a href={alum.website_url} target="_blank" rel="noreferrer" className="text-kida-purple hover:underline">
                          Website
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
