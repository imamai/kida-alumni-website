import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MemberStatusBadge } from "@/components/admin/member-status-badge";
import { MemberStatusActions } from "@/components/admin/member-status-actions";
import { getMemberById } from "@/lib/data/members";

export const metadata: Metadata = { title: "Member Profile" };

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm">{value || "—"}</dd>
    </div>
  );
}

export default async function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await getMemberById(id);
  if (!member) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href="/admin/members"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Members
      </Link>

      <Card>
        <CardHeader className="flex-row items-center gap-4">
          <Avatar size="lg">
            <AvatarImage src={member.avatar_url ?? undefined} alt="" />
            <AvatarFallback>{initials(member.full_name)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">
              {member.full_name}
              {member.preferred_name ? ` (${member.preferred_name})` : ""}
            </CardTitle>
            <div className="mt-1">
              <MemberStatusBadge status={member.membership_status} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <Field label="Admission Number" value={member.admission_number} />
            <Field label="Graduation Year" value={member.graduation_year} />
            <Field label="County" value={member.county} />
            <Field label="Country" value={member.country} />
            <Field label="City" value={member.city} />
            <Field label="Phone" value={member.phone} />
            <Field label="Profession" value={member.profession} />
            <Field label="Employer" value={member.employer} />
            <Field label="Industry" value={member.industry} />
            <Field label="Visibility" value={member.visibility} />
            <Field label="Joined" value={new Date(member.created_at).toLocaleString()} />
            <Field
              label="Verified At"
              value={member.verified_at ? new Date(member.verified_at).toLocaleString() : null}
            />
          </dl>

          {member.bio && (
            <div className="mt-4">
              <dt className="text-xs font-medium text-muted-foreground">Bio</dt>
              <dd className="mt-0.5 text-sm">{member.bio}</dd>
            </div>
          )}

          {member.skills.length > 0 && (
            <div className="mt-4">
              <dt className="mb-1.5 text-xs font-medium text-muted-foreground">Skills</dt>
              <div className="flex flex-wrap gap-1.5">
                {member.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {member.interests.length > 0 && (
            <div className="mt-4">
              <dt className="mb-1.5 text-xs font-medium text-muted-foreground">Interests</dt>
              <div className="flex flex-wrap gap-1.5">
                {member.interests.map((interest) => (
                  <Badge key={interest} variant="outline">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {(member.linkedin_url || member.github_url || member.website_url) && (
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              {member.linkedin_url && (
                <a href={member.linkedin_url} target="_blank" rel="noreferrer" className="text-kida-purple hover:underline">
                  LinkedIn
                </a>
              )}
              {member.github_url && (
                <a href={member.github_url} target="_blank" rel="noreferrer" className="text-kida-purple hover:underline">
                  GitHub
                </a>
              )}
              {member.website_url && (
                <a href={member.website_url} target="_blank" rel="noreferrer" className="text-kida-purple hover:underline">
                  Website
                </a>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <MemberStatusActions id={member.id} status={member.membership_status} />
        </CardFooter>
      </Card>
    </div>
  );
}
