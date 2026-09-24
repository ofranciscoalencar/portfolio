import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { FilmBrowser } from "@/components/FilmBrowser";
import { JsonLdScript } from "@/components/JsonLdScript";
import { resolveLang, type Lang } from "@/lib/i18n";
import {
  brands,
  getBrandBySlug,
  getFilmsByBrand,
  type BrandSlug,
} from "@/data/work";
import { videoJsonLd } from "@/lib/schema";

export function generateStaticParams() {
  return brands.map((b) => ({ brand: b.slug }));
}

export async function generateMetadata(
  props: PageProps<"/branded/[brand]">
): Promise<Metadata> {
  const { brand: brandSlug } = await props.params;
  const brand = getBrandBySlug(brandSlug as BrandSlug);
  if (!brand) return {};
  const count = getFilmsByBrand(brand.slug).length;
  const filmsLabel = count === 1 ? "film" : "films";
  return {
    title: brand.name,
    description:
      count > 0
        ? `${count} branded ${filmsLabel} for ${brand.name}. Creative direction by Francisco Alencar.`
        : `Work for ${brand.name}. Creative direction by Francisco Alencar.`,
  };
}

const labels: Record<
  Lang,
  { back: string; empty: string; tagsLabel: string }
> = {
  en: {
    back: "ALL BRANDS",
    empty: "Films coming soon. Write for early access to the cut.",
    tagsLabel: "DETAILS",
  },
  pt: {
    back: "TODAS AS MARCAS",
    empty: "Filmes em breve. Escreva para acesso antecipado ao corte.",
    tagsLabel: "DETALHES",
  },
};

export default async function BrandDetailPage(
  props: PageProps<"/branded/[brand]">
) {
  const { brand: brandSlug } = await props.params;
  const { lang: langRaw } = await props.searchParams;
  const lang = resolveLang(langRaw);

  const brand = getBrandBySlug(brandSlug as BrandSlug);
  if (!brand) notFound();

  const filmsInBrand = getFilmsByBrand(brand.slug);
  const t = labels[lang];

  // Emit one VideoObject JSON-LD per film so search engines still index
  // each film individually even though they live on the same page.
  const filmsSchemaGraph = {
    "@context": "https://schema.org",
    "@graph": filmsInBrand.map((f) => videoJsonLd(f, brand)),
  };

  return (
    <PageShell lang={lang} showFooter={false}>
      {filmsInBrand.length > 0 && <JsonLdScript data={filmsSchemaGraph} />}
      <FilmBrowser
        brand={brand}
        films={filmsInBrand}
        lang={lang}
        labels={t}
      />
    </PageShell>
  );
}
