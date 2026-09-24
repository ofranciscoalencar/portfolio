export type Lang = "en" | "pt";

export const DEFAULT_LANG: Lang = "en";

export function resolveLang(value: string | string[] | undefined): Lang {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === "pt" ? "pt" : "en";
}

export function langQuery(lang: Lang): string {
  return lang === "pt" ? "?lang=pt" : "";
}

export function withLang(path: string, lang: Lang): string {
  if (lang === "en") return path;
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}lang=pt`;
}
