"use client";

import { useEffect, useRef, useState } from "react";
import type { IntellectualProperty } from "@/data/entertainment";
import type { Lang } from "@/lib/i18n";
import {
  confidentialityLabel,
  statusLabel,
  type EntertainmentCopy,
} from "@/content/entertainment";
import { CALENDLY_URL } from "@/lib/contact";

type Props = {
  ips: IntellectualProperty[];
  lang: Lang;
  copy: EntertainmentCopy;
  /**
   * Optional page-level background video. Plays on initial load when no IP
   * is selected. Once the user hovers/clicks any IP, the active IP's video
   * (or its tinted gradient) takes over and the intro is not shown again.
   */
  introVideo?: string;
  /**
   * Optional CSS clamp() for the page H1 ("ENTERTAINMENT", "AI", etc).
   * Defaults to a size that fits long words like "ENTERTAINMENT" alongside
   * the right-side details panel. Override for short titles (e.g. "AI").
   */
  titleSize?: string;
};

export function IPBrowser({
  ips,
  lang,
  copy,
  introVideo,
  titleSize = "clamp(36px, 5vw, 72px)",
}: Props) {
  const hasIPs = ips.length > 0;
  // Initial state: no IP selected. If we have an intro video, it plays
  // until the user hovers an IP. Without an intro, fall back to first IP.
  const [activeSlug, setActiveSlug] = useState<string | null>(
    introVideo ? null : hasIPs ? ips[0].slug : null
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

  // `active` is null on initial load if we have an intro video; otherwise the
  // currently-hovered/clicked IP. Don't fall back to ips[0] when `activeSlug`
  // is explicitly null and we have an intro — the intro state is intentional.
  const active = activeSlug
    ? ips.find((ip) => ip.slug === activeSlug) ?? null
    : null;

  // Background source priority for the active IP:
  //   1. active IP videoPath  → autoplay loop
  //   2. active IP posterPath → static image (Ken Burns scale, no playback)
  //   3. intro video (only when no IP active)
  //   4. tinted gradient
  // posterPath is preferred over videoPath when both are set; in practice
  // each IP picks one or the other.
  const activePoster = active?.posterPath ?? null;
  const backgroundVideo =
    !activePoster && (active?.videoPath ?? (active ? null : introVideo ?? null));

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !backgroundVideo) return;
    if (reducedMotion) {
      video.pause();
      return;
    }
    video.load();
    void video.play().catch(() => {});
  }, [backgroundVideo, reducedMotion]);

  // Tinted radial gradient — only used when no video/poster is available.
  const tint = active?.tint ?? { r: 255, g: 45, b: 26 };
  const tintGradient = `radial-gradient(ellipse at 30% 40%, rgba(${tint.r},${tint.g},${tint.b},0.18) 0%, rgba(${tint.r},${tint.g},${tint.b},0.06) 40%, transparent 75%), #0A0A0A`;

  const isGated = active && active.confidentiality !== "public";

  // Request CTA points to Calendly so requests land in the calendar
  // queue rather than email; the project name rides as utm_campaign so
  // booked meetings carry the originating IP slug as context.
  const requestHref = active
    ? `${CALENDLY_URL}?utm_source=portfolio&utm_campaign=${encodeURIComponent(active.slug)}`
    : CALENDLY_URL;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Background source priority:
          1. active IP poster (static image with subtle ken-burns)
          2. active IP video / intro video (looping muted autoplay)
          3. tinted gradient fallback */}
      {activePoster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={activePoster}
          src={activePoster}
          alt=""
          className="absolute inset-0 h-full w-full object-cover animate-poster-pan"
          aria-hidden="true"
        />
      ) : backgroundVideo ? (
        <video
          ref={videoRef}
          key={backgroundVideo}
          src={backgroundVideo}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 transition-[background] duration-700"
          style={{ background: tintGradient }}
        />
      )}

      {/* Uniform 50% black mask over still key art — same treatment as the
          home hero. Stills are dense, high-contrast images (e.g. pixel art)
          that the directional gradients below don't calm enough on their
          own; video backgrounds don't need it. */}
      {activePoster && (
        <div aria-hidden className="absolute inset-0 bg-black/50" />
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

      {/* Overlay grid */}
      <div className="relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-8 lg:gap-16 px-6 pt-24 pb-12 md:px-10 md:pt-28 md:pb-16">
        {/* Left: eyebrow + title + intro + IP list */}
        <div className="flex flex-col justify-end">
          <div className="font-mono text-[11px] tracking-[0.08em] text-foreground/60 mb-3">
            {copy.eyebrow} ·{" "}
            {ips.length === 1
              ? `1 ${lang === "pt" ? "PROJETO" : "PROJECT"}`
              : `${ips.length} ${lang === "pt" ? "PROJETOS" : "PROJECTS"}`}
          </div>
          <h1
            className="font-display font-medium leading-[0.95] tracking-[-0.02em] text-foreground"
            style={{ fontSize: titleSize }}
          >
            {copy.title}
          </h1>
          <p className="mt-4 md:mt-6 max-w-lg text-foreground/75 leading-relaxed">
            {copy.intro}
          </p>

          {hasIPs && (
            <ul className="mt-8 md:mt-10 border-t border-foreground/15">
              {ips.map((ip, i) => {
                const isActive = active?.slug === ip.slug;
                return (
                  <li
                    key={ip.slug}
                    className="border-b border-foreground/15"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveSlug(ip.slug)}
                      onMouseEnter={() => setActiveSlug(ip.slug)}
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
                        {ip.title}
                      </span>
                      <span
                        className={`font-mono text-[10px] tracking-[0.08em] whitespace-nowrap transition-colors ${
                          isActive ? "text-foreground/80" : "text-foreground/45"
                        }`}
                      >
                        {statusLabel(ip.status, lang)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Right: active IP details panel */}
        {active && (
          <aside
            key={active.slug}
            className="flex flex-col justify-end lg:justify-center animate-panel-in"
            aria-label={active.title}
          >
            <div className="max-w-lg lg:ml-auto">
              <p className="font-mono text-[11px] tracking-[0.08em] text-accent">
                {statusLabel(active.status, lang)}
                <span className="text-foreground/40"> · {active.year}</span>
                {active.confidentiality !== "public" && (
                  <>
                    <span className="text-foreground/40"> · </span>
                    <span className="text-foreground/60">
                      {confidentialityLabel(active.confidentiality, lang)}
                    </span>
                  </>
                )}
              </p>
              <h2
                className="mt-3 font-display font-medium leading-[1.05] tracking-[-0.015em] text-foreground"
                style={{ fontSize: "clamp(22px, 3vw, 40px)" }}
              >
                {active.title}
              </h2>

              {/* Logline — always shown */}
              <p
                className="mt-4 text-foreground/85 leading-snug"
                style={{ fontSize: "clamp(14px, 1.3vw, 17px)" }}
              >
                {active.logline[lang]}
              </p>

              {/* Synopsis — only if public */}
              {active.confidentiality === "public" && active.synopsis && (
                <p
                  className="mt-5 text-foreground/75 leading-relaxed"
                  style={{ fontSize: "clamp(13px, 1.1vw, 15px)" }}
                >
                  {active.synopsis[lang]}
                </p>
              )}

              {/* Optional external CTA (e.g. Spotify, Vimeo). Independent
                  from the gated CTA so public IPs can still surface a
                  primary external link. */}
              {active.cta && (
                <a
                  href={active.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-3 border border-foreground/40 px-4 py-3 font-mono text-[11px] tracking-[0.08em] text-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  <span>{active.cta.label[lang]}</span>
                  <span aria-hidden>→</span>
                </a>
              )}

              {/* Gated panel for non-public IPs */}
              {isGated && (
                <div className="mt-6 border-t border-foreground/15 pt-5">
                  <p className="font-mono text-[11px] tracking-[0.08em] text-foreground/60 mb-2">
                    {copy.gatedHeading.toUpperCase()}
                  </p>
                  <p className="text-sm text-foreground/75 leading-relaxed mb-4">
                    {active.confidentiality === "nda-only"
                      ? copy.gatedDescriptionNda
                      : copy.gatedDescriptionRequest}
                  </p>
                  <a
                    href={requestHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 border border-foreground/40 px-4 py-3 font-mono text-[11px] tracking-[0.08em] text-foreground transition-colors hover:border-accent hover:text-accent"
                  >
                    <span>{copy.gatedCtaLabel}</span>
                    <span aria-hidden>→</span>
                  </a>
                </div>
              )}

              {/* Tags / metadata */}
              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 font-mono text-[10px] tracking-[0.08em]">
                <div>
                  <dt className="text-foreground/45">{copy.formatLabel}</dt>
                  <dd className="mt-1 text-foreground/90">{active.format}</dd>
                </div>
                <div>
                  <dt className="text-foreground/45">{copy.genreLabel}</dt>
                  <dd className="mt-1 text-foreground/90">{active.genre}</dd>
                </div>
                <div>
                  <dt className="text-foreground/45">{copy.yearLabel}</dt>
                  <dd className="mt-1 text-foreground/90">{active.year}</dd>
                </div>
                <div>
                  <dt className="text-foreground/45">{copy.statusLabel}</dt>
                  <dd className="mt-1 text-foreground/90">
                    {statusLabel(active.status, lang)}
                  </dd>
                </div>
                {active.target && (
                  <div>
                    <dt className="text-foreground/45">{copy.targetLabel}</dt>
                    <dd className="mt-1 text-foreground/90">{active.target}</dd>
                  </div>
                )}
                {active.collaborators && (
                  <div>
                    <dt className="text-foreground/45">
                      {copy.collaboratorsLabel}
                    </dt>
                    <dd className="mt-1 text-foreground/90">
                      {active.collaborators}
                    </dd>
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
