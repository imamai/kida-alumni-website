import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateGalleryItem, removeGalleryItem, setAlbumCover } from "@/app/actions/admin-gallery";
import type { GalleryItem } from "@/lib/data/admin-gallery";

export function GalleryItemCard({
  item,
  albumId,
  isCover,
}: {
  item: GalleryItem;
  albumId: string;
  isCover: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative aspect-square">
        <Image src={item.url} alt={item.alt_text ?? ""} fill className="object-cover" sizes="(min-width: 1024px) 20vw, 33vw" />
        {isCover && (
          <span className="absolute top-2 left-2 rounded-full bg-kida-gold px-2 py-0.5 text-[11px] font-medium text-kida-charcoal">
            Cover
          </span>
        )}
      </div>
      <div className="space-y-2 p-3">
        <form action={updateGalleryItem.bind(null, item.id, albumId)} className="space-y-2">
          <Input name="caption" defaultValue={item.caption ?? ""} placeholder="Caption" className="h-8 text-xs" />
          <div className="flex items-center gap-2">
            <Input
              name="sort_order"
              type="number"
              min={0}
              defaultValue={item.sort_order}
              className="h-8 w-16 text-xs"
            />
            <Button type="submit" size="sm" variant="outline" className="h-8">
              Save
            </Button>
          </div>
        </form>
        <div className="flex flex-wrap gap-2">
          {!isCover && (
            <form action={setAlbumCover.bind(null, albumId, item.media_id)}>
              <Button type="submit" size="sm" variant="outline" className="h-8">
                Set as Cover
              </Button>
            </form>
          )}
          <form action={removeGalleryItem.bind(null, item.id, albumId)}>
            <Button type="submit" size="sm" variant="outline" className="h-8">
              Remove
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
