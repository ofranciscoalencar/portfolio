/**
 * Shared Unbounded loader for the next/og image routes
 * (opengraph-image, icon, apple-icon).
 *
 * Google's CSS2 endpoint returns one @font-face per unicode subset, ordered
 * Cyrillic first and basic Latin LAST. Naively taking the first `src: url(...)`
 * match yields a Cyrillic subset containing none of the Latin glyphs we
 * actually render — Satori then silently falls back per-character, producing
 * text with visibly mixed weights. Select the block covering U+0000-00FF.
 *
 * The URLs also rotate, so they cannot be hardcoded.
 */

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";

export async function loadUnbounded(
  weight: 400 | 500 | 700
): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Unbounded:wght@${weight}&display=swap`,
    { headers: { "User-Agent": UA } }
  ).then((r) => r.text());

  const blocks = css.split("@font-face").filter((b) => b.includes("src:"));
  const latin =
    blocks.find((b) => /unicode-range:[^;]*U\+0000-00FF/i.test(b)) ??
    blocks.at(-1);

  if (!latin) {
    throw new Error(`Unbounded ${weight}: no @font-face block in Google CSS`);
  }

  const match = latin.match(/src:\s*url\((.+?)\)\s*format/);
  if (!match) {
    throw new Error(`Unbounded ${weight}: no font URL in the Latin block`);
  }

  return fetch(match[1]).then((r) => r.arrayBuffer());
}
