import { listPublicImages } from "@/app/lib/public-assets";
import AdminPageHeader from "@/app/admin/components/ui/AdminPageHeader";
import ArtistEditor from "../ArtistEditor";

export const dynamic = "force-dynamic";

export default function NewArtistPage() {
  const assets = { images: listPublicImages() };

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        backHref="/admin/artists"
        backLabel="All artists"
        eyebrow="New artist"
        title="Add to the shelf"
        description="Start with the basics and photos. You can add works and prices below."
      />
      <ArtistEditor assets={assets} />
    </div>
  );
}