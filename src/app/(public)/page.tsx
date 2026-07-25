import { Hero } from "@/components/home/hero";
import { ImpactStats } from "@/components/home/impact-stats";
import { FeaturedAlumni } from "@/components/home/featured-alumni";
import { LatestNews } from "@/components/home/latest-news";
import { UpcomingEvents } from "@/components/home/upcoming-events";
import { CtaBanner } from "@/components/home/cta-banner";
import { Timeline } from "@/components/home/timeline";
import { GalleryPreview } from "@/components/home/gallery-preview";
import { Testimonials } from "@/components/home/testimonials";
import { PartnersStrip } from "@/components/home/partners-strip";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { getSiteSettings } from "@/lib/data/settings";
import {
  getLatestNews,
  getUpcomingEvents,
  getFeaturedTestimonials,
  getActivePartners,
  getFeaturedAlumni,
} from "@/lib/data/content";

export default async function HomePage() {
  const [settings, news, events, testimonials, partners, alumni] = await Promise.all([
    getSiteSettings(),
    getLatestNews(3),
    getUpcomingEvents(3),
    getFeaturedTestimonials(6),
    getActivePartners(),
    getFeaturedAlumni(4),
  ]);

  return (
    <>
      <Hero hero={settings.hero} />
      <ImpactStats stats={settings.impact_stats} />
      <FeaturedAlumni alumni={alumni} />
      <LatestNews items={news} />
      <UpcomingEvents events={events} />
      <CtaBanner />
      <Timeline />
      <GalleryPreview />
      <Testimonials testimonials={testimonials} />
      <PartnersStrip partners={partners} />
      <NewsletterSection />
    </>
  );
}
