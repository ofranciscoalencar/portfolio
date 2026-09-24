"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { Lang } from "@/lib/i18n";

export function LangToggle({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const buildHref = (target: Lang) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (target === "en") params.delete("lang");
    else params.set("lang", "pt");
    const qs = params.toString();
    return `${pathname}${qs ? `?${qs}` : ""}`;
  };

  const itemClass = (active: boolean) =>
    `inline-block py-2 px-1 ${
      active
        ? "text-foreground"
        : "text-muted hover:text-foreground transition-colors"
    }`;

  return (
    <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.08em]">
      <Link
        href={buildHref("en")}
        className={itemClass(lang === "en")}
        aria-current={lang === "en" ? "true" : undefined}
      >
        EN
      </Link>
      <span className="text-line" aria-hidden>
        /
      </span>
      <Link
        href={buildHref("pt")}
        className={itemClass(lang === "pt")}
        aria-current={lang === "pt" ? "true" : undefined}
      >
        PT
      </Link>
    </div>
  );
}
