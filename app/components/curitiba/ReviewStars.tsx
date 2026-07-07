// Plain (server-and-client safe) star rating. Shared by the Reviews section
// header and the continuously-scrolling ReviewsMarquee cards.
export default function ReviewStars({ rating }: { rating: number }) {
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
