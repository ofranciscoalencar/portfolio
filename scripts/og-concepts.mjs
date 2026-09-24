#!/usr/bin/env node
/**
 * Render OG card concepts to reports/og-concepts/ for side-by-side review.
 *
 * Uses the same next/og ImageResponse pipeline the real
 * src/app/opengraph-image.tsx uses, so what you see here is exactly what
 * would ship. Not part of the site — scripts/ is .vercelignore'd.
 *
 *   node scripts/og-concepts.mjs
 */

import { ImageResponse } from "next/dist/server/og/image-response.js";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "reports", "og-concepts");

const ACCENT = "#FF2D1A";
const FG = "#F5F5F1";
const BG = "#0A0A0A";
const SIZE = { width: 1200, height: 630 };

// ─── Fonts ──────────────────────────────────────────────────────────────

async function loadFont(weight) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Unbounded:wght@${weight}&display=swap`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
      },
    }
  ).then((r) => r.text());

  // Google returns one @font-face per unicode subset, Cyrillic FIRST and
  // basic Latin LAST. Taking the first url yields a Cyrillic subset with no
  // Latin glyphs, which makes Satori silently fall back per-character and
  // render mixed weights. Select the block covering U+0000-00FF instead.
  const blocks = css.split("@font-face").filter((b) => b.includes("src:"));
  const latin =
    blocks.find((b) => /unicode-range:[^;]*U\+0000-00FF/i.test(b)) ??
    blocks.at(-1);
  if (!latin) throw new Error(`Unbounded ${weight}: no @font-face block found`);
  const m = latin.match(/src:\s*url\((.+?)\)\s*format/);
  if (!m) throw new Error(`Unbounded ${weight}: no font URL in latin block`);
  return fetch(m[1]).then((r) => r.arrayBuffer());
}

// ─── The mark ───────────────────────────────────────────────────────────
//
// A near-closed ring broken on the right — reads simultaneously as a "C"
// for Champs and as a camera aperture. The gap is closed by the vermillion
// dot that already signs every brand surface (wordmark period, favicon,
// video outro), so the mark is derived from the existing system rather
// than bolted on. Geometric, so it holds at 16px and at poster scale.

const h = (type, props, ...children) => ({
  type,
  props: { ...props, children: children.length > 1 ? children : children[0] },
});

function Mark({ size, ring = FG, dot = ACCENT, stroke = 13 }) {
  // Arc from -52° to +52° counterclockwise (the long way round), leaving a
  // gap on the right. Circle r=36 in a 100x100 viewBox.
  const rad = (d) => (d * Math.PI) / 180;
  const R = 36;
  const cx = 50;
  const cy = 50;
  const a = 52;
  const x1 = (cx + R * Math.cos(rad(-a))).toFixed(2);
  const y1 = (cy + R * Math.sin(rad(-a))).toFixed(2);
  const x2 = (cx + R * Math.cos(rad(a))).toFixed(2);
  const y2 = (cy + R * Math.sin(rad(a))).toFixed(2);

  return h(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 100 100",
      style: { display: "block" },
    },
    h("path", {
      d: `M ${x1} ${y1} A ${R} ${R} 0 1 0 ${x2} ${y2}`,
      stroke: ring,
      strokeWidth: stroke,
      strokeLinecap: "round",
      fill: "none",
    }),
    h("circle", { cx: cx + R, cy: cy, r: stroke / 2 + 1.5, fill: dot })
  );
}

const mono = (fontFamily) => ({
  fontFamily,
  fontSize: 16,
  letterSpacing: 3.5,
  textTransform: "uppercase",
  color: "rgba(245,245,241,0.62)",
});

// ─── Concepts ───────────────────────────────────────────────────────────

/** A — Monogram lockup. Mark centered above name + role. */
function conceptA(F) {
  return h(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: `radial-gradient(ellipse at 50% 42%, rgba(255,45,26,0.10) 0%, transparent 62%), ${BG}`,
        fontFamily: F,
      },
    },
    h("div", { style: { display: "flex" } }, Mark({ size: 190 })),
    h(
      "div",
      {
        style: {
          marginTop: 44,
          fontSize: 70,
          fontWeight: 700,
          letterSpacing: -2.5,
          color: FG,
          display: "flex",
        },
      },
      "FRANCISCO ALENCAR"
    ),
    h(
      "div",
      {
        style: {
          marginTop: 16,
          fontSize: 25,
          fontWeight: 400,
          color: "rgba(245,245,241,0.86)",
          display: "flex",
        },
      },
      "Creative Director, Screenwriter, Strategist"
    ),
    h("div", { style: { marginTop: 34, width: 96, height: 3, background: ACCENT, display: "flex" } }),
    h("div", { style: { ...mono(F), marginTop: 30, display: "flex" } }, "franciscoalencar.com")
  );
}

/** B — Mark + credential bar. Editorial case-card. */
function conceptB(F) {
  return h(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px 72px",
        background: `radial-gradient(ellipse at 22% 30%, rgba(255,45,26,0.13) 0%, transparent 60%), ${BG}`,
        fontFamily: F,
      },
    },
    h(
      "div",
      { style: { display: "flex", alignItems: "center", justifyContent: "space-between" } },
      h("div", { style: { display: "flex" } }, Mark({ size: 86 })),
      h("div", { style: { ...mono(F), display: "flex" } }, "São Paulo · Working Globally")
    ),
    h(
      "div",
      { style: { display: "flex", flexDirection: "column" } },
      h(
        "div",
        {
          style: {
            fontSize: 82,
            fontWeight: 700,
            letterSpacing: -3,
            lineHeight: 1.0,
            color: FG,
            display: "flex",
            flexDirection: "column",
          },
        },
        h("div", { style: { display: "flex" } }, "Francisco Alencar"),
        h(
          "div",
          { style: { display: "flex", color: "rgba(245,245,241,0.5)" } },
          "Creative Director"
        )
      ),
      h(
        "div",
        {
          style: {
            marginTop: 22,
            fontSize: 24,
            fontWeight: 400,
            color: "rgba(245,245,241,0.85)",
            display: "flex",
          },
        },
        "Screenwriter · Strategist · AI-native practice"
      )
    ),
    h(
      "div",
      { style: { display: "flex", flexDirection: "column" } },
      h("div", { style: { width: 120, height: 3, background: ACCENT, display: "flex" } }),
      h(
        "div",
        { style: { ...mono(F), marginTop: 18, fontSize: 13, letterSpacing: 1.8, whiteSpace: "nowrap", display: "flex" } },
        "Google · YouTube · TikTok · Netflix · Nubank · CazéTV · Waze · Motorola · Mercado Livre"
      )
    )
  );
}

/** C — Mark only. Maximum confidence, minimum information. */
function conceptC(F) {
  return h(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: `radial-gradient(ellipse at 50% 46%, rgba(255,45,26,0.12) 0%, transparent 58%), ${BG}`,
        fontFamily: F,
      },
    },
    h("div", { style: { display: "flex" } }, Mark({ size: 300, stroke: 11 })),
    h(
      "div",
      { style: { ...mono(F), marginTop: 56, fontSize: 19, letterSpacing: 7, color: "rgba(245,245,241,0.78)", display: "flex" } },
      "franciscoalencar.com"
    )
  );
}

// ─── Render ─────────────────────────────────────────────────────────────

async function main() {
  await mkdir(OUT, { recursive: true });
  const [regular, bold] = await Promise.all([loadFont(400), loadFont(700)]);
  const fonts = [
    { name: "Unbounded", data: regular, weight: 400, style: "normal" },
    { name: "Unbounded", data: bold, weight: 700, style: "normal" },
  ];

  const concepts = { "concept-a": conceptA, "concept-b": conceptB, "concept-c": conceptC };

  for (const [name, fn] of Object.entries(concepts)) {
    const res = new ImageResponse(fn("Unbounded"), { ...SIZE, fonts });
    const buf = Buffer.from(await res.arrayBuffer());
    const file = path.join(OUT, `${name}.png`);
    await writeFile(file, buf);
    console.log(`  ${name}.png  ${(buf.length / 1024).toFixed(0)}KB`);
  }
  console.log(`\nWrote to reports/og-concepts/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
