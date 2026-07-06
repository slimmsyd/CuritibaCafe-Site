import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/app/components/curitiba/SiteHeader";
import SiteFooter from "@/app/components/curitiba/SiteFooter";
import ImagePlaceholder from "@/app/components/curitiba/ImagePlaceholder";
import {
  getAdjacentArtists,
  getArtistProfile,
  listArtistSlugs,
} from "@/app/lib/artists";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const slugs = await listArtistSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ArtistProfilePage({ params }: Props) {
  const { slug } = await params;
  const artist = await getArtistProfile(slug);
  if (!artist) notFound();

  const adjacent = await getAdjacentArtists(slug);
  if (!adjacent) notFound();

  return (
    <div className="w-full overflow-x-hidden bg-white">
      <SiteHeader variant="artist" />

      <div className="flex flex-wrap gap-3 px-5 pb-0 pt-6 text-[12px] uppercase tracking-[0.14em] text-faint sm:px-8 sm:pt-7 lg:px-10">
        <Link
          href="/artists"
          className="border-b border-[#d8d5cd] pb-px text-faint hover:text-muted"
        >
          Artists
        </Link>
        <span>/</span>
        <span className="text-ink">{artist.name}</span>
      </div>

      <section className="grid grid-cols-1 items-start gap-8 px-5 pb-16 pt-8 sm:px-8 sm:pb-20 sm:pt-10 lg:grid-cols-2 lg:gap-2 lg:px-10 lg:pb-[110px]">
        <ImagePlaceholder label={artist.portraitPlaceholder} aspect="4/5" />
        <div className="flex flex-col gap-6 px-0 pt-0 sm:gap-[26px] lg:px-20 lg:pt-[60px]">
          <div className="text-[12px] uppercase tracking-[0.2em] text-faint">
            {artist.medium}
          </div>
          <h1 className="m-0 text-[26px] font-medium uppercase tracking-[0.14em] text-ink sm:text-[32px]">
            {artist.name}
          </h1>
          <p className="m-0 max-w-[440px] text-pretty text-[15px] leading-[1.8] text-muted">
            {artist.bio}
          </p>
          <div className="max-w-[400px] border-l border-hairline pl-6 text-[15px] italic leading-[1.7] text-ink">
            &ldquo;{artist.quote}&rdquo;
          </div>
          <div className="mt-2 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
            <Link
              href={artist.link}
              className="border border-ink px-[34px] py-3.5 text-[12px] font-medium uppercase tracking-[0.16em] text-ink hover:text-muted"
            >
              Their portfolio
            </Link>
            <span className="text-[13px] text-muted">
              At the counter - {artist.price}
            </span>
          </div>
          <div className="mt-1 text-[12px] uppercase tracking-[0.1em] text-faint">
            On the shelf since {artist.since}
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-8 sm:pb-20 lg:px-10 lg:pb-[120px]">
        <h2 className="mb-10 text-center text-[15px] font-semibold uppercase tracking-[0.18em] text-ink sm:mb-14">
          On the shelf
        </h2>
        <div className="mx-auto grid max-w-[1560px] grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-2 lg:grid-cols-3">
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
        <p className="mx-auto mt-10 max-w-[440px] text-center text-[13px] leading-[1.7] text-faint sm:mt-12">
          Every piece is sold at the counter only - no shipping, no holds.
          Seventy percent goes directly to {artist.firstName}.
        </p>
      </section>

      <section className="grid grid-cols-1 border-t border-hairline sm:grid-cols-2">
        <Link
          href={`/artists/${adjacent.prev.slug}`}
          className="flex flex-col gap-2 border-b border-hairline px-5 py-10 hover:text-muted sm:border-b-0 sm:border-r sm:px-10 sm:py-11"
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
          className="flex flex-col gap-2 px-5 py-10 hover:text-muted sm:items-end sm:px-10 sm:py-11 sm:text-right"
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