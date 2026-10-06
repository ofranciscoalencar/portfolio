/**
 * YouTube video IDs per film slug.
 *
 * Usage: if a slug has an ID here, the film page uses a YouTube embed.
 * If not, it falls back to the local file at /videos/originals/{slug}.mp4.
 *
 * To populate:
 *   - Public campaigns already on a brand's channel (Google, YouTube, Motorola,
 *     TikTok Brasil, etc.): paste the existing YouTube URL's ID.
 *   - Films not publicly hosted (PLAYTAGS, internal reels): upload as UNLISTED
 *     on your own channel, then paste the ID.
 *
 * The ID is the 11-char segment after `v=` or `youtu.be/`.
 * Example: https://www.youtube.com/watch?v=dQw4w9WgXcQ → "dQw4w9WgXcQ"
 */

export const youtubeIds: Record<string, string> = {
  // ── GOOGLE ──────────────────────────────────────────
  // "google-search-mojo": "",
  // "google-photos-ios": "",
  // "we-speak-translate": "",
  // "project-loon": "",
  // "vote-agora": "",
  // "joga-mais-1": "",

  // ── YOUTUBE ─────────────────────────────────────────
  // "proud-to-play": "",
  // "youtube-brazil-reel": "",
  // "camila-interactive-makeup": "",

  // ── TIKTOK ──────────────────────────────────────────
  // "minha-voz-importa": "",

  // ── WAZE ────────────────────────────────────────────
  // "get-to-know-waze": "",

  // ── MERCADO LIVRE ───────────────────────────────────
  // "ta-na-rede": "",

  // ── MOTOROLA ────────────────────────────────────────
  // "moto-g9": "",

  // ── NETFLIX / CAZÉTV / NUBANK (placeholders, 2026-04-23) ─
  "netflix-brand-partnerships": "GV3HUDMQ-F8",
  "cazetv-fifa-world-cup-2026": "XIBIVCoC7B4",
  "nubank-croma": "-CJ1ydkcVZA",
};

export function getYouTubeId(slug: string): string | undefined {
  return youtubeIds[slug];
}
