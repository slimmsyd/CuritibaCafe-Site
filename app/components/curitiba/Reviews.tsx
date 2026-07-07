import Link from "next/link";
import type { ReviewsData } from "@/app/lib/reviews";
import { siteData } from "@/app/lib/site-data";
import ReviewStars from "./ReviewStars";
import ReviewsMarquee from "./ReviewsMarquee";

export default function Reviews({ data }: { data: ReviewsData }) {
  return (
    <section id="reviews" className="overflow-hidden px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-20 lg:px-10 lg:pb-[120px] lg:pt-[110px]">
      <h2 className="mb-3 text-center text-[15px] font-semibold uppercase tracking-[0.18em] text-ink">
        {siteData.reviews.title}
      </h2>
      <div className="mb-16 flex flex-col items-center gap-3">
        <ReviewStars rating={data.rating} />
        <div className="text-[13px] tracking-[0.04em] text-muted">
          <span className="text-ink">{data.rating.toFixed(1)}</span> ·{" "}
          {data.count.toLocaleString()} Google reviews
        </div>
      </div>

      <ReviewsMarquee reviews={data.reviews} />

      <div className="mt-14 flex justify-center">
        <Link
          href={data.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="border-b border-ink pb-0.5 text-[12px] uppercase tracking-[0.16em] text-ink hover:text-muted"
        >
          Read all reviews on Google
        </Link>
      </div>
    </section>
  );
}
