/**
 * ai-projects.ts — AI-native practice slate.
 *
 * Reuses the IntellectualProperty type from entertainment.ts since the
 * IPBrowser component renders both. Each entry below describes an
 * AI-augmented workflow, app, or tool built or actively developed
 * inside the studio.
 */

import type { IntellectualProperty } from "./entertainment";

export const aiProjects: IntellectualProperty[] = [
  {
    slug: "interoception",
    title: "Interoception",
    format: "Mobile App. iOS · Android.",
    genre: "Mental Health · AI-Native Product",
    logline: {
      en: "An AI-native mental health app that teaches people to read their own body signals before stress takes the wheel. Daily check-ins, guided practices, and a model that learns the user's nervous system over time.",
      pt: "Um app de saúde mental AI-native que ensina pessoas a ler os próprios sinais do corpo antes do estresse assumir o volante. Check-ins diários, práticas guiadas e um modelo que aprende o sistema nervoso do usuário ao longo do tempo.",
    },
    year: "2026",
    status: "in development",
    confidentiality: "request-gated",
    videoPath: "/videos/ai/interoception.mp4",
    // Calm cyan — close to the digital-health palette
    tint: { r: 30, g: 180, b: 220 },
  },
  {
    slug: "compliance-zero",
    title: "Compliance Zero Game",
    format: "Browser Game. PT-BR.",
    genre: "Political Satire · AI + Real-Time News",
    // Premise taken from the game's own copy (compliance-zero-art). Names no
    // individuals on purpose: everyone in the underlying case is unconvicted.
    logline: {
      en: "A satirical card game about the Banco Master case. You play an ordinary man climbing from city hall to billionaire, three cards a round, trying to hit the target before a journalist publishes and the Federal Police knock. Every card stamped FATO is a published, sourced fact. The rest is declared satire. Built with Claude and updated with the news as the case unfolds.",
      pt: "Um jogo de cartas satírico sobre o Caso Master. Você é um cidadão de bem subindo da prefeitura ao bilionário, três cartas por rodada, tentando bater a meta antes que a jornalista publique e a Polícia Federal bata à porta. Toda carta com o selo FATO aconteceu e tem fonte. O resto é sátira declarada. Feito com Claude e atualizado com o noticiário conforme o caso avança.",
    },
    year: "2026",
    status: "online",
    // Public: the game itself is the case, so no request-a-case panel.
    confidentiality: "public",
    // No launch film yet — static key art from the game (pixel-art PF search
    // scene, generic figures), shown with IPBrowser's slow poster pan.
    posterPath: "/images/ai/compliance-zero.jpg",
    // Sunset magenta from the key art
    tint: { r: 200, g: 70, b: 90 },
    // Live and playable — the only action on the panel.
    cta: {
      label: { en: "PLAY ON ITCH.IO", pt: "JOGAR NO ITCH.IO" },
      href: "https://compliancezerosim.itch.io/compliance-zero",
    },
  },
  {
    slug: "prompt-sao-paulo-fc",
    title: "Prompt São Paulo FC",
    format: "TBD",
    genre: "Sports · Brand · AI-Native Workflow",
    logline: {
      en: "Coming soon.",
      pt: "Em breve.",
    },
    year: "2026",
    status: "plan mode",
    confidentiality: "request-gated",
    videoPath: "/videos/ai/prompt-sao-paulo-fc.mp4",
    // São Paulo FC red
    tint: { r: 220, g: 60, b: 40 },
  },
  {
    slug: "koma-ip-platform",
    title: "KOMA IP Platform",
    format: "Web App. Open-Source Engine.",
    genre: "IP Scouting · Anime · AI-Native Workflow",
    // Copy taken from the KOMA README (~/koma-ip-scouting). The scouting
    // dataset is private; only the engine is public, so nothing here names
    // a scouted title.
    logline: {
      en: "An IP scouting terminal. KOMA finds comics, webtoons and novels from outside Japan that could become anime while their screen rights are still open, and ranks each one by a score built only from measured signals: audience, international reach, anime fit, validation and momentum. Every claim, from country of origin to rights status, carries the verbatim quote it rests on, re-checked against the live source. A title only shows as open after a dated rights check.",
      pt: "Um terminal de scouting de IPs. O KOMA encontra quadrinhos, webtoons e romances de fora do Japão que poderiam virar anime enquanto os direitos de tela ainda estão livres, e ranqueia cada título por uma nota feita só de sinais medidos: audiência, alcance internacional, aderência ao anime, validação e momento. Toda afirmação, do país de origem ao status dos direitos, carrega a citação literal em que se apoia, conferida de novo na fonte viva. Um título só aparece como livre depois de uma checagem de direitos datada.",
    },
    year: "2026",
    status: "online",
    // Public engine — the code is the case, so no request-a-case panel.
    confidentiality: "public",
    // Background chosen by Francisco (2026-10-08): first 30s of a third-party
    // "Big 3" anime fan edit (YouTube UVqi5du-Za0, channel Molob). Not his
    // footage and not licensed — remove this line to fall back to the tint.
    videoPath: "/videos/ai/koma-ip-platform.mp4",
    // KOMA red-orange, used if the video is removed or fails to load.
    tint: { r: 210, g: 60, b: 35 },
    cta: {
      label: { en: "VIEW ON GITHUB", pt: "VER NO GITHUB" },
      href: "https://github.com/ofranciscoalencar/koma-ip-scouting",
    },
  },
];

// Page-level background video. Plays on initial load before any AI
// project is hovered; once a project is active its tint takes over.
export const AI_INTRO_VIDEO = "/videos/ai/intro.mp4";
