import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { HoverReel, type HoverReelItem } from "@/components/HoverReel";
import { getBrandsCopy } from "@/content/brands";
import { resolveLang, withLang } from "@/lib/i18n";
import { brands, films } from "@/data/work";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Branded entertainment by Francisco Alencar for Google, YouTube, TikTok, Waze, Motorola, Mercado Livre, Netflix, CazéTV, and Nubank. 20+ films, 100M+ combined views, including the YouTube global Pride campaign with Kobe Bryant and Neymar and the most-watched Google ad in Brazil.",
};

export default async function BrandedIndexPage(
  props: PageProps<"/branded">
) {
  const { lang: langRaw } = await props.searchParams;
  const lang = resolveLang(langRaw);
  const copy = getBrandsCopy(lang);

  const orderedBrands = [...brands].sort((a, b) => a.order - b.order);

  const items: HoverReelItem[] = orderedBrands.map((brand) => {
    const brandFilms = films
      .filter((f) => f.brand === brand.slug && !f.comingSoon)
      .sort((a, b) => a.order - b.order);
    const hero = brandFilms.find((f) => f.featured) ?? brandFilms[0];
    // Per 2026-05-04: drop the film-count meta from the brand list.
    // The brand name alone is the affordance; counts read as noise.
    return {
      label: brand.name.toUpperCase(),
      href: withLang(`/branded/${brand.slug}`, lang),
      videoSrc: hero ? `/videos/edits-15s/${hero.slug}.mp4` : undefined,
    };
  });

  // Render the page header (eyebrow + H1 + intro) as a small block
  // that HoverReel composes above the brand list — fixes the prior
  // missing-context state where mobile users landed on a bare list.
  const header = (
    <>
      <div className="font-mono text-[11px] tracking-[0.08em] text-foreground/60 mb-3">
        {copy.eyebrow.toUpperCase()} ·{" "}
        {orderedBrands.length}{" "}
        {lang === "pt" ? "MARCAS" : "BRANDS"}
      </div>
      <h1
        className="font-display font-medium leading-[0.95] tracking-[-0.02em] text-foreground"
        style={{ fontSize: "clamp(56px, 9vw, 120px)" }}
      >
        {copy.title}
      </h1>
      <p
        className="mt-4 max-w-md text-foreground/80 leading-relaxed"
        style={{ fontSize: "clamp(14px, 1.2vw, 16px)" }}
      >
        {copy.intro}
      </p>
    </>
  );

  return (
    <PageShell lang={lang} showFooter={false}>
      <HoverReel items={items} header={header} />
    </PageShell>
  );
}
