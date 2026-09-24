"use client";

import { useEffect, useState, type CSSProperties } from "react";
import {
  siGoogle,
  siYoutube,
  siTiktok,
  siNetflix,
  siNubank,
  siMotorola,
  siWaze,
} from "simple-icons";

type LogoEntry =
  | { name: string; kind: "icon"; path: string }
  | { name: string; kind: "image"; src: string; imgStyle?: CSSProperties };

// 8 brand logos, locked order per user spec 2026-04-29:
// Google · YouTube · TikTok · Netflix · Nubank · CazéTV · Waze · Motorola.
// Mercado Livre intentionally out of the cycle until we have a clean
// monochrome SVG/PNG. CazéTV ships as a white-on-transparent PNG since
// simple-icons doesn't carry it.
const logos: LogoEntry[] = [
  { name: siGoogle.title, kind: "icon", path: siGoogle.path },
  { name: siYoutube.title, kind: "icon", path: siYoutube.path },
  { name: siTiktok.title, kind: "icon", path: siTiktok.path },
  { name: siNetflix.title, kind: "icon", path: siNetflix.path },
  { name: siNubank.title, kind: "icon", path: siNubank.path },
  {
    name: "CazéTV",
    kind: "image",
    src: "/logos/cazetv-mono-white.png",
    imgStyle: { objectFit: "contain" },
  },
  { name: siWaze.title, kind: "icon", path: siWaze.path },
  { name: siMotorola.title, kind: "icon", path: siMotorola.path },
];

const CYCLE_MS = 300;
const REDUCED_MS = 2500;

export function BrandLogoCycle() {
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const interval = reducedMotion ? REDUCED_MS : CYCLE_MS;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % logos.length);
    }, interval);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  const current = logos[index];

  return (
    <span
      aria-hidden="true"
      className="relative inline-block align-middle overflow-hidden"
      style={{
        // Fixed square container. Width/height are stable regardless of
        // which logo renders inside, so the H1 never reflows.
        width: "0.85em",
        height: "0.85em",
        marginLeft: "0.35em",
        verticalAlign: "middle",
        flex: "0 0 auto",
      }}
    >
      <span
        key={index}
        title={current.name}
        className="absolute inset-0 flex items-center justify-center animate-logo-fade"
        style={{ color: "currentColor" }}
      >
        {current.kind === "icon" ? (
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-label={current.name}
            role="img"
            style={{
              width: "100%",
              height: "100%",
              display: "block",
            }}
            preserveAspectRatio="xMidYMid meet"
          >
            <title>{current.name}</title>
            <path d={current.path} />
          </svg>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={current.src}
            alt={current.name}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              width: "auto",
              height: "auto",
              ...current.imgStyle,
            }}
          />
        )}
      </span>
    </span>
  );
}
