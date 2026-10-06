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
    title: "The Compliance Zero Simulation",
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
    slug: "property-auction-tracker",
    title: "Property Auction Tracker",
    format: "Web App. Internal Tool.",
    genre: "Market Intelligence · AI-Native Workflow",
    logline: {
      en: "An AI-native pipeline that scans Brazilian judicial auction portals, reads matrículas and edital PDFs, runs underwriting math, and surfaces only the deals that pass the thesis. Built to compress weeks of manual research into a daily dashboard.",
      pt: "Um pipeline AI-native que varre portais de leilão judicial no Brasil, lê matrículas e PDFs de edital, roda a matemática de underwriting e entrega só os negócios que passam na tese. Feito para comprimir semanas de pesquisa manual em um dashboard diário.",
    },
    year: "2026",
    status: "online",
    confidentiality: "request-gated",
    videoPath: "/videos/ai/property-auction-tracker.mp4",
    // Violet — analytical / data
    tint: { r: 140, g: 80, b: 220 },
  },
  {
    slug: "netflix-ad-dashboard",
    title: "Netflix Ad Dashboard",
    format: "Internal Dashboard. Strategy Tool.",
    genre: "Advertising · AI-Native Workflow",
    logline: {
      en: "A strategy dashboard for the Netflix ad-supported tier. Pulls audience signals, slate timing, and partner brand fit into one view, with AI-drafted recommendations for which titles to package against which advertisers.",
      pt: "Um dashboard de estratégia para o tier publicitário do Netflix. Reúne sinais de audiência, timing do slate e fit com marcas parceiras em uma única visão, com recomendações geradas por IA sobre quais títulos empacotar para quais anunciantes.",
    },
    year: "2026",
    status: "online",
    confidentiality: "request-gated",
    // Amber / gold
    tint: { r: 220, g: 160, b: 40 },
  },
];

// Page-level background video. Plays on initial load before any AI
// project is hovered; once a project is active its tint takes over.
export const AI_INTRO_VIDEO = "/videos/ai/intro.mp4";
