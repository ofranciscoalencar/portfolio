import { PageShell } from "@/components/PageShell";
import { BrandLogoCycle } from "@/components/BrandLogoCycle";
import { PROCESS_NOTE, TAGLINE, getHomeCopy } from "@/content/home";
import { resolveLang } from "@/lib/i18n";

// Subtle text-shadow for legibility over bright sections of the unmasked
// background video. Same pattern used on Nav links.
const textShadow = "[text-shadow:_0_1px_3px_rgba(0,0,0,0.4)]";

export default async function HomePage(props: PageProps<"/">) {
  const searchParams = await props.searchParams;
  const lang = resolveLang(searchParams?.lang);
  const copy = getHomeCopy(lang);

  return (
    <PageShell lang={lang} showFooter={false}>
      {/*
        Single-viewport cinematic hero. Video plays under a 50% black
        mask for consistent text legibility regardless of which frame is
        on screen. Per-character text-shadow gives a second layer of
        defense for any text that lands over a particularly bright spot.
        Navigation lives in the top-right menu: AI · Branded · Entertainment · Meet.
      */}
      <section
        className="relative flex h-screen min-h-screen w-full items-center justify-center overflow-hidden bg-background px-6"
        aria-label="Hero"
      >
        {/* Background video — autoplay/muted/loop/playsInline are required
            for in-browser autoplay across Chrome, Safari, Firefox, iOS.
            preload="auto" buffers the full 1:10 clip up front so the loop
            seam plays seamlessly instead of stalling for a re-buffer. */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />

        {/* Uniform 50% black mask for text legibility */}
        <div aria-hidden className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 flex w-full max-w-6xl flex-col items-center text-center">
          {/* Tagline above H1 — sentence case, plain visible text.
              GEO/AEO: AI crawlers (GPTBot, ClaudeBot, PerplexityBot) and
              answer-engine surfaces read this as the primary positioning
              statement. Mirrors knowsAbout in Person JSON-LD. */}
          <p
            className={`mb-4 md:mb-6 font-mono text-[11px] md:text-[12px] tracking-[0.18em] text-foreground/85 ${textShadow}`}
          >
            {TAGLINE}
          </p>
          <h1
            className={`font-display font-bold text-foreground leading-[0.9] tracking-[-0.02em] whitespace-nowrap ${textShadow}`}
            style={{ fontSize: "clamp(40px, 8vw, 180px)" }}
          >
            {copy.wordmark}
            <BrandLogoCycle />
          </h1>

          <p
            className={`mt-6 md:mt-10 font-display font-normal text-foreground/95 tracking-[0] leading-relaxed max-w-3xl ${textShadow}`}
            style={{ fontSize: "clamp(18px, 2vw, 32px)" }}
          >
            {copy.subtitle}
          </p>
        </div>

        {/* Process attribution footnote — bottom of hero, small-caps. */}
        <p
          className={`absolute inset-x-0 bottom-6 md:bottom-8 z-10 text-center font-mono text-[10px] tracking-[0.22em] text-foreground/60 ${textShadow}`}
          style={{ fontVariantCaps: "all-small-caps" }}
        >
          {PROCESS_NOTE}
        </p>
      </section>
    </PageShell>
  );
}
