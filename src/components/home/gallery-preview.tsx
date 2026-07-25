import Image from "next/image";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/ui/reveal";
import type { GalleryPhoto } from "@/lib/data/content";

export function GalleryPreview({ photos }: { photos: GalleryPhoto[] }) {
  if (photos.length === 0) return null;

  return (
    <section className="bg-kida-ivory py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Moments" title="Life at KIDA" cta={{ label: "View full gallery", href: "/gallery" }} />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {photos.map((photo, i) => (
            <Reveal key={photo.id} delay={i * 0.05} className={i % 5 === 0 ? "col-span-2 row-span-2" : ""}>
              <div className="relative aspect-square overflow-hidden rounded-xl">
                <Image
                  src={photo.url}
                  alt={photo.alt_text ?? ""}
                  fill
                  sizes="(min-width: 768px) 16vw, 33vw"
                  className="object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
