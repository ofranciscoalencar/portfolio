import Image from "next/image";
import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { resolveLang } from "@/lib/i18n";
import {
  CALENDLY_URL,
  EMAIL,
  INSTAGRAM_URL,
  LINKEDIN_URL,
  PORTRAIT_SRC,
} from "@/lib/contact";
import { getMeetCopy } from "@/content/meet";
import { getAboutCopy } from "@/content/about";

export const metadata: Metadata = {
  title: "Meet",
  description:
    "Francisco Alencar, Brazilian Creative Director, Screenwriter, and Strategist. 18+ years leading creative for Google, YouTube, Netflix, CazéTV, Motorola, Mercado Livre, and Nubank. 20+ films, 100M+ views. AI-native practice with Claude. New York Film Academy alum. Languages: Portuguese, English, Italian, Spanish.",
};

export default async function MeetPage(props: PageProps<"/meet">) {
  const { lang: langRaw } = await props.searchParams;
  const lang = resolveLang(langRaw);
  const m = getMeetCopy(lang);
  const a = getAboutCopy(lang);

  return (
    <PageShell lang={lang}>
      {/* Headline */}
      <section className="px-6 pt-28 pb-12 md:px-10 md:pt-40 md:pb-16">
        <h1
          className="font-display font-bold leading-[0.9] tracking-[-0.02em]"
          style={{ fontSize: "clamp(48px, 10vw, 180px)" }}
        >
          {m.headline}
        </h1>
        <p className="mt-8 font-mono text-[11px] tracking-[0.08em] text-muted">
          {m.location}
        </p>
      </section>

      {/* Portrait + Bio */}
      <section
        className="px-6 pb-20 md:px-10 md:pb-24"
        aria-label={lang === "pt" ? "Sobre" : "About"}
      >
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:gap-16 items-start">
          <div className="relative aspect-[4/5] w-full bg-line overflow-hidden">
            <Image
              src={PORTRAIT_SRC}
              alt="Francisco Alencar"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover grayscale contrast-110"
              priority
            />
          </div>

          <div className="space-y-6">
            {a.bio.map((paragraph, i) => (
              <p
                key={i}
                className="text-lg md:text-xl leading-relaxed text-foreground/90"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Credits line */}
      <section className="border-y border-line px-6 py-10 md:px-10 md:py-14">
        <p className="text-center font-mono text-[11px] tracking-[0.18em] text-muted">
          {a.credits}
        </p>
      </section>

      {/* Career stats */}
      <section className="px-6 py-16 md:px-10 md:py-20">
        <ul className="mx-auto grid max-w-4xl grid-cols-2 md:grid-cols-4 gap-px bg-line border-y border-line">
          {a.stats.map((stat) => (
            <li
              key={stat.label}
              className="bg-background p-6 md:p-8 text-center"
            >
              <div
                className="font-display font-medium tracking-[-0.02em]"
                style={{ fontSize: "clamp(28px, 3.5vw, 48px)" }}
              >
                {stat.value}
              </div>
              <div className="mt-2 font-mono text-[11px] tracking-[0.08em] text-muted">
                {stat.label}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Awards & Recognition — small, tight grid, intentionally subordinate */}
      <section className="border-t border-line px-6 py-12 md:px-10 md:py-16">
        <div className="mx-auto max-w-4xl">
          <p className="font-mono text-[11px] tracking-[0.08em] text-muted">
            {a.awards.heading.toUpperCase()}
          </p>
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 font-mono text-[11px] tracking-[0.04em]">
            {a.awards.items.map((award, i) => (
              <li
                key={`${award.year}-${award.name}-${i}`}
                className="grid grid-cols-[auto_1fr] items-baseline gap-3 py-1 border-b border-line/60"
              >
                <span className="text-muted tabular-nums">{award.year}</span>
                <span className="text-foreground/85">{award.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Book a call */}
      <section className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-[11px] tracking-[0.08em] text-muted">
            {m.bookHeading.toUpperCase()}
          </p>
          <p
            className="mt-4 font-display font-medium leading-tight tracking-[-0.01em]"
            style={{ fontSize: "clamp(24px, 3vw, 40px)" }}
          >
            {m.bookDesc}
          </p>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-3 border border-foreground/40 px-6 py-4 font-mono text-[11px] tracking-[0.08em] text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            <span>{m.bookCta}</span>
            <span aria-hidden>→</span>
          </a>
        </div>
      </section>

      {/* Email + Elsewhere */}
      <section className="border-t border-line px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2">
          <div>
            <p className="font-mono text-[11px] tracking-[0.08em] text-muted">
              {m.emailHeading.toUpperCase()}
            </p>
            <a
              href={`mailto:${EMAIL}`}
              className="mt-4 inline-block font-display text-xl md:text-2xl hover:text-accent transition-colors"
            >
              {EMAIL}
            </a>
          </div>
          <div>
            <p className="font-mono text-[11px] tracking-[0.08em] text-muted">
              {m.elsewhereHeading.toUpperCase()}
            </p>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-display text-lg md:text-xl hover:text-accent transition-colors"
                >
                  <span>LinkedIn</span>
                  <span aria-hidden className="text-muted">
                    →
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-display text-lg md:text-xl hover:text-accent transition-colors"
                >
                  <span>Instagram</span>
                  <span aria-hidden className="text-muted">
                    →
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
