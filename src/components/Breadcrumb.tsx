import Link from "next/link";
import { Fragment } from "react";
import { withLang, type Lang } from "@/lib/i18n";

export type Crumb = {
  label: string;
  href?: string;
};

export function Breadcrumb({
  lang,
  items,
}: {
  lang: Lang;
  items: Crumb[];
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="font-mono text-[11px] tracking-[0.08em] text-muted"
    >
      <ol className="flex items-center gap-2 flex-wrap">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <Fragment key={`${item.label}-${i}`}>
              <li>
                {item.href && !isLast ? (
                  <Link
                    href={withLang(item.href, lang)}
                    className="hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? "text-foreground" : ""}>
                    {item.label}
                  </span>
                )}
              </li>
              {!isLast && (
                <li aria-hidden className="text-line">
                  /
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
