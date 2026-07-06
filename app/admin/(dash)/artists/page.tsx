import Link from "next/link";
import {
  getArtistCount,
  getArtistWorkCount,
  listArtistsWithWorks,
} from "@/app/lib/artists-db";

export const dynamic = "force-dynamic";

export default async function AdminArtistsPage() {
  const [artists, artistCount, workCount] = await Promise.all([
    listArtistsWithWorks(),
    getArtistCount(),
    getArtistWorkCount(),
  ]);

  return (
    <div className="flex flex-col gap-[clamp(20px,4vw,32px)]">
      <div className="flex flex-col gap-[6px]">
        <span className="font-display text-[12px] uppercase tracking-[0.34em] text-gold">
          Artists
        </span>
        <h1 className="m-0 font-display text-[clamp(26px,3.4vw,40px)] font-normal leading-[1.05] tracking-[-0.02em]">
          {artistCount} {artistCount === 1 ? "artist" : "artists"} · {workCount}{" "}
          {workCount === 1 ? "work" : "works"}
        </h1>
      </div>

      {artists.length === 0 ? (
        <p className="rounded-[10px] bg-panel p-[28px] text-[15px] text-ink-soft">
          No artists in the database yet. Run{" "}
          <code className="text-[13px]">npm run db:init</code> then{" "}
          <code className="text-[13px]">npm run db:seed</code>.
        </p>
      ) : (
        <div className="flex flex-col gap-[18px]">
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="rounded-[10px] border border-ink/10 bg-panel p-[22px]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="m-0 font-display text-[20px] tracking-[-0.01em] text-ink">
                    {artist.name}
                  </h2>
                  <p className="m-0 mt-1 text-[13px] text-muted">
                    {artist.medium} · {artist.price}
                    {artist.featured ? " · Featured" : ""}
                  </p>
                </div>
                <Link
                  href={`/artists/${artist.slug}`}
                  target="_blank"
                  className="text-[12px] text-gold hover:text-ink"
                >
                  View on site ↗
                </Link>
              </div>

              <div className="mt-4 overflow-x-auto rounded-[8px] border border-ink/10 bg-white">
                <table className="w-full border-collapse text-[13px]">
                  <thead>
                    <tr className="bg-paper text-left font-display text-[11px] uppercase tracking-[0.12em] text-muted">
                      <th className="px-[14px] py-[10px] font-medium">Work</th>
                      <th className="px-[14px] py-[10px] font-medium">Price</th>
                      <th className="px-[14px] py-[10px] font-medium">Sold</th>
                    </tr>
                  </thead>
                  <tbody>
                    {artist.works.map((work) => (
                      <tr key={work.id} className="border-t border-ink/10">
                        <td className="px-[14px] py-[10px] font-medium text-ink">
                          {work.title}
                        </td>
                        <td className="px-[14px] py-[10px] text-ink-soft">
                          {work.price}
                        </td>
                        <td className="px-[14px] py-[10px] text-ink-soft">
                          {work.sold ? "Yes" : "No"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}