import Link from "next/link";
import { notFound } from "next/navigation";
import { getArtistById } from "@/app/lib/artists-db";
import { listPublicImages } from "@/app/lib/public-assets";
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
    <div className="flex flex-col gap-[clamp(20px,4vw,32px)]">
      <div className="flex flex-col gap-[6px]">
        <Link href="/admin/artists" className="text-[12px] text-gold hover:text-ink">
          ← Artists
        </Link>
        <span className="font-display text-[12px] uppercase tracking-[0.34em] text-gold">
          Edit artist
        </span>
        <h1 className="m-0 font-display text-[clamp(26px,3.4vw,40px)] font-normal leading-[1.05] tracking-[-0.02em]">
          {artist.name}
        </h1>
        {!artist.active ? (
          <p className="m-0 text-[14px] text-red-700">Hidden from the public site.</p>
        ) : null}
      </div>
      <ArtistEditor artist={artist} assets={assets} />
    </div>
  );
}