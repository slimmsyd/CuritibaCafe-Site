"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * Fades + lifts its children into view as the visitor scrolls down to them.
 *
 * Fail-open by design: the server renders content fully visible, so the page
 * is complete even if JS never runs. After mount, ONLY sections still below
 * the fold are hidden (inside the observer callback, so there is no visible
 * flash) and then revealed when they scroll into view. Reduced-motion users
 * never see the effect.
 */
export default function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"static" | "hidden" | "shown">("static");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let first = true;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (first) {
          first = false;
          // Already on screen at load: leave it alone, no animation.
          if (entry.isIntersecting) {
            io.disconnect();
            return;
          }
          setPhase("hidden");
          return;
        }
        if (entry.isIntersecting) {
          setPhase("shown");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -80px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={
        phase === "static"
          ? undefined
          : {
              opacity: phase === "hidden" ? 0 : 1,
              transform:
                phase === "hidden" ? "translateY(44px)" : "translateY(0)",
              transition: `opacity 0.7s ${EASE}, transform 0.7s ${EASE}`,
              willChange: phase === "hidden" ? "opacity, transform" : undefined,
            }
      }
    >
      {children}
    </div>
  );
}
