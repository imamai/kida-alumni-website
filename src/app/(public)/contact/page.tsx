import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { ContactForm } from "@/components/site/contact-form";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata: Metadata = { title: "Contact Us" };

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageHeader
        eyebrow="Get in Touch"
        title="Contact KIDA"
        description="Questions about membership, events, or partnerships? We'd love to hear from you."
      />
      <div className="mx-auto grid max-w-5xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:px-8">
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <MapPin className="size-5 shrink-0 text-kida-gold" />
            <div>
              <p className="font-medium">Address</p>
              <p className="text-sm text-muted-foreground">{settings.contact_address}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="size-5 shrink-0 text-kida-gold" />
            <div>
              <p className="font-medium">Email</p>
              <a href={`mailto:${settings.contact_email}`} className="text-sm text-muted-foreground hover:text-kida-purple">
                {settings.contact_email}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="size-5 shrink-0 text-kida-gold" />
            <div>
              <p className="font-medium">Phone</p>
              <a
                href={`tel:${settings.contact_phone.replace(/\s+/g, "")}`}
                className="text-sm text-muted-foreground hover:text-kida-purple"
              >
                {settings.contact_phone}
              </a>
            </div>
          </div>
        </div>
        <ContactForm />
      </div>
    </>
  );
}
