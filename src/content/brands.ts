import type { Lang } from "@/lib/i18n";

export type BrandsPageCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  filmsLabel: (n: number) => string;
};

const dict: Record<Lang, BrandsPageCopy> = {
  en: {
    eyebrow: "WORK",
    title: "BRANDS",
    intro:
      "Films made for brands that culture actually watches. 20+ films, 140M+ views, across the nine brands featured here.",
    filmsLabel: (n) => (n === 1 ? "1 FILM" : `${n} FILMS`),
  },
  pt: {
    eyebrow: "TRABALHOS",
    title: "MARCAS",
    intro:
      "Filmes feitos para marcas que a cultura realmente assiste. 20+ filmes, 140M+ views, nas nove marcas aqui reunidas.",
    filmsLabel: (n) => (n === 1 ? "1 FILME" : `${n} FILMES`),
  },
};

export function getBrandsCopy(lang: Lang): BrandsPageCopy {
  return dict[lang];
}
