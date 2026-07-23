import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { footerNav } from "@/components/site/nav-data";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { FacebookIcon, TwitterIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from "@/components/site/social-icons";
import type { SiteSettings } from "@/lib/data/settings";

const socialIcons = {
  facebook: FacebookIcon,
  twitter: TwitterIcon,
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  youtube: YoutubeIcon,
} as const;

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();
  const socialEntries = Object.entries(settings.social_links).filter(([, url]) => url) as [
    keyof typeof socialIcons,
    string,
  ][];

  return (
    <footer className="border-t border-border bg-kida-charcoal text-white/90">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr_1.2fr]">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <Image src={settings.logo_url} alt={`${settings.site_name} crest`} width={40} height={40} className="h-10 w-10" />
              <span className="font-heading text-lg font-semibold text-white">{settings.site_short_name}</span>
            </Link>
            <p className="max-w-xs text-sm text-white/60">{settings.tagline} — the official alumni association of Kibabii High School, Kenya.</p>
            <div className="space-y-2 text-sm text-white/70">
              <p className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0 text-kida-gold" /> {settings.contact_address}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-kida-gold" />
                <a href={`mailto:${settings.contact_email}`} className="hover:text-white">
                  {settings.contact_email}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-kida-gold" />
                <a href={`tel:${settings.contact_phone.replace(/\s+/g, "")}`} className="hover:text-white">
                  {settings.contact_phone}
                </a>
              </p>
            </div>
            {socialEntries.length > 0 && (
              <div className="flex gap-3 pt-2">
                {socialEntries.map(([key, url]) => {
                  const Icon = socialIcons[key];
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={key}
                      className="flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-kida-gold hover:text-kida-charcoal"
                    >
                      <Icon className="size-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerNav.map((group) => (
              <div key={group.label}>
                <h3 className="font-heading text-sm font-semibold text-kida-gold">{group.label}</h3>
                <ul className="mt-3 space-y-2">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="text-sm text-white/70 hover:text-white">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold text-kida-gold">Stay Connected</h3>
            <p className="mt-3 text-sm text-white/60">
              Get KIDA news, reunion announcements, and opportunities in your inbox.
            </p>
            <NewsletterForm variant="dark" className="mt-4" />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
          <p>&copy; {year} {settings.site_name}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
