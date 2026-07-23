import { Mail } from "lucide-react";
import { NewsletterForm } from "@/components/site/newsletter-form";

export function NewsletterSection() {
  return (
    <section className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="flex size-12 items-center justify-center rounded-full bg-kida-purple/10 text-kida-purple">
          <Mail className="size-5" />
        </div>
        <h2 className="mt-4 font-heading text-2xl font-semibold sm:text-3xl">Never Miss a KIDA Update</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Reunion dates, scholarship deadlines, job opportunities, and chapter news — straight to your inbox.
        </p>
        <NewsletterForm className="mt-6 w-full max-w-md" />
      </div>
    </section>
  );
}
