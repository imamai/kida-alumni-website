import { redirect } from "next/navigation";
import { getCurrentUser, isStaff } from "@/lib/auth/roles";
import { getSiteSettings } from "@/lib/data/settings";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");

  const staff = await isStaff();
  if (!staff) redirect("/");

  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar logoUrl={settings.logo_url} userEmail={user.email ?? ""} />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
