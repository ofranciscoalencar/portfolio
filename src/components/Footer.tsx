import type { Lang } from "@/lib/i18n";
import { EMAIL, INSTAGRAM_URL, LINKEDIN_URL } from "@/lib/contact";

const copy = {
  en: {
    role: "Branded Entertainment Creative",
    location: "São Paulo, Available Globally",
  },
  pt: {
    role: "Branded Entertainment Creative",
    location: "São Paulo, Disponível Globalmente",
  },
} as const;

const YEAR = new Date().getFullYear();

export function Footer({ lang }: { lang: Lang }) {
  const t = copy[lang];

  return (
    <footer
      className="mt-32 border-t border-line px-6 py-10 md:px-10 md:py-14"
      style={{ paddingBottom: "max(2.5rem, env(safe-area-inset-bottom))" }}
    >
      <div className="grid gap-10 md:grid-cols-3">
        <div className="space-y-2">
          <p className="font-display text-[13px] font-medium tracking-[0.02em]">
            FRANCISCO ALENCAR
          </p>
          <p className="text-sm text-muted">{t.role}</p>
        </div>

        <div className="space-y-2 md:text-center">
          <p className="font-mono text-[11px] tracking-[0.08em] text-muted">
            {t.location.toUpperCase()}
          </p>
        </div>

        <div className="space-y-2 md:text-right">
          <a
            href={`mailto:${EMAIL}`}
            className="block text-sm hover:text-accent transition-colors"
          >
            {EMAIL}
          </a>
          <div className="flex gap-4 md:justify-end font-mono text-[11px] tracking-[0.08em] text-muted">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              LINKEDIN
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              INSTAGRAM
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-line flex items-center justify-between font-mono text-[10px] tracking-[0.08em] text-muted">
        <span>© {YEAR} FRANCISCO ALENCAR</span>
        <span>v1.0</span>
      </div>
    </footer>
  );
}
