import type { Lang } from "@/lib/i18n";

export type MeetCopy = {
  headline: string;
  location: string;
  bookHeading: string;
  bookDesc: string;
  bookCta: string;
  emailHeading: string;
  elsewhereHeading: string;
};

const dict: Record<Lang, MeetCopy> = {
  en: {
    headline: "LET'S CREATE SOMETHING GREAT.",
    location: "SÃO PAULO, AVAILABLE GLOBALLY",
    bookHeading: "Book a conversation",
    bookDesc: "Schedule 30 minutes to talk about your next project.",
    bookCta: "BOOK A CALL",
    emailHeading: "Or just write",
    elsewhereHeading: "Elsewhere",
  },
  pt: {
    headline: "VAMOS CRIAR ALGO GRANDE.",
    location: "SÃO PAULO, DISPONÍVEL GLOBALMENTE",
    bookHeading: "Agende uma conversa",
    bookDesc: "30 minutos para falar sobre seu próximo projeto.",
    bookCta: "AGENDAR CONVERSA",
    emailHeading: "Ou escreva direto",
    elsewhereHeading: "Outros canais",
  },
};

export function getMeetCopy(lang: Lang): MeetCopy {
  return dict[lang];
}
