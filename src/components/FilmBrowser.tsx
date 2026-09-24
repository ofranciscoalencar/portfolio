"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Brand, Film } from "@/data/work";
import { withLang, type Lang } from "@/lib/i18n";

type Props = {
  brand: Brand;
  films: Film[];
  lang: Lang;
  labels: {
    back: string;
    empty: string;
    tagsLabel: string;
  };
};

export function FilmBrowser({ brand, films, lang, labels }: Props) {
  const hasFilms = films.length > 0;
  const [activeSlug, setActiveSlug] = useState<string | null>(
    hasFilms ? films[0].slug : null
  );
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

  const active = films.find((f) => f.slug === activeSlug) ?? films[0] ?? null;
  const activeVideo = active ? `/videos/originals/${active.slug}.mp4` : null;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activeVideo) return;
    if (reducedMotion) {
      video.pause();
      return;
    }
    video.load();
    void video.play().catch(() => {});
  }, [activeVideo, reducedMotion]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Background video — widescreen, max resolution */}
      {activeVideo ? (
        <video
          ref={videoRef}
          key={activeVideo}
          src={activeVideo}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      ) : (
        <div aria-hidden className="absolute inset-0 bg-line" />
      )}

      {/* Soft gradient masks for legibility */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(10,10,10,0.88)_0%,rgba(10,10,10,0.65)_35%,rgba(10,10,10,0.2)_65%,transparent_90%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,10,10,0.7)_0%,rgba(10,10,10,0.3)_40%,transparent_65%)]"
      />

      {/* Overlay content grid */}
      <div className="relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-8 lg:gap-16 px-6 pt-24 pb-12 md:px-10 md:pt-28 md:pb-16">
        {/* Left: brand H1 + film list */}
        <div className="flex flex-col justify-end">
          <div className="font-mono text-[11px] tracking-[0.08em] text-foreground/60 mb-3">
            {lang === "pt" ? "TRABALHOS" : "WORK"} ·{" "}
            {films.length === 1
              ? lang === "pt"
                ? "1 FILME"
                : "1 FILM"
              : `${films.length} ${lang === "pt" ? "FILMES" : "FILMS"}`}
          </div>
          <h1
            className="font-display font-medium leading-[0.9] tracking-[-0.02em] text-foreground"
            style={{ fontSize: "clamp(48px, 9vw, 132px)" }}
          >
            {brand.name.toUpperCase()}
          </h1>
          <p className="mt-4 md:mt-6 max-w-lg text-foreground/75 leading-relaxed">
            {brand.tagline[lang]}
          </p>

          {/* Film list */}
          {hasFilms ? (
            <ul className="mt-8 md:mt-10 border-t border-foreground/15">
              {films.map((film, i) => {
                const isActive = active?.slug === film.slug;
                return (
                  <li
                    key={film.slug}
                    className="border-b border-foreground/15"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveSlug(film.slug)}
                      onMouseEnter={() => setActiveSlug(film.slug)}
                      className="group grid w-full grid-cols-[auto_1fr_auto] items-baseline gap-4 py-3 md:py-4 text-left transition-colors"
                      aria-pressed={isActive}
                    >
                      <span
                        className={`font-mono text-[11px] tracking-[0.08em] transition-colors ${
                          isActive ? "text-accent" : "text-foreground/50"
                        }`}
                        aria-hidden
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`font-display font-medium leading-tight tracking-[-0.01em] transition-colors ${
                          isActive
                            ? "text-foreground"
                            : "text-foreground/70 group-hover:text-foreground"
                        }`}
                        style={{ fontSize: "clamp(18px, 2vw, 26px)" }}
                      >
                        {film.title}
                      </span>
                      <span
                        className={`font-mono text-[10px] tracking-[0.08em] whitespace-nowrap transition-colors ${
                          isActive ? "text-foreground/80" : "text-foreground/45"
                        }`}
                      >
                        {film.year}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-10 max-w-md text-foreground/70 leading-relaxed">
              {labels.empty}
            </p>
          )}

          <div className="mt-10">
            <Link
              href={withLang("/branded", lang)}
              className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-foreground/70 hover:text-accent transition-colors py-2"
            >
              <span aria-hidden>←</span>
              <span>{labels.back}</span>
            </Link>
          </div>
        </div>

        {/* Right: active film details panel */}
        {active && (
          <aside
            key={active.slug}
            className="flex flex-col justify-end lg:justify-center animate-panel-in"
            aria-label={active.title}
          >
            <div className="max-w-lg lg:ml-auto">
              <p className="font-mono text-[11px] tracking-[0.08em] text-accent">
                {brand.name.toUpperCase()}
                <span className="text-foreground/40"> · {active.year}</span>
              </p>
              <h2
                className="mt-3 font-display font-medium leading-[1.05] tracking-[-0.015em] text-foreground"
                style={{ fontSize: "clamp(22px, 3vw, 40px)" }}
              >
                {active.title}
              </h2>
              <p
                className="mt-4 text-foreground/85 leading-snug"
                style={{ fontSize: "clamp(14px, 1.3vw, 17px)" }}
              >
                {active.tagline[lang]}
              </p>
              <p
                className="mt-5 text-foreground/75 leading-relaxed"
                style={{ fontSize: "clamp(13px, 1.1vw, 15px)" }}
              >
                {active.synopsis[lang]}
              </p>

              {/* Tags / metadata */}
              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 font-mono text-[10px] tracking-[0.08em]">
                <div>
                  <dt className="text-foreground/45">
                    {lang === "pt" ? "CLIENTE" : "CLIENT"}
                  </dt>
                  <dd className="mt-1 text-foreground/90">
                    {active.client.toUpperCase()}
                  </dd>
                </div>
                <div>
                  <dt className="text-foreground/45">
                    {lang === "pt" ? "FUNÇÃO" : "ROLE"}
                  </dt>
                  <dd className="mt-1 text-foreground/90">
                    {active.role.toUpperCase()}
                  </dd>
                </div>
                <div>
                  <dt className="text-foreground/45">
                    {lang === "pt" ? "ANO" : "YEAR"}
                  </dt>
                  <dd className="mt-1 text-foreground/90">{active.year}</dd>
                </div>
                {/* DURATION removed 2026-05-04 — runtimes weren't telling
                    the story. Slot now reserved for outcome data:
                    VIEWS > AWARDS > RESULTS, whichever the film has. */}
                {active.views && (
                  <div>
                    <dt className="text-foreground/45">VIEWS</dt>
                    <dd className="mt-1 text-foreground/90">{active.views}</dd>
                  </div>
                )}
                {active.awards && (
                  <div>
                    <dt className="text-foreground/45">
                      {lang === "pt" ? "PRÊMIOS" : "AWARDS"}
                    </dt>
                    <dd className="mt-1 text-foreground/90">{active.awards}</dd>
                  </div>
                )}
                {active.results && (
                  <div>
                    <dt className="text-foreground/45">
                      {lang === "pt" ? "RESULTADOS" : "RESULTS"}
                    </dt>
                    <dd className="mt-1 text-foreground/90">
                      {active.results}
                    </dd>
                  </div>
                )}
                {active.likes && (
                  <div>
                    <dt className="text-foreground/45">LIKES</dt>
                    <dd className="mt-1 text-foreground/90">{active.likes}</dd>
                  </div>
                )}
              </dl>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
