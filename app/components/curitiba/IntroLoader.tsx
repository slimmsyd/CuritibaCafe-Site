"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

const REDUCED_MOTION_MQ = "(prefers-reduced-motion: reduce)";

// Reactive prefers-reduced-motion (false during SSR).
function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_MQ);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_MQ).matches,
    () => false,
  );
}

/**
 * Full-screen video intro shown on every hard page load before the site.
 * - Plays public/curitiba-cafe.mp4 (muted for autoplay), then fades out.
 * - Skippable by click / Enter / Escape - never traps the visitor.
 * - Honors prefers-reduced-motion (skips straight to the site).
 * Mounted in the root layout, so it renders once per load and does NOT
 * replay on client-side navigation (the layout persists across routes).
 */
export default function IntroLoader() {
  // Start visible so the very first server/client paint covers the site with
  // no flash-of-content; reduced-motion visitors skip straight to the site.
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [progress, setProgress] = useState(0);
  // Fades the video in once it can actually render frames (see onCanPlay).
  const [ready, setReady] = useState(false);
  const reduceMotion = useReducedMotion();
  const showing = visible && !reduceMotion;
  // When autoplay is blocked (e.g. Brave Shields) or the file fails to decode,
  // we do NOT bail out - we hold the branded splash and let the visitor click
  // "Enter". Only this flag changes; the intro stays on screen.
  const [needsTap, setNeedsTap] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const dismiss = useCallback(() => {
    setLeaving(true);
    // Match the CSS fade duration below before unmounting.
    window.setTimeout(() => setVisible(false), 700);
  }, []);

  // Backdrop click: if autoplay was blocked, the tap is the user gesture that
  // lets us start playback (Brave blocks autoplay by default) - play, don't
  // skip. Once playing (or if playback is impossible), a click skips as usual.
  const onBackdropClick = useCallback(() => {
    const v = videoRef.current;
    if (needsTap && v) {
      v.muted = true; // belt-and-braces: guarantee muted at gesture time
      v.play()
        .then(() => setNeedsTap(false))
        .catch(() => dismiss()); // truly can't play - let them in
      return;
    }
    dismiss();
  }, [needsTap, dismiss]);

  // Autoplay can be blocked (Brave/Safari/Shields). If so, hold the branded
  // splash on the video's first frame and invite a tap - never flash away.
  useEffect(() => {
    if (!showing) return;
    const v = videoRef.current;
    v?.play().catch(() => setNeedsTap(true));
  }, [showing]);

  // Lock scroll while the intro is on screen.
  useEffect(() => {
    if (!showing) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showing]);

  // Keyboard: Enter / Escape / Space skip.
  useEffect(() => {
    if (!showing) return;
    const onKey = (e: KeyboardEvent) => {
      if (["Enter", "Escape", " "].includes(e.key)) dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showing, dismiss]);

  if (!showing) return null;

  return (
    <div
      role="dialog"
      aria-label="Intro"
      onClick={onBackdropClick}
      className={`fixed inset-0 z-[60] flex cursor-pointer items-center justify-center overflow-hidden bg-ink transition-opacity duration-700 ease-in ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
    >
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
        src="/curitiba-cafe.mp4"
        poster="/intro-poster.jpg"
        muted
        playsInline
        autoPlay
        preload="auto"
        onCanPlay={() => setReady(true)}
        onTimeUpdate={(e) => {
          const el = e.currentTarget;
          // canplay can fire before hydration attaches handlers; timeupdate
          // keeps firing, so use it as the fallback fade-in trigger.
          if (!ready) setReady(true);
          if (el.duration) setProgress(el.currentTime / el.duration);
        }}
        onEnded={dismiss}
        onError={() => setNeedsTap(true)}
      />

      {/* Scrim so the wordmark stays legible over the footage */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/60" />

      <div className="pointer-events-none relative flex flex-col items-center gap-4 text-center">
        <div
          className="text-[28px] font-semibold uppercase tracking-[0.32em] text-white"
          style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
        >
          Curitiba
        </div>
        <div
          className="text-[11px] uppercase tracking-[0.24em] text-white/80"
          style={{ textShadow: "0 1px 12px rgba(0,0,0,0.5)" }}
        >
          Coffee · Community · Craft
        </div>
        {needsTap && (
          <div
            className="mt-1 animate-pulse text-[11px] uppercase tracking-[0.24em] text-white/90"
            style={{ textShadow: "0 1px 12px rgba(0,0,0,0.5)" }}
          >
            Tap to play
          </div>
        )}
      </div>

      {/* Skip control */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          dismiss();
        }}
        className="absolute bottom-8 right-8 z-10 cursor-pointer border-b border-white/70 pb-0.5 text-[11px] uppercase tracking-[0.2em] text-white/90 transition-colors hover:text-white"
      >
        Enter
      </button>

      {/* Progress bar */}
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/15">
        <div
          className="h-full bg-white transition-[width] duration-150 ease-linear"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
    </div>
  );
}
