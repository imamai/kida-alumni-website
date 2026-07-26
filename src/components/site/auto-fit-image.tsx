import Image from "next/image";
import { cn } from "@/lib/utils";

export type MediaRef = { url: string; alt_text?: string | null; width?: number | null; height?: number | null } | null;

/**
 * Renders at the photo's own aspect ratio (no forced crop) so the card grows or shrinks to
 * fit whatever was uploaded, instead of chopping off part of the subject to hit a fixed ratio.
 */
export function AutoFitImage({
  media,
  alt,
  fallbackUrl,
  fallbackWidth,
  fallbackHeight,
  sizes,
  className,
  priority,
}: {
  media: MediaRef;
  alt: string;
  fallbackUrl: string;
  fallbackWidth: number;
  fallbackHeight: number;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={media?.url ?? fallbackUrl}
      alt={media?.alt_text ?? alt}
      width={media?.width ?? fallbackWidth}
      height={media?.height ?? fallbackHeight}
      sizes={sizes}
      priority={priority}
      className={cn("h-auto w-full", className)}
    />
  );
}
