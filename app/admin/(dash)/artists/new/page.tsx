import Link from "next/link";
import { listPublicImages } from "@/app/lib/public-assets";
import ArtistEditor from "../ArtistEditor";

export const dynamic = "force-dynamic";

export default function NewArtistPage() {
  const assets = { images: listPublicImages() };

  return (
    <div className="flex flex-col gap-[clamp(20px,4vw,32px)]">
      <div className="flex flex-col gap-[6px]">
        <Link href="/admin/artists" className="text-[12px] text-gold hover:text-ink">
          ← Artists
        </Link>
        <span className="font-display text-[12px] uppercase tracking-[0.34em] text-gold">
          New artist
        </span>
        <h1 className="m-0 font-display text-[clamp(26px,3.4vw,40px)] font-normal leading-[1.05] tracking-[-0.02em]">
          Add to the shelf
        </h1>
      </div>
      <ArtistEditor assets={assets} />
    </div>
  );
}