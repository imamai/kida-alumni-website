import Image from "next/image";
import { Button } from "@/components/ui/button";
import { addExistingMediaToAlbum } from "@/app/actions/admin-gallery";
import type { PickableMedia } from "@/lib/data/admin-gallery";

export function GalleryMediaPicker({ albumId, media }: { albumId: string; media: PickableMedia[] }) {
  if (media.length === 0) {
    return <p className="text-sm text-muted-foreground">No other images in the Media Library yet.</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
      {media.map((item) => (
        <form key={item.id} action={addExistingMediaToAlbum.bind(null, albumId, item.id)} className="group relative">
          <div className="relative aspect-square overflow-hidden rounded-lg border border-border">
            <Image src={item.url} alt={item.alt_text ?? ""} fill className="object-cover" sizes="15vw" />
          </div>
          <Button
            type="submit"
            size="sm"
            className="mt-1.5 w-full bg-kida-purple text-xs hover:bg-kida-purple-dark"
          >
            Add
          </Button>
        </form>
      ))}
    </div>
  );
}
