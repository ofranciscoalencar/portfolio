/**
 * entertainment.ts — original IP slate.
 * Complementary to work.ts (branded films). Each entry is a project
 * Champs is writing or developing as an author/showrunner.
 *
 * Confidentiality controls how much of the entry renders publicly:
 *   public        → logline + synopsis (if present) + all tags shown
 *   request-gated → logline + tags shown; synopsis hidden, "request bible" CTA
 *   nda-only      → logline + tags shown; synopsis hidden, NDA-warning + CTA
 */

export type IPStatus =
  | "in development"
  | "in production"
  | "optioned"
  | "green-lit"
  | "shopping"
  // Used by AI page (live tools / shipped products)
  | "online"
  // Used by AI page (concept stage, prompt-only / pre-build planning)
  | "plan mode";

export type IPConfidentiality = "public" | "request-gated" | "nda-only";

export type IntellectualProperty = {
  slug: string;
  title: string;
  format: string; // free-form e.g. "Feature Film. 90 min." or "Series"
  genre: string; // e.g. "Horror · Monster in the House"
  logline: { en: string; pt: string };
  synopsis?: { en: string; pt: string };
  year: string; // e.g. "2028 (target release)" or "2026"
  status: IPStatus;
  collaborators?: string; // e.g. "Other Guyz · Delicatessen Filmes"
  target?: string; // e.g. "Streaming" or specific platform
  confidentiality: IPConfidentiality;
  // Optional cinematic assets. When set, rendered as full-bleed bg on hover.
  // Drop a file at this path and the IPBrowser picks it up automatically.
  videoPath?: string; // /videos/entertainment/{slug}.mp4
  posterPath?: string; // /art/entertainment/{slug}.webp
  // Visual tint for the gradient placeholder when no video/poster exists.
  // Maps to a CSS rgba color used in the radial gradient mask.
  tint?: { r: number; g: number; b: number };
  // Optional external CTA (e.g. "Listen" → Spotify, "Watch" → Vimeo).
  // Renders as a button in the details panel after the synopsis.
  // Independent of the gated CTA: a public IP with no gated CTA can still
  // surface a primary external link via this field.
  cta?: {
    label: { en: string; pt: string };
    href: string;
  };
};

export const ips: IntellectualProperty[] = [
  {
    slug: "the-delivery",
    title: "The Delivery",
    format: "Feature Film. 90 min.",
    genre: "Horror · Monster in the House",
    logline: {
      en: "After a delivery rider learns his girlfriend is pregnant, he takes a delivery job to an elite penthouse, where a twisted game for a life-changing opportunity becomes a gamble for his own life.",
      pt: "Quando descobre que a namorada está grávida, um motoboy aceita uma entrega num penthouse de elite. Lá, um jogo retorcido por uma chance de mudar de vida vira uma aposta pela própria vida.",
    },
    year: "2028 (target release)",
    status: "in development",
    confidentiality: "request-gated",
    // Looping background clip (mood reel). IPBrowser autoplays it muted.
    videoPath: "/videos/entertainment/the-delivery.mp4",
    // Cool dark blue-violet fallback if video fails to load.
    tint: { r: 80, g: 40, b: 200 },
  },
  {
    slug: "fork-in-the-road",
    title: "Fork in the Road",
    format: "Documentary. 90 min.",
    genre: "Science & Technology · Fool Triumphant",
    logline: {
      en: "A tragicomic portrait of Twitter's journey in Brazil: from the first tweet in 2009 to the blocking of X in 2024. How a generation's dream of global connection became the world's most powerful weapon of mass disinformation.",
      pt: "Um retrato tragicômico da jornada do Twitter no Brasil: do primeiro tweet em 2009 ao bloqueio do X em 2024. Como o sonho de uma geração de conexão global virou a arma mais poderosa de desinformação em massa do mundo.",
    },
    year: "2026",
    status: "in production",
    target: "Streaming",
    confidentiality: "nda-only",
    videoPath: "/videos/entertainment/fork-in-the-road.mp4",
    // Cyan/digital tone fallback for tech-doc if video missing
    tint: { r: 30, g: 180, b: 220 },
  },
  {
    slug: "the-clinic",
    title: "The Clinic",
    format: "Series",
    genre: "Dramedy · Fool Triumphant",
    logline: {
      en: "An executive accepts a reality-show role to dodge a corruption conviction. She is confined with seven other contestants trying to rehab their addiction to corruption and redeem themselves in society's eyes. But in this tragicomedy, the contestants discover that The Clinic is not just a TV hit. It's part of a much larger scheme of death, power, and an almost-perfect plan.",
      pt: "Uma executiva aceita participar de um reality-show para evitar ser condenada por um esquema de corrupção. Ela é então confinada com outros sete participantes que buscam se reabilitar da adicção em corrupção e redimir-se perante a sociedade. Mas nesta tragicomédia, os participantes descobrirão que A Clínica não se trata apenas de um hit televisivo. É parte de um esquema muito maior que envolve morte, poder e um plano quase perfeito.",
    },
    year: "2025",
    status: "in development",
    collaborators: "Other Guyz · Delicatessen Filmes",
    target: "Streaming",
    confidentiality: "nda-only",
    videoPath: "/videos/entertainment/the-clinic.mp4",
    // Warm vermillion-ish (matches site accent) fallback for dramedy if video missing
    tint: { r: 220, g: 60, b: 40 },
  },
  {
    slug: "bolo-podcast",
    title: "BOLO Podcast",
    format: "Podcast. Episode 01.",
    genre: "Documentary · Family · Memoir",
    logline: {
      en: "How much do you know about your mother's story? And how much of that story makes you understand your own family, your city, your country, and most of all yourself? Isolated in quarantine for over 60 days, Maria de Fatima (64) revisits her own life and asks us to rethink how we deal with feminism, motherhood, inequality, and life itself.",
      pt: "Quanto você conhece da história da sua mãe? E o quanto desta história te faz conhecer mais sobre a sua família, a sua cidade, o seu país e, principalmente, sobre você mesmo? Isolada em quarentena por mais de 60 dias, Maria de Fatima (64 anos), relembra a sua história e nos faz repensar como lidamos com o feminismo, maternidade, desigualdade e vida.",
    },
    year: "2020",
    status: "online",
    target: "Spotify",
    confidentiality: "public",
    videoPath: "/videos/entertainment/bolo-podcast.mp4",
    // Warm sepia/amber memoir tint
    tint: { r: 200, g: 130, b: 60 },
    cta: {
      label: { en: "LISTEN ON SPOTIFY", pt: "OUVIR NO SPOTIFY" },
      href: "https://open.spotify.com/episode/2fgnbYSbi8VnBOSYGIovI5",
    },
  },
];

// Page-level intro background video. Plays on initial load before any IP is
// hovered/selected. Set to undefined to skip and just show the first IP's
// active state on load.
export const ENTERTAINMENT_INTRO_VIDEO = "/videos/entertainment/intro.mp4";

export function getIPBySlug(slug: string): IntellectualProperty | undefined {
  return ips.find((ip) => ip.slug === slug);
}
