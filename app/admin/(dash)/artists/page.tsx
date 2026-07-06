import Link from "next/link";
import {
  getArtistCount,
  getArtistWorkCount,
  listAllArtistsWithWorks,
} from "@/app/lib/artists-db";
import AdminPageHeader from "@/app/admin/components/ui/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function AdminArtistsPage() {
  const [artists, artistCount, workCount] = await Promise.all([
    listAllArtistsWithWorks(),
    getArtistCount(),
    getArtistWorkCount(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        eyebrow="Artist shelf"
        title="Artists"
        description={`${artistCount} live on site · ${workCount} works tracked`}
        actions={
          <Link href="/admin/artists/new" className="admin-btn-primary">
            Add artist
          </Link>
        }
      />

      {artists.length === 0 ? (
        <div className="admin-section text-center">
          <p className="m-0 text-[15px] text-ink-soft">
            No artists yet. Add your first maker to the shelf.
          </p>
          <Link href="/admin/artists/new" className="admin-btn-primary mt-5 inline-flex">
            Add artist
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {artists.map((artist) => (
            <article
              key={artist.id}
              className="admin-section flex flex-col gap-4 !p-5"
            >
              <div className="flex items-start gap-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-panel">
                  {artist.shelf_image || artist.portrait_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={artist.shelf_image || artist.portrait_image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-wider text-faint">
                      No photo
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="m-0 truncate font-display text-[17px] font-medium text-ink">
                    {artist.name}
                  </h2>
                  <p className="m-0 mt-1 text-[13px] text-ink-soft">
                    {artist.medium} · {artist.price}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {!artist.active ? (
                      <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-medium text-red-700">
                        Hidden
                      </span>
                    ) : null}
                    {artist.featured ? (
                      <span className="rounded-full bg-gold/10 px-2.5 py-0.5 text-[11px] font-medium text-gold">
                        Featured
                      </span>
                    ) : null}
                    <span className="rounded-full bg-panel px-2.5 py-0.5 text-[11px] text-ink-soft">
                      {artist.works.length} works
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 border-t border-[#f0efeb] pt-4">
                <Link
                  href={`/admin/artists/${artist.id}`}
                  className="admin-btn-primary min-h-9 px-4 py-2 text-[13px]"
                >
                  Edit
                </Link>
                {artist.active ? (
                  <Link
                    href={`/artists/${artist.slug}`}
                    target="_blank"
                    className="admin-btn-secondary min-h-9 px-4 py-2 text-[13px]"
                  >
                    View live
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}