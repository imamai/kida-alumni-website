import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/ui/reveal";

// Placeholder imagery via Unsplash, to be replaced by real uploads through the Gallery module
// of the CMS (kida_gallery_albums / kida_gallery_items) once photo assets are provided.
const placeholderPhotos = [
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=800&auto=format&fit=crop",
];

export function GalleryPreview() {
  return (
    <section className="bg-kida-ivory py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Moments" title="Life at KIDA" cta={{ label: "View full gallery", href: "/gallery" }} />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {placeholderPhotos.map((src, i) => (
            <Reveal key={src} delay={i * 0.05} className={i % 5 === 0 ? "col-span-2 row-span-2" : ""}>
              <div className="relative aspect-square overflow-hidden rounded-xl">
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 16vw, 33vw"
                  className="object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          <Link href="/admin/media" className="underline underline-offset-2">
            Admins:
          </Link>{" "}
          replace these placeholders from the Media Library once real event photos are available.
        </p>
      </div>
    </section>
  );
}
