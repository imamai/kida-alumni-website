import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Settings,
  Users,
  Newspaper,
  CalendarDays,
  Image as ImageIcon,
  UserCog,
  BarChart3,
  Star,
  GalleryHorizontal,
  Images,
  Landmark,
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
  { label: "Hero Section", href: "/admin/settings/hero", icon: GalleryHorizontal },
  { label: "Homepage Statistics", href: "/admin/settings/statistics", icon: BarChart3 },
  { label: "Featured Alumni", href: "/admin/featured-alumni", icon: Star },
  { label: "About KIDA", href: "/admin/about", icon: Landmark },
  { label: "Members", href: "/admin/members", icon: Users },
  { label: "News & Announcements", href: "/admin/news", icon: Newspaper },
  { label: "Events", href: "/admin/events", icon: CalendarDays },
  { label: "Media Library", href: "/admin/media", icon: ImageIcon },
  { label: "Gallery", href: "/admin/gallery", icon: Images },
  { label: "Roles & Permissions", href: "/admin/roles", icon: UserCog, disabled: true },
];
