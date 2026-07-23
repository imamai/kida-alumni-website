"use client";

import Image from "next/image";
import { Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SectionHeading } from "@/components/site/section-heading";
import type { Testimonial } from "@/lib/data/content";

const PLACEHOLDER_AVATAR =
  "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=200&auto=format&fit=crop";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="bg-kida-purple py-20 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Voices of Kibabiians"
          title="What Our Alumni Say"
          align="center"
          className="[&_h2]:text-white [&_p]:text-white/70"
        />
        <Carousel opts={{ loop: true }} className="mt-12">
          <CarouselContent>
            {testimonials.map((t) => (
              <CarouselItem key={t.id} className="md:basis-1/2 lg:basis-1/3">
                <figure className="flex h-full flex-col rounded-2xl bg-white/5 p-6 backdrop-blur">
                  <Quote className="size-7 text-kida-gold" />
                  <blockquote className="mt-4 flex-1 text-sm text-white/85 text-pretty">&ldquo;{t.quote}&rdquo;</blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <Image
                      src={t.author_photo?.url ?? PLACEHOLDER_AVATAR}
                      alt=""
                      width={40}
                      height={40}
                      className="size-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-white">{t.author_name}</p>
                      {t.author_title && <p className="text-xs text-white/60">{t.author_title}</p>}
                    </div>
                  </figcaption>
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="border-white/30 bg-white/10 text-white hover:bg-white/20" />
          <CarouselNext className="border-white/30 bg-white/10 text-white hover:bg-white/20" />
        </Carousel>
      </div>
    </section>
  );
}
