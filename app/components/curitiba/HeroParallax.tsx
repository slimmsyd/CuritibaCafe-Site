"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import type { ReactNode } from "react";

const BOX_CLASS =
  "relative h-[72vh] min-h-[420px] overflow-hidden bg-ink sm:h-[78vh] sm:min-h-[520px] lg:h-[82vh] lg:min-h-[560px]";

/**
 * Pinned hero with a gentle depth cue: the hero stays fixed in place (CSS
 * sticky - it works with or without JS) while the page content slides up over
 * it. As the visitor scrolls, the hero footage slowly zooms and dims, so the
 * incoming sections feel like they rise toward the camera.
 *
 * Fail-open: the pinning is pure CSS; the zoom/dim are additive polish and
 * are skipped entirely for reduced-motion users.
 */
export default function HeroParallax({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  // Fixed pixel ranges (~one hero height on typical screens) - no measuring.
  const scale = useTransform(scrollY, [0, 900], [1, 1.08], { clamp: true });
  const dim = useTransform(scrollY, [0, 700], [0, 0.45], { clamp: true });

  return (
    <section id="top" className="sticky top-0 z-0">
      <div className={BOX_CLASS}>
        {reduce ? (
          children
        ) : (
          <>
            <motion.div className="absolute inset-0" style={{ scale }}>
              {children}
            </motion.div>
            {/* Darkens the pinned hero as content scrolls over it. */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[3] bg-black"
              style={{ opacity: dim }}
            />
          </>
        )}
      </div>
    </section>
  );
}
