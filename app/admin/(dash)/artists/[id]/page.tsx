import { notFound } from "next/navigation";
import { getArtistById } from "@/app/lib/artists-db";
import { listPublicImages } from "@/app/lib/public-assets";
import AdminPageHeader from "@/app/admin/components/ui/AdminPageHeader";
import ArtistEditor from "../ArtistEditor";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditArtistPage({ params }: Props) {
  const { id } = await params;
  const artistId = Number(id);
  if (!Number.isFinite(artistId)) notFound();

  const artist = await getArtistById(artistId);
  if (!artist) notFound();

  const assets = { images: listPublicImages() };

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        backHref="/admin/artists"
        backLabel="All artists"
        eyebrow="Edit artist"
        title={artist.name}
        description="Update photos, works, prices, and visibility. Changes go live when you save."
        badge={
          !artist.active ? (
            <span className="rounded-full bg-red-50 px-3 py-1 text-[12px] font-medium text-red-700">
              Hidden
            </span>
          ) : null
        }
      />
      <ArtistEditor artist={artist} assets={assets} />
    </div>
  );
}