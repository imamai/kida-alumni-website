import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { getFaqs } from "@/lib/data/content";

export const metadata: Metadata = { title: "FAQs" };

export default async function FaqsPage() {
  const faqs = await getFaqs();

  const groups = faqs.reduce<Record<string, typeof faqs>>((acc, faq) => {
    (acc[faq.category] ??= []).push(faq);
    return acc;
  }, {});

  return (
    <>
      <PageHeader eyebrow="Help" title="Frequently Asked Questions" description="Answers to common questions about KIDA membership and this platform." />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        {faqs.length === 0 ? (
          <p className="text-center text-muted-foreground">No FAQs published yet — check back soon.</p>
        ) : (
          <div className="space-y-10">
            {Object.entries(groups).map(([category, items]) => (
              <section key={category}>
                <h2 className="font-heading text-lg font-semibold capitalize">{category}</h2>
                <Accordion className="mt-2">
                  {items.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>
                        <p>{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
