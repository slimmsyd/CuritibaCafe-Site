import Link from "next/link";
import type { ReviewsData } from "@/app/lib/reviews";
import { siteData } from "@/app/lib/site-data";

function Stars({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill={i < rounded ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className="text-ink"
        >
          <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5.9 21.4l1.4-6.8L2.2 9.9l6.9-.8L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews({ data }: { data: ReviewsData }) {
  const cards = data.reviews.slice(0, 3);

  return (
    <section id="reviews" className="px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-20 lg:px-10 lg:pb-[120px] lg:pt-[110px]">
      <h2 className="mb-3 text-center text-[15px] font-semibold uppercase tracking-[0.18em] text-ink">
        {siteData.reviews.title}
      </h2>
      <div className="mb-16 flex flex-col items-center gap-3">
        <Stars rating={data.rating} />
        <div className="text-[13px] tracking-[0.04em] text-muted">
          <span className="text-ink">{data.rating.toFixed(1)}</span> ·{" "}
          {data.count.toLocaleString()} Google reviews
        </div>
      </div>

      <div className="mx-auto grid max-w-[1560px] grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((review, i) => (
          <figure
            key={`${review.author}-${i}`}
            className="flex flex-col gap-6 border border-hairline p-10"
          >
            <Stars rating={review.rating} />
            <blockquote className="line-clamp-6 text-pretty text-[15px] leading-[1.7] text-ink">
              &ldquo;{review.text}&rdquo;
            </blockquote>
            <figcaption className="mt-auto flex items-baseline justify-between gap-4 pt-2">
              <span className="text-[12px] font-medium uppercase tracking-[0.14em] text-ink">
                {review.author}
              </span>
              {review.relativeTime ? (
                <span className="text-[12px] tracking-[0.04em] text-faint">
                  {review.relativeTime}
                </span>
              ) : null}
            </figcaption>
          </figure>
        ))}
      </div>

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
