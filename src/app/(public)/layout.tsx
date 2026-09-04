import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteStatusNotice } from "@/components/site/site-status-notice";
import { getSiteSettings } from "@/lib/data/settings";
import { getPlatformStatus } from "@/lib/website-status";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const platform = await getPlatformStatus();
  if (platform.status !== "active") {
    return <SiteStatusNotice {...platform} />;
  }

  const settings = await getSiteSettings();

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-kida-purple focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>
      <SiteHeader siteName={settings.site_name} siteShortName={settings.site_short_name} logoUrl={settings.logo_url} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
