export type NavLink = {
  label: string;
  href: string;
  description?: string;
};

export type NavGroup = {
  label: string;
  items: NavLink[];
};

export type NavEntry = NavLink | NavGroup;

export function isNavGroup(entry: NavEntry): entry is NavGroup {
  return "items" in entry;
}

// Static for Phase 1 — will be replaced by a kida_menus / kida_menu_items query once the CMS menu
// builder ships, without changing how <SiteHeader> consumes it.
export const primaryNav: NavEntry[] = [
  {
    label: "About",
    items: [
      { label: "About KIDA", href: "/about", description: "Our history, vision, and mission" },
      { label: "Leadership", href: "/about/leadership", description: "Executive committee and patrons" },
      { label: "Governance", href: "/about/governance", description: "Constitution and committees" },
      { label: "Hall of Fame", href: "/hall-of-fame", description: "Distinguished alumni" },
    ],
  },
  {
    label: "Membership",
    items: [
      { label: "Become a Member", href: "/membership/become-member" },
      { label: "Benefits", href: "/membership/benefits" },
      { label: "Membership Categories", href: "/membership/categories" },
      { label: "Verify Membership", href: "/membership/verify" },
    ],
  },
  {
    label: "News & Events",
    items: [
      { label: "News", href: "/news" },
      { label: "Announcements", href: "/news/announcements" },
      { label: "Events", href: "/events" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
  {
    label: "Community",
    items: [
      { label: "Alumni Directory", href: "/directory" },
      { label: "Business Directory", href: "/business-directory" },
      { label: "Career Centre", href: "/career-centre" },
      { label: "Mentorship", href: "/mentorship" },
      { label: "Scholarships & Projects", href: "/projects" },
    ],
  },
  { label: "Give", href: "/give" },
  { label: "Contact", href: "/contact" },
];

export const footerNav: NavGroup[] = [
  {
    label: "About KIDA",
    items: [
      { label: "Our History", href: "/about/history" },
      { label: "Vision & Mission", href: "/about#vision-mission" },
      { label: "Leadership", href: "/about/leadership" },
      { label: "Constitution", href: "/about/governance" },
    ],
  },
  {
    label: "Get Involved",
    items: [
      { label: "Become a Member", href: "/membership/become-member" },
      { label: "Volunteer", href: "/membership/benefits#volunteer" },
      { label: "Mentorship", href: "/mentorship" },
      { label: "Give", href: "/give" },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "News", href: "/news" },
      { label: "Events", href: "/events" },
      { label: "Career Centre", href: "/career-centre" },
      { label: "FAQs", href: "/faqs" },
      { label: "Downloads", href: "/downloads" },
    ],
  },
  {
    label: "Legal",
    items: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
];
