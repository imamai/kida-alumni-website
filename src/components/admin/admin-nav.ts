import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Settings,
  Users,
  Newspaper,
  CalendarDays,
  Image as ImageIcon,
  UserCog,
} from "lucide-react";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
};

export const adminNav: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Branding & Settings", href: "/admin/settings/branding", icon: Settings },
  { label: "Members", href: "/admin/members", icon: Users, disabled: true },
  { label: "News & Announcements", href: "/admin/news", icon: Newspaper, disabled: true },
  { label: "Events", href: "/admin/events", icon: CalendarDays, disabled: true },
  { label: "Media Library", href: "/admin/media", icon: ImageIcon, disabled: true },
  { label: "Roles & Permissions", href: "/admin/roles", icon: UserCog, disabled: true },
];
