import type { Lang } from "@/lib/i18n";

export type HomeCopy = {
  wordmark: string;
  subtitle: string;
};

const SUBTITLE = "Creative Leader, Screenwriter, Strategist";

// Tagline rendered above the H1 (sentence case, with period). Plain visible
// text so AI crawlers (GPTBot, ClaudeBot, PerplexityBot) and AEO surfaces
// pick it up as the primary positioning statement. Reinforced by
// Person JSON-LD.knowsAbout in src/lib/schema.ts and metadata descriptions.
export const TAGLINE = "Connecting Brands with Entertainment.";

// Process attribution rendered as a footnote at the bottom of the hero.
// Honest, short, slight provocation. Small-caps treatment.
export const PROCESS_NOTE = "Created by a human. Built with AI.";

const dict: Record<Lang, HomeCopy> = {
  en: {
    wordmark: "CHAMPS",
    subtitle: SUBTITLE,
  },
  pt: {
    wordmark: "CHAMPS",
    subtitle: SUBTITLE,
  },
};

export function getHomeCopy(lang: Lang): HomeCopy {
  return dict[lang];
}
