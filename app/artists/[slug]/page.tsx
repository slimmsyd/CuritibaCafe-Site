import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/app/components/curitiba/SiteHeader";
import SiteFooter from "@/app/components/curitiba/SiteFooter";
import ImagePlaceholder from "@/app/components/curitiba/ImagePlaceholder";
import {
  artistOrder,
  getAdjacentArtists,
  getArtistProfile,
} from "@/app/lib/site-data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return artistOrder.map((slug) => ({ slug }));
}

export default async function ArtistProfilePage({ params }: Props) {
  const { slug } = await params;
  const artist = getArtistProfile(slug);
  if (!artist) notFound();

  const adjacent = getAdjacentArtists(slug);
  if (!adjacent) notFound();

  return (
    <div className="min-w-[1100px] bg-white">
      <SiteHeader variant="artist" />

      <div className="flex gap-3 px-10 pb-0 pt-7 text-[12px] uppercase tracking-[0.14em] text-faint">
        <Link
          href="/artists"
          className="border-b border-[#d8d5cd] pb-px text-faint hover:text-muted"
        >
          Artists
        </Link>
        <span>/</span>
        <span className="text-ink">{artist.name}</span>
      </div>

      <section className="grid grid-cols-2 items-start gap-2 px-10 pb-[110px] pt-10">
        <ImagePlaceholder label={artist.portraitPlaceholder} aspect="4/5" />
        <div className="flex flex-col gap-[26px] px-20 pt-[60px]">
          <div className="text-[12px] uppercase tracking-[0.2em] text-faint">
            {artist.medium}
          </div>
          <h1 className="m-0 text-[32px] font-medium uppercase tracking-[0.14em] text-ink">
            {artist.name}
          </h1>
          <p className="m-0 max-w-[440px] text-pretty text-[15px] leading-[1.8] text-muted">
            {artist.bio}
          </p>
          <div className="max-w-[400px] border-l border-hairline pl-6 text-[15px] italic leading-[1.7] text-ink">
            &ldquo;{artist.quote}&rdquo;
          </div>
          <div className="mt-2 flex items-center gap-8">
            <Link
              href={artist.link}
              className="border border-ink px-[34px] py-3.5 text-[12px] font-medium uppercase tracking-[0.16em] text-ink hover:text-muted"
            >
              Their portfolio
            </Link>
            <span className="text-[13px] text-muted">
              At the counter — {artist.price}
            </span>
          </div>
          <div className="mt-1 text-[12px] uppercase tracking-[0.1em] text-faint">
            On the shelf since {artist.since}
          </div>
        </div>
      </section>

      <section className="px-10 pb-[120px]">
        <h2 className="mb-14 text-center text-[15px] font-semibold uppercase tracking-[0.18em] text-ink">
          On the shelf
        </h2>
        <div className="mx-auto grid max-w-[1560px] grid-cols-3 gap-2">
          {artist.works.map((work) => (
            <div key={work.title} className="flex flex-col items-center gap-[18px]">
              <ImagePlaceholder label={work.placeholder} aspect="1/1" />
              <div className="flex flex-col gap-[5px] text-center">
                <div className="text-[12px] font-medium uppercase tracking-[0.16em] text-ink">
                  {work.title}
                </div>
                <div className="text-[12px] tracking-[0.1em] text-faint">
                  {work.price}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-12 max-w-[440px] text-center text-[13px] leading-[1.7] text-faint">
          Every piece is sold at the counter only — no shipping, no holds.
          Seventy percent goes directly to {artist.firstName}.
        </p>
      </section>

      <section className="grid grid-cols-2 border-t border-hairline">
        <Link
          href={`/artists/${adjacent.prev.slug}`}
          className="flex flex-col gap-2 border-r border-hairline px-10 py-11 hover:text-muted"
        >
          <span className="text-[11px] uppercase tracking-[0.18em] text-faint">
            Previous artist
          </span>
          <span className="text-[15px] font-medium uppercase tracking-[0.14em] text-ink">
            {adjacent.prev.name}
          </span>
        </Link>
        <Link
          href={`/artists/${adjacent.next.slug}`}
          className="flex flex-col items-end gap-2 px-10 py-11 text-right hover:text-muted"
        >
          <span className="text-[11px] uppercase tracking-[0.18em] text-faint">
            Next artist
          </span>
          <span className="text-[15px] font-medium uppercase tracking-[0.14em] text-ink">
            {adjacent.next.name}
          </span>
        </Link>
      </section>

      <SiteFooter
        variant="compact"
        compactLink={{ href: "/artists", label: "All artists" }}
      />
    </div>
  );
}