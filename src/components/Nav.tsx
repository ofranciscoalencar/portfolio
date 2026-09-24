import Link from "next/link";
import { LangToggle } from "./LangToggle";
import { MobileMenu } from "./MobileMenu";
import { withLang, type Lang } from "@/lib/i18n";

const labels = {
  en: {
    ai: "AI",
    brands: "BRANDED",
    entertainment: "ENTERTAINMENT",
    meet: "MEET",
  },
  pt: {
    ai: "AI",
    brands: "MARCAS",
    entertainment: "ENTRETENIMENTO",
    meet: "CONTATO",
  },
} as const;

export function Nav({ lang }: { lang: Lang }) {
  const t = labels[lang];
  // White by default. Accent-red on hover. text-shadow gives a subtle
  // dark halo so the menu stays legible if it ever passes over a bright
  // section of a hero video.
  const linkClass =
    "inline-block py-2 px-1 text-white hover:text-accent transition-colors tabular-nums [text-shadow:_0_1px_2px_rgba(0,0,0,0.45)]";

  return (
    <>
      {/* Mobile hamburger + overlay (hidden ≥ md). Replaces the inline
          nav strip on phones — see MobileMenu for the rationale. */}
      <MobileMenu lang={lang} />

      {/* Desktop inline nav (hidden < md). The 11px strip works fine on
          a wide canvas where the surrounding chrome makes it readable. */}
      <header
        className="hidden md:block fixed inset-x-0 top-0 z-50"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <nav className="flex items-center justify-between px-4 py-3 md:px-10 md:py-6 text-foreground">
          <Link
            href={withLang("/", lang)}
            className="inline-block font-display text-[13px] font-medium tracking-[0.02em] py-2"
          >
            FRANCISCO ALENCAR
          </Link>
          <ul className="flex items-center gap-4 md:gap-8 font-mono text-[11px] tracking-[0.08em]">
            <li>
              <Link href={withLang("/ai", lang)} className={linkClass}>
                {t.ai}
              </Link>
            </li>
            <li>
              <Link href={withLang("/branded", lang)} className={linkClass}>
                {t.brands}
              </Link>
            </li>
            <li>
              <Link
                href={withLang("/entertainment", lang)}
                className={linkClass}
              >
                {t.entertainment}
              </Link>
            </li>
            <li>
              <Link href={withLang("/meet", lang)} className={linkClass}>
                {t.meet}
              </Link>
            </li>
            <li>
              <LangToggle lang={lang} />
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
