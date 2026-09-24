"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

export type HoverReelItem = {
  label: string;
  meta?: string;
  href: string;
  videoSrc?: string;
  posterSrc?: string;
};

type Props = {
  items: HoverReelItem[];
  emptyState?: ReactNode;
  /**
   * Optional header (eyebrow + title + intro) rendered above the reel
   * on mobile and overlaid in the top-left on desktop. Without this,
   * mobile users land on a context-less list of brand names.
   */
  header?: ReactNode;
  /**
   * "lg" — brand-level labels dominate the viewport (default, used on /branded).
   * "md" — smaller labels that sit below a dominant page H1 (used on /branded/[brand]).
   */
  size?: "lg" | "md";
};

const LABEL_FONT_SIZE = {
  lg: "clamp(28px, 4vw, 56px)",
  md: "clamp(18px, 2.2vw, 32px)",
} as const;

const MOBILE_LABEL_FONT_SIZE = {
  lg: "clamp(22px, 6vw, 32px)",
  md: "clamp(17px, 4.5vw, 22px)",
} as const;

export function HoverReel({ items, emptyState, header, size = "lg" }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Default to first item's video so the area is never empty on desktop
  const displayIndex =
    activeIndex !== null
      ? activeIndex
      : items.findIndex((i) => i.videoSrc);
  const display = displayIndex >= 0 ? items[displayIndex] : null;
  const displayVideo = display?.videoSrc;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reducedMotion) {
      video.pause();
      return;
    }
    if (displayVideo) {
      video.load();
      void video.play().catch(() => {});
    }
  }, [displayVideo, reducedMotion]);

  return (
    <div
      className="relative w-full"
      onMouseLeave={() => setActiveIndex(null)}
    >
      {/* Desktop: full-bleed cinematic video with overlay menu */}
      <div className="hidden md:block relative min-h-screen w-full overflow-hidden bg-background">
        {/* Background video — widescreen, full-bleed, cinematic */}
        <div className="absolute inset-0">
          {displayVideo ? (
            <video
              ref={videoRef}
              key={displayVideo}
              src={displayVideo}
              className="absolute inset-0 h-full w-full object-cover"
              muted
              loop
              playsInline
              autoPlay={!reducedMotion}
              aria-hidden="true"
              preload="metadata"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-line">
              {emptyState}
            </div>
          )}
          {/* Cinematic overlay gradient for text legibility */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_right,rgba(10,10,10,0.85)_0%,rgba(10,10,10,0.55)_40%,rgba(10,10,10,0.15)_70%,transparent_100%)]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,10,0.2)_0%,transparent_30%,transparent_70%,rgba(10,10,10,0.5)_100%)]"
          />
        </div>

        {/* Menu overlay — left-aligned. When a header is provided we
            switch from vertically-centered to top-aligned-with-header
            so the eyebrow + H1 read first, then the brand list. */}
        <div
          className={`relative z-10 flex min-h-screen flex-col px-6 md:px-10 ${
            header ? "justify-start pt-28 pb-16 md:pt-32" : "justify-center py-16"
          }`}
        >
          {header && (
            <div className="mb-10 max-w-xl md:mb-14">{header}</div>
          )}
          <ul className="w-full max-w-xl space-y-1">
            {items.map((item, i) => {
              const isActive = displayIndex === i;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onMouseEnter={() => setActiveIndex(i)}
                    onFocus={() => setActiveIndex(i)}
                    className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-4 py-2 md:py-3 transition-all"
                    prefetch={false}
                  >
                    <span
                      className={`font-mono text-[11px] tracking-[0.08em] transition-colors ${
                        isActive ? "text-accent" : "text-muted"
                      }`}
                      aria-hidden
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`font-display font-medium leading-[0.95] tracking-[-0.02em] transition-colors ${
                        isActive
                          ? "text-foreground"
                          : "text-foreground/70 hover:text-foreground"
                      }`}
                      style={{ fontSize: LABEL_FONT_SIZE[size] }}
                    >
                      {item.label}
                    </span>
                    {item.meta && (
                      <span className="font-mono text-[11px] tracking-[0.08em] text-muted whitespace-nowrap">
                        {item.meta}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Mobile: header at top, then stacked list with autoplay video
          previews. Each item's video plays inline (muted, loop) so the
          page reads as a portfolio reel rather than a list of links.
          Modern phones throttle off-screen videos automatically. */}
      <div className="md:hidden px-6 pt-24 pb-16">
        {header && <div className="mb-10">{header}</div>}
        <ul className="border-t border-line">
          {items.map((item, i) => (
            <li key={item.href} className="border-b border-line py-5">
              <Link
                href={item.href}
                className="block"
                prefetch={false}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <div className="flex items-baseline gap-3">
                    <span
                      className="font-mono text-[11px] tracking-[0.08em] text-muted"
                      aria-hidden
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="font-display font-medium leading-tight tracking-[-0.01em] text-foreground"
                      style={{ fontSize: MOBILE_LABEL_FONT_SIZE[size] }}
                    >
                      {item.label}
                    </span>
                  </div>
                  {item.meta && (
                    <span className="font-mono text-[10px] tracking-[0.08em] text-muted text-right whitespace-nowrap">
                      {item.meta}
                    </span>
                  )}
                </div>
                {item.videoSrc && (
                  <div className="mt-3 aspect-video w-full overflow-hidden bg-line">
                    <video
                      src={item.videoSrc}
                      className="h-full w-full object-cover"
                      autoPlay={!reducedMotion}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      poster={item.posterSrc}
                      aria-hidden="true"
                    />
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
