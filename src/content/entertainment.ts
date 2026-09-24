import type { Lang } from "@/lib/i18n";
import type { IPStatus, IPConfidentiality } from "@/data/entertainment";

export type EntertainmentCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  // Per-section labels rendered in the IP details panel
  formatLabel: string;
  genreLabel: string;
  yearLabel: string;
  statusLabel: string;
  collaboratorsLabel: string;
  targetLabel: string;
  // CTA shown when synopsis is gated (request-gated or nda-only)
  gatedHeading: string;
  gatedDescriptionRequest: string; // request-gated copy
  gatedDescriptionNda: string; // nda-only copy
  gatedCtaLabel: string;
  // Empty state when no IP is selected (shouldn't normally render)
  emptyState: string;
};

const dict: Record<Lang, EntertainmentCopy> = {
  en: {
    eyebrow: "ORIGINAL SLATE",
    title: "ENTERTAINMENT",
    intro:
      "Original stories in development for streaming, documentary, and series. Brazilian voice, international scope.",
    formatLabel: "FORMAT",
    genreLabel: "GENRE",
    yearLabel: "YEAR",
    statusLabel: "STATUS",
    collaboratorsLabel: "COLLABORATORS",
    targetLabel: "TARGET",
    gatedHeading: "Full bible on request",
    gatedDescriptionRequest:
      "Full synopsis, beat sheet, and treatment available on request. Streamers, producers, and agents welcome.",
    gatedDescriptionNda:
      "Currently shared under NDA. Full bible, beat sheet, and treatment available to vetted parties on request.",
    gatedCtaLabel: "REQUEST FULL BIBLE",
    emptyState: "Select a project to read more.",
  },
  pt: {
    eyebrow: "SLATE AUTORAL",
    title: "ENTRETENIMENTO",
    intro:
      "Histórias originais em desenvolvimento para streaming, documentário e séries. Voz brasileira, escopo internacional.",
    formatLabel: "FORMATO",
    genreLabel: "GÊNERO",
    yearLabel: "ANO",
    statusLabel: "STATUS",
    collaboratorsLabel: "COLABORADORES",
    targetLabel: "DESTINO",
    gatedHeading: "Bíblia completa sob solicitação",
    gatedDescriptionRequest:
      "Sinopse completa, beat sheet e tratamento disponíveis sob solicitação. Streamers, produtoras e agentes bem-vindos.",
    gatedDescriptionNda:
      "Atualmente compartilhado sob NDA. Bíblia completa, beat sheet e tratamento disponíveis para partes verificadas sob solicitação.",
    gatedCtaLabel: "SOLICITAR BÍBLIA COMPLETA",
    emptyState: "Selecione um projeto para ler mais.",
  },
};

export function getEntertainmentCopy(lang: Lang): EntertainmentCopy {
  return dict[lang];
}

// Localized labels for status enum
const statusLabels: Record<Lang, Record<IPStatus, string>> = {
  en: {
    "in development": "IN DEVELOPMENT",
    "in production": "IN PRODUCTION",
    optioned: "OPTIONED",
    "green-lit": "GREEN-LIT",
    shopping: "SHOPPING",
    online: "ONLINE",
    "plan mode": "PLAN MODE",
  },
  pt: {
    "in development": "EM DESENVOLVIMENTO",
    "in production": "EM PRODUÇÃO",
    optioned: "COM OPÇÃO",
    "green-lit": "APROVADO",
    shopping: "EM PROSPECÇÃO",
    online: "ONLINE",
    "plan mode": "PLAN MODE",
  },
};

export function statusLabel(status: IPStatus, lang: Lang): string {
  return statusLabels[lang][status];
}

// Localized labels for confidentiality enum (used in tag pill on details)
const confidentialityLabels: Record<Lang, Record<IPConfidentiality, string>> = {
  en: {
    public: "PUBLIC",
    "request-gated": "REQUEST-GATED",
    "nda-only": "NDA",
  },
  pt: {
    public: "PÚBLICO",
    "request-gated": "SOB SOLICITAÇÃO",
    "nda-only": "NDA",
  },
};

export function confidentialityLabel(
  level: IPConfidentiality,
  lang: Lang
): string {
  return confidentialityLabels[lang][level];
}
