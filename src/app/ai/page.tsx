import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { IPBrowser } from "@/components/IPBrowser";
import { aiProjects, AI_INTRO_VIDEO } from "@/data/ai-projects";
import {
  type EntertainmentCopy,
} from "@/content/entertainment";
import { resolveLang, type Lang } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "AI",
  description:
    "AI-native creative practice by Francisco Alencar. Live and in-development tools, dashboards, and workflows built with Claude for entertainment and branded content. Live projects: The Compliance Zero Simulation, Property Auction Tracker, Netflix Ad Dashboard.",
};

// AI page reuses the IPBrowser slate template. Copy below mirrors the
// EntertainmentCopy shape so we can pass it through unchanged. Status and
// confidentiality labels still come from src/content/entertainment.ts so
// behavior stays identical between the two slate pages.
const aiCopy: Record<Lang, EntertainmentCopy> = {
  en: {
    eyebrow: "AI-NATIVE PRACTICE",
    title: "AI",
    intro:
      "Workflows, frameworks, and tools for AI-augmented creative production.",
    formatLabel: "FORMAT",
    genreLabel: "DOMAIN",
    yearLabel: "YEAR",
    statusLabel: "STATUS",
    collaboratorsLabel: "COLLABORATORS",
    targetLabel: "TARGET",
    gatedHeading: "Full case on request",
    gatedDescriptionRequest:
      "Full write-up, decision log, and tool stack available on request. Operators, founders, and creative leads welcome.",
    gatedDescriptionNda:
      "Currently shared under NDA. Full case study available to vetted parties on request.",
    gatedCtaLabel: "REQUEST FULL CASE",
    emptyState: "Select a project to read more.",
  },
  pt: {
    eyebrow: "PRÁTICA AI-NATIVE",
    title: "AI",
    intro:
      "Workflows, frameworks e ferramentas para produção criativa aumentada por IA.",
    formatLabel: "FORMATO",
    genreLabel: "DOMÍNIO",
    yearLabel: "ANO",
    statusLabel: "STATUS",
    collaboratorsLabel: "COLABORADORES",
    targetLabel: "DESTINO",
    gatedHeading: "Case completo sob solicitação",
    gatedDescriptionRequest:
      "Documentação completa, log de decisões e stack de ferramentas disponíveis sob solicitação. Operadores, fundadores e líderes criativos bem-vindos.",
    gatedDescriptionNda:
      "Atualmente compartilhado sob NDA. Case completo disponível para partes verificadas sob solicitação.",
    gatedCtaLabel: "SOLICITAR CASE COMPLETO",
    emptyState: "Selecione um projeto para ler mais.",
  },
};

export default async function AIPage(props: PageProps<"/ai">) {
  const { lang: langRaw } = await props.searchParams;
  const lang = resolveLang(langRaw);

  return (
    <PageShell lang={lang} showFooter={false}>
      <IPBrowser
        ips={aiProjects}
        lang={lang}
        copy={aiCopy[lang]}
        introVideo={AI_INTRO_VIDEO}
        // "AI" is short — render bigger than the long-word ENTERTAINMENT.
        titleSize="clamp(96px, 16vw, 240px)"
      />
    </PageShell>
  );
}
