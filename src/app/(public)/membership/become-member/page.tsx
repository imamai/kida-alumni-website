import { redirect } from "next/navigation";

// Membership benefits/categories content lands in a later module; for now the CTA goes
// straight to account creation, which is the actual first step of becoming a member.
export default function BecomeMemberPage() {
  redirect("/signup");
}
