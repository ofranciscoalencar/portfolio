"use client";

import { useState } from "react";

type Props = {
  videoId: string;
  title: string;
  className?: string;
};

/**
 * Lite YouTube embed — shows poster thumbnail, loads iframe only on click.
 * Saves ~500KB of YouTube player JS on initial page load.
 */
export function YouTubeEmbed({ videoId, title, className = "" }: Props) {
  const [loaded, setLoaded] = useState(false);

  const poster = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  const embed = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

  if (loaded) {
    return (
      <iframe
        src={embed}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className={`h-full w-full border-0 ${className}`}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      aria-label={`Play: ${title}`}
      className={`group relative block h-full w-full overflow-hidden bg-line ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-opacity group-hover:opacity-80"
        loading="lazy"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-background/80 text-foreground transition-all group-hover:scale-110 group-hover:bg-accent group-hover:text-background">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6 md:h-8 md:w-8 translate-x-0.5"
            aria-hidden
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </div>
    </button>
  );
}
