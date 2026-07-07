"use client";

import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { useMemo, useRef } from "react";
import type { ReviewItem } from "@/app/lib/site-data";
import ReviewStars from "./ReviewStars";

const SPEED = 42; // pixels per second - gentle, constant drift

function ReviewCard({ review }: { review: ReviewItem }) {
  return (
    <figure className="mr-2 flex w-[clamp(280px,82vw,380px)] shrink-0 flex-col gap-6 border border-hairline bg-white p-10">
      <ReviewStars rating={review.rating} />
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
  );
}

export default function ReviewsMarquee({ reviews }: { reviews: ReviewItem[] }) {
  const x = useMotionValue(0);
  const setRef = useRef<HTMLDivElement>(null);
  const paused = useRef(false);

  // Repeat the reviews so one measured "set" is wide enough to always cover the
  // viewport (Google returns at most 5). The set is then duplicated below for a
  // seamless wrap.
  const baseCards = useMemo(() => {
    if (reviews.length === 0) return [];
    const reps = Math.max(2, Math.ceil(8 / reviews.length));
    return Array.from({ length: reps }).flatMap(() => reviews);
  }, [reviews]);

  // Constant leftward-origin drift: the strip moves to the RIGHT, so cards enter
  // from the left edge and exit on the right. Runs regardless of the OS
  // reduced-motion setting (the motion defines the section); pauses on hover so
  // guests can read a card.
  useAnimationFrame((_, delta) => {
    if (paused.current) return;
    const setWidth = setRef.current?.offsetWidth ?? 0;
    if (!setWidth) return;
    let next = x.get() + (SPEED * delta) / 1000;
    // Keep x in [-setWidth, 0). The two sets are identical, so the wrap is
    // visually seamless.
    if (next >= 0) next -= setWidth;
    x.set(next);
  });

  if (baseCards.length === 0) return null;

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => {
        paused.current = true;
      }}
      onMouseLeave={() => {
        paused.current = false;
      }}
    >
      <motion.div className="flex w-max" style={{ x }}>
        {/* primary set (measured) */}
        <div ref={setRef} className="flex shrink-0">
          {baseCards.map((review, i) => (
            <ReviewCard key={`${review.author}-${i}`} review={review} />
          ))}
        </div>
        {/* duplicate set for the seamless loop */}
        <div className="flex shrink-0" aria-hidden>
          {baseCards.map((review, i) => (
            <ReviewCard key={`dup-${review.author}-${i}`} review={review} />
          ))}
        </div>
      </motion.div>

      {/* soft edge fades so cards drift in/out of the paper background */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[clamp(24px,6vw,96px)] bg-gradient-to-r from-paper to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[clamp(24px,6vw,96px)] bg-gradient-to-l from-paper to-transparent" />
    </div>
  );
}
